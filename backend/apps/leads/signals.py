"""Post-save signals for the Lead model: structured logging + email notification."""

from __future__ import annotations

import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

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
