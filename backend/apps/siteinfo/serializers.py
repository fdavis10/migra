from datetime import datetime, time
from zoneinfo import ZoneInfo

from rest_framework import serializers

from .models import SiteContent


def _promo_countdown_until_iso(d):
    if not d:
        return None
    tz = ZoneInfo("Europe/Moscow")
    end = datetime.combine(d, time(23, 59, 59, 999999), tzinfo=tz)
    return end.isoformat()


class SiteContentSerializer(serializers.ModelSerializer):
    promo_countdown_until = serializers.SerializerMethodField()

    class Meta:
        model = SiteContent
        fields = (
            "hero_title",
            "hero_subtitle",
            "phone",
            "email",
            "address",
            "work_hours",
            "map_embed_html",
            "whatsapp_url",
            "telegram_url",
            "vk_url",
            "about_company",
            "founder_message",
            "founder_name",
            "founder_title",
            "advantages",
            "payment_methods",
            "promo_countdown_date",
            "promo_countdown_until",
        )

    def get_promo_countdown_until(self, obj):
        return _promo_countdown_until_iso(obj.promo_countdown_date)
