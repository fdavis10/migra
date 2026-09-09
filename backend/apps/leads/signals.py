"""Post-save signals for the Lead model: structured logging + email + AmoCRM."""

from __future__ import annotations

import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .amocrm import AmocrmApiError, amocrm_enabled, push_lead_to_amocrm
from .emails import send_lead_email
from .models import Lead

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Lead, dispatch_uid="lead_created_notify")
def on_lead_created(sender, instance: Lead, created: bool, **kwargs) -> None:
    if not created:
        return

    logger.info(
        "lead.created id=%s source=%s phone=%s name=%s page=%s service=%s",
        instance.id,
        instance.source,
        instance.phone,
        (instance.name or "").replace(",", " "),
        instance.source_page,
        (instance.service or "").replace(",", " "),
    )

    send_lead_email(instance)

    if amocrm_enabled():
        try:
            push_lead_to_amocrm(instance)
        except AmocrmApiError as exc:
            logger.exception(
                "amocrm.push_failed lead_id=%s status=%s body=%s",
                instance.id,
                exc.status,
                exc.body[:500],
            )
        except Exception:  # noqa: BLE001
            logger.exception("amocrm.push_failed lead_id=%s", instance.id)
