"""AmoCRM API v4 client: OAuth tokens + create lead from site applications."""

from __future__ import annotations

import json
import logging
import re
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from django.conf import settings

from .emails import SOURCE_HUMAN_RU
from .models import Lead

logger = logging.getLogger(__name__)


def amocrm_enabled() -> bool:
    return bool(
        getattr(settings, "AMOCRM_SUBDOMAIN", "")
        and getattr(settings, "AMOCRM_CLIENT_ID", "")
        and getattr(settings, "AMOCRM_CLIENT_SECRET", "")
        and (
            getattr(settings, "AMOCRM_ACCESS_TOKEN", "")
            or _tokens_path().is_file()
        )
    )


def _tokens_path() -> Path:
    custom = getattr(settings, "AMOCRM_TOKENS_PATH", "") or ""
    if custom:
        return Path(custom)
    return Path(settings.BASE_DIR) / ".amocrm_tokens.json"


def _load_tokens() -> dict[str, str]:
    path = _tokens_path()
    data: dict[str, str] = {
        "access_token": getattr(settings, "AMOCRM_ACCESS_TOKEN", "") or "",
        "refresh_token": getattr(settings, "AMOCRM_REFRESH_TOKEN", "") or "",
    }
    if path.is_file():
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(raw, dict):
                if raw.get("access_token"):
                    data["access_token"] = str(raw["access_token"])
                if raw.get("refresh_token"):
                    data["refresh_token"] = str(raw["refresh_token"])
        except (OSError, json.JSONDecodeError) as exc:
            logger.warning("amocrm.tokens.read_failed err=%s", exc)
    return data


