from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .tech_auth import (
    TECH_TOKEN_HEADER,
    get_tech_logs_password,
    issue_tech_token,
    verify_tech_password,
    verify_tech_token,
)
from .tech_diagnostics import collect_counts, collect_issues, collect_system_info
from .tech_logs_buffer import get_recent_logs, push_system_event


def _tech_unlocked(request) -> bool:
    token = request.META.get(TECH_TOKEN_HEADER) or request.headers.get("X-Tech-Logs-Token", "")
    username = getattr(request.user, "username", None)
    return verify_tech_token(token, username=username)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def tech_logs_unlock(request):
    if not get_tech_logs_password():
        return Response(
            {"detail": "TECH_LOGS_PASSWORD не настроен на сервере."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    password = request.data.get("password") or ""
    if not verify_tech_password(password):
        push_system_event("WARNING", f"Неверный пароль тех. логов (user={request.user.username})")
        return Response({"detail": "Неверный технический пароль."}, status=status.HTTP_403_FORBIDDEN)
    token = issue_tech_token(request.user.username)
    push_system_event("INFO", f"Разблокированы тех. логи (user={request.user.username})")
    return Response({"token": token, "expires_in": 60 * 60 * 4})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def tech_logs_overview(request):
    if not _tech_unlocked(request):
        return Response(
            {"detail": "Нужен технический пароль.", "code": "tech_locked"},
            status=status.HTTP_403_FORBIDDEN,
        )
    level = request.query_params.get("level") or None
    try:
        limit = min(int(request.query_params.get("limit", "200")), 400)
    except ValueError:
        limit = 200
    return Response(
        {
            "system": collect_system_info(),
            "counts": collect_counts(),
            "issues": collect_issues(),
            "logs": get_recent_logs(limit=limit, level=level),
        }
    )
