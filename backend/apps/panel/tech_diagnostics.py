"""Server / content diagnostics for the technical logs panel."""

from __future__ import annotations

import os
import platform
import sys
from datetime import timedelta

from django.conf import settings
from django.db import connection
from django.utils import timezone

from apps.leads.models import Lead
from apps.news.models import News
from apps.services.models import Service
from apps.siteinfo.models import SiteContent


def collect_system_info() -> dict:
    db_engine = settings.DATABASES["default"]["ENGINE"]
    db_kind = "postgresql" if "postgresql" in db_engine else "sqlite" if "sqlite" in db_engine else db_engine
    media_root = str(settings.MEDIA_ROOT)
    try:
        media_exists = os.path.isdir(media_root)
    except OSError:
        media_exists = False

    return {
        "python": sys.version.split()[0],
        "platform": platform.platform(),
        "django_debug": bool(settings.DEBUG),
        "time_zone": settings.TIME_ZONE,
        "database": db_kind,
        "email_backend": settings.EMAIL_BACKEND.rsplit(".", 1)[-1],
        "email_host_configured": bool(settings.EMAIL_HOST_PASSWORD),
        "media_root": media_root,
        "media_root_exists": media_exists,
        "allowed_hosts": list(settings.ALLOWED_HOSTS),
        "site_public_url": getattr(settings, "SITE_PUBLIC_URL", ""),
        "tech_password_configured": bool(getattr(settings, "TECH_LOGS_PASSWORD", "")),
    }


def collect_issues() -> list[dict]:
    """Return actionable findings: severity warning|error|info."""
    issues: list[dict] = []
    now = timezone.now()

    if settings.DEBUG:
        issues.append(
            {
                "severity": "warning",
                "code": "debug_on",
                "title": "DJANGO_DEBUG включён",
                "detail": "В production DEBUG должен быть false — иначе утекают traceback и внутренние пути.",
            }
        )

    if "sqlite" in settings.DATABASES["default"]["ENGINE"]:
        issues.append(
            {
                "severity": "info",
                "code": "sqlite",
                "title": "Используется SQLite",
                "detail": "Для локальной разработки нормально. На проде ожидается PostgreSQL.",
            }
        )

    if not settings.EMAIL_HOST_PASSWORD:
        issues.append(
            {
                "severity": "warning",
                "code": "smtp_password",
                "title": "Не задан EMAIL_HOST_PASSWORD",
                "detail": "Письма по новым заявкам могут не уходить (или уходить только в консоль).",
            }
        )

    site = SiteContent.objects.order_by("pk").first()
    if not site:
        issues.append(
            {
                "severity": "error",
                "code": "sitecontent_missing",
                "title": "Нет записи SiteContent",
                "detail": "Контакты и тексты главной не отдаются API. Создайте запись или выполните seed.",
            }
        )
    else:
        if not (site.phone and site.email):
            issues.append(
                {
                    "severity": "warning",
                    "code": "site_contacts",
                    "title": "Неполные контакты сайта",
                    "detail": "В SiteContent пустые телефон и/или email.",
                }
            )
        if not site.hero_title:
            issues.append(
                {
                    "severity": "info",
                    "code": "hero_empty",
                    "title": "Пустой hero-заголовок",
                    "detail": "На главной может отображаться пустой H1.",
                }
            )

    no_image = Service.objects.filter(image="").count() + Service.objects.filter(image__isnull=True).count()
    total_services = Service.objects.count()
    if total_services and no_image:
        issues.append(
            {
                "severity": "info",
                "code": "services_without_image",
                "title": f"Услуги без загруженного фото: {no_image} из {total_services}",
                "detail": "На сайте могут использоваться запасные картинки по slug. Загрузите фото в разделе «Услуги».",
            }
        )

    empty_full = Service.objects.filter(full_desc="").count()
    if empty_full:
        issues.append(
            {
                "severity": "info",
                "code": "services_empty_full_desc",
                "title": f"Услуги без полного описания: {empty_full}",
                "detail": "Страница услуги может выглядеть бедной без full_desc / detail.",
            }
        )

    drafts = News.objects.filter(is_published=False).count()
    if drafts:
        issues.append(
            {
                "severity": "info",
                "code": "news_drafts",
                "title": f"Черновики новостей: {drafts}",
                "detail": "Не опубликованы и не видны на сайте.",
            }
        )

    stale_new = Lead.objects.filter(status="new", created_at__lt=now - timedelta(days=3)).count()
    if stale_new:
        issues.append(
            {
                "severity": "warning",
                "code": "stale_leads",
                "title": f"Новые заявки старше 3 дней: {stale_new}",
                "detail": "Проверьте раздел «Заявки» — возможно, их забыли обработать.",
            }
        )

    # DB connectivity smoke check
    try:
        connection.ensure_connection()
    except Exception as exc:  # noqa: BLE001
        issues.append(
            {
                "severity": "error",
                "code": "db_connection",
                "title": "Ошибка подключения к БД",
                "detail": str(exc)[:400],
            }
        )

    if not getattr(settings, "TECH_LOGS_PASSWORD", ""):
        issues.append(
            {
                "severity": "error",
                "code": "tech_password_missing",
                "title": "TECH_LOGS_PASSWORD не задан",
                "detail": "Раздел технических логов недоступен, пока не задан секретный пароль.",
            }
        )

    severity_rank = {"error": 0, "warning": 1, "info": 2}
    issues.sort(key=lambda x: severity_rank.get(x["severity"], 9))
    return issues


def collect_counts() -> dict:
    return {
        "services": Service.objects.count(),
        "news": News.objects.count(),
        "leads_total": Lead.objects.count(),
        "leads_new": Lead.objects.filter(status="new").count(),
        "sitecontent": SiteContent.objects.count(),
    }