def save_tokens(access_token: str, refresh_token: str) -> None:
    path = _tokens_path()
    payload = {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        path.chmod(0o600)
    except OSError:
        pass


def _base_url() -> str:
    subdomain = (settings.AMOCRM_SUBDOMAIN or "").strip().rstrip("/")
    if subdomain.startswith("http"):
        return subdomain.rstrip("/")
    return f"https://{subdomain}.amocrm.ru"


def _request(
    method: str,
    path: str,
    *,
    body: Any | None = None,
    token: str | None = None,
    form_urlencoded: bool = False,
) -> Any:
    url = path if path.startswith("http") else f"{_base_url()}{path}"
    headers = {"Accept": "application/json"}
    data = None
    if body is not None:
        if form_urlencoded:
            from urllib.parse import urlencode

            data = urlencode(body).encode("utf-8")
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            data = json.dumps(body, ensure_ascii=False).encode("utf-8")
            headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        err_body = exc.read().decode("utf-8", errors="replace")
        raise AmocrmApiError(exc.code, err_body) from exc


class AmocrmApiError(Exception):
    def __init__(self, status: int, body: str):
        self.status = status
        self.body = body
        super().__init__(f"AmoCRM HTTP {status}: {body[:300]}")


def exchange_authorization_code(code: str, redirect_uri: str | None = None) -> dict[str, Any]:
    redirect = (redirect_uri or settings.AMOCRM_REDIRECT_URI or "").strip()
    payload = {
        "client_id": settings.AMOCRM_CLIENT_ID,
        "client_secret": settings.AMOCRM_CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code.strip(),
        "redirect_uri": redirect,
    }
    data = _request("POST", "/oauth2/access_token", body=payload)
    access = data.get("access_token") or ""
    refresh = data.get("refresh_token") or ""
    if not access or not refresh:
        raise AmocrmApiError(400, f"unexpected token response: {data}")
    save_tokens(access, refresh)
    return data


def refresh_access_token() -> str:
    tokens = _load_tokens()
    refresh = tokens.get("refresh_token") or ""
    if not refresh:
        raise AmocrmApiError(401, "refresh_token missing")
    payload = {
        "client_id": settings.AMOCRM_CLIENT_ID,
        "client_secret": settings.AMOCRM_CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": refresh,
        "redirect_uri": settings.AMOCRM_REDIRECT_URI,
    }
    data = _request("POST", "/oauth2/access_token", body=payload)
    access = data.get("access_token") or ""
    new_refresh = data.get("refresh_token") or refresh
    if not access:
        raise AmocrmApiError(401, f"refresh failed: {data}")
    save_tokens(access, new_refresh)
    return access


def _authed_request(method: str, path: str, body: Any | None = None) -> Any:
    tokens = _load_tokens()
    access = tokens.get("access_token") or ""
    if not access:
        raise AmocrmApiError(401, "access_token missing")
    try:
        return _request(method, path, body=body, token=access)
    except AmocrmApiError as exc:
        if exc.status != 401:
            raise
        access = refresh_access_token()
        return _request(method, path, body=body, token=access)


def list_pipelines() -> list[dict[str, Any]]:
    data = _authed_request("GET", "/api/v4/leads/pipelines")
    return list((data.get("_embedded") or {}).get("pipelines") or [])


def _digits_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    if len(digits) == 11 and digits.startswith("8"):
        digits = "7" + digits[1:]
    if len(digits) == 10:
        digits = "7" + digits
    return digits


def _lead_note(lead: Lead) -> str:
    source = SOURCE_HUMAN_RU.get(lead.source, lead.get_source_display())
    lines = [
        f"Заявка с сайта «Резидент» #{lead.id}",
        f"Источник: {source}",
    ]
    if lead.source_page:
        lines.append(f"Страница: {lead.source_page}")
    if lead.service:
        lines.append(f"Услуга: {lead.service}")
    if lead.citizenship:
        lines.append(f"Гражданство: {lead.citizenship}")
    if lead.region:
        lines.append(f"Регион: {lead.region}")
    if lead.message:
        lines.append(f"Сообщение: {lead.message}")
    return "\n".join(lines)


def push_lead_to_amocrm(lead: Lead) -> dict[str, Any] | None:
    """Create contact+deal in AmoCRM. Returns API payload or None if disabled."""
    if not amocrm_enabled():
        return None

    phone_digits = _digits_phone(lead.phone)
    contact_name = (lead.name or "").strip() or f"Клиент {lead.phone}"
    source_label = SOURCE_HUMAN_RU.get(lead.source, lead.get_source_display())
    deal_name = f"Заявка с сайта · {source_label}"
    if lead.service:
        deal_name = f"{deal_name} · {lead.service}"

    contact: dict[str, Any] = {"name": contact_name}
    if phone_digits:
        contact["custom_fields_values"] = [
            {
                "field_code": "PHONE",
                "values": [{"value": f"+{phone_digits}", "enum_code": "WORK"}],
            }
        ]

    item: dict[str, Any] = {
        "name": deal_name[:255],
        "price": 0,
        "_embedded": {"contacts": [contact]},
    }
    pipeline_id = getattr(settings, "AMOCRM_PIPELINE_ID", None)
    status_id = getattr(settings, "AMOCRM_STATUS_ID", None)
    if pipeline_id:
        item["pipeline_id"] = int(pipeline_id)
    if status_id:
        item["status_id"] = int(status_id)

    tags = [{"name": "сайт"}, {"name": lead.source or "other"}]
    item["_embedded"]["tags"] = tags

    created = _authed_request("POST", "/api/v4/leads/complex", body=[item])
    lead_id = None
    if isinstance(created, list) and created:
        lead_id = created[0].get("id")
    elif isinstance(created, dict):
        leads = (created.get("_embedded") or {}).get("leads") or []
        if leads:
            lead_id = leads[0].get("id")

    if lead_id:
        note_text = _lead_note(lead)
        try:
            _authed_request(
                "POST",
                f"/api/v4/leads/{lead_id}/notes",
                body=[
                    {
                        "note_type": "common",
                        "params": {"text": note_text},
                    }
                ],
            )
        except AmocrmApiError as exc:
            logger.warning(
                "amocrm.note_failed lead_id=%s amocrm_id=%s err=%s",
                lead.id,
                lead_id,
                exc,
            )

    logger.info(
        "amocrm.lead_pushed site_lead_id=%s amocrm_lead_id=%s source=%s",
        lead.id,
        lead_id,
        lead.source,
    )
    return {"response": created, "amocrm_lead_id": lead_id}
