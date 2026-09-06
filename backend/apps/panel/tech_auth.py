"""Signed short-lived token for technical logs access."""

from __future__ import annotations

import hashlib
import hmac
import time

from django.conf import settings


TECH_TOKEN_TTL_SECONDS = 60 * 60 * 4  # 4 hours
TECH_TOKEN_HEADER = "HTTP_X_TECH_LOGS_TOKEN"


def get_tech_logs_password() -> str:
    return (getattr(settings, "TECH_LOGS_PASSWORD", None) or "").strip()


def verify_tech_password(password: str) -> bool:
    expected = get_tech_logs_password()
    if not expected or not password:
        return False
    return hmac.compare_digest(password.strip(), expected)


def _sign(payload: str) -> str:
    key = settings.SECRET_KEY.encode("utf-8")
    return hmac.new(key, payload.encode("utf-8"), hashlib.sha256).hexdigest()


def issue_tech_token(username: str) -> str:
    exp = int(time.time()) + TECH_TOKEN_TTL_SECONDS
    payload = f"{username}|{exp}"
    return f"{payload}|{_sign(payload)}"


def verify_tech_token(token: str, username: str | None = None) -> bool:
    if not token or token.count("|") != 2:
        return False
    user_part, exp_s, sig = token.split("|", 2)
    try:
        exp = int(exp_s)
    except ValueError:
        return False
    if exp < int(time.time()):
        return False
    payload = f"{user_part}|{exp}"
    if not hmac.compare_digest(sig, _sign(payload)):
        return False
    if username and user_part != username:
        return False
    return True
