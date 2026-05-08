"""Build and send branded HTML notifications for new leads."""

from __future__ import annotations

import logging
import re
from typing import Any

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

from .models import Lead

logger = logging.getLogger(__name__)


SOURCE_HUMAN_RU: dict[str, str] = {
    "modal": "Модальная форма консультации",
    "callback": "Обратный звонок",
    "home": "Главная страница — форма консультации",
    "contacts": "Страница контактов — форма обратной связи",
    "service": "Страница услуги — форма заявки",
    "quiz": "Тест на скидку 5%",
    "chat": "Чат со специалистом",
    "other": "Другое",
}


def _phone_for_tel(phone: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    return f"+{digits}" if digits else ""


def _format_phone_display(phone: str) -> str:
    """Light-touch formatter that keeps user-entered formatting if any."""
    return (phone or "").strip()


def _build_fields(lead: Lead, source_label: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = [
        {"label": "Источник", "value": source_label, "kind": "text"},
    ]
    if lead.name:
        rows.append({"label": "Имя", "value": lead.name, "kind": "text"})
    if lead.phone:
        rows.append(
            {
                "label": "Телефон",
                "value": _format_phone_display(lead.phone),
                "value_raw": _phone_for_tel(lead.phone),
                "kind": "phone",
            }
        )
    if lead.citizenship:
        rows.append({"label": "Гражданство", "value": lead.citizenship, "kind": "text"})
    if lead.region:
        rows.append({"label": "Регион / страна нахождения", "value": lead.region, "kind": "text"})
    if lead.service:
        rows.append({"label": "Услуга / тема", "value": lead.service, "kind": "text"})
    if lead.source_page:
        rows.append({"label": "Страница входа", "value": lead.source_page, "kind": "text"})
    rows.append(
        {
            "label": "Создана",
            "value": timezone.localtime(lead.created_at).strftime("%d.%m.%Y %H:%M"),
            "kind": "text",
        }
    )
    return rows


def _build_subject(lead: Lead, source_label: str) -> str:
    prefix = (getattr(settings, "LEADS_EMAIL_SUBJECT_PREFIX", "") or "").strip()
    base = f"Новая заявка · {source_label}"
    if lead.name:
        base += f" — {lead.name}"
    elif lead.phone:
        base += f" — {lead.phone}"
    return f"{prefix} {base}".strip() if prefix else base


def build_lead_email(lead: Lead) -> EmailMultiAlternatives | None:
    recipients = list(getattr(settings, "LEADS_RECIPIENT_EMAILS", []) or [])
    if not recipients:
        logger.warning(
            "lead.email.skip lead_id=%s reason=no_recipients_configured", lead.id
        )
        return None

    source_label = SOURCE_HUMAN_RU.get(lead.source, lead.get_source_display())
    subject = _build_subject(lead, source_label)
    fields = _build_fields(lead, source_label)
    site_url = getattr(settings, "SITE_PUBLIC_URL", "")
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "")

    context = {
        "lead": lead,
        "subject": subject,
        "source_label": source_label,
        "source_page": lead.source_page,
        "fields": fields,
        "phone_tel": _phone_for_tel(lead.phone),
        "created_local": timezone.localtime(lead.created_at),
        "site_url": site_url,
        "from_email": from_email,
    }

    text_body = render_to_string("leads/lead_email.txt", context)
    html_body = render_to_string("leads/lead_email.html", context)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=from_email or None,
        to=recipients,
    )
    msg.attach_alternative(html_body, "text/html")
    msg.extra_headers = {
        "X-Lead-Id": str(lead.id),
        "X-Lead-Source": lead.source,
    }
    if lead.phone:
        msg.reply_to = [from_email] if from_email else []
    return msg


def send_lead_email(lead: Lead) -> bool:
    msg = build_lead_email(lead)
    if msg is None:
        return False
    fail_silently = bool(getattr(settings, "LEADS_EMAIL_FAIL_SILENTLY", True))
    try:
        sent = msg.send(fail_silently=fail_silently)
    except Exception:  # pragma: no cover - logged for ops triage
        logger.exception(
            "lead.email.error lead_id=%s source=%s", lead.id, lead.source
        )
        if not fail_silently:
            raise
        return False
    logger.info(
        "lead.email.sent lead_id=%s source=%s recipients=%s sent=%s",
        lead.id,
        lead.source,
        ",".join(msg.to),
        sent,
    )
    return bool(sent)
