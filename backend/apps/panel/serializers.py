from rest_framework import serializers

from apps.leads.models import Lead
from apps.news.models import News
from apps.siteinfo.models import SiteContent


class PanelLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = (
            "id",
            "name",
            "phone",
            "citizenship",
            "region",
            "service",
            "message",
            "status",
            "source_page",
            "source",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class PanelNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = (
            "id",
            "slug",
            "title",
            "excerpt",
            "content",
            "category",
            "image",
            "is_published",
            "published_at",
        )


class PanelSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = (
            "id",
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
        )
        read_only_fields = ("id",)
