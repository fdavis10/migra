from rest_framework import serializers

from apps.leads.models import Lead
from apps.news.models import News
from apps.services.models import Service
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
            "title_en",
            "excerpt_en",
            "content_en",
            "category_en",
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


class PanelServiceSerializer(serializers.ModelSerializer):
    clear_image = serializers.BooleanField(required=False, write_only=True, default=False)

    class Meta:
        model = Service
        fields = (
            "id",
            "slug",
            "title",
            "short_desc",
            "full_desc",
            "icon",
            "image",
            "clear_image",
            "price_from",
            "price_to",
            "price_note",
            "is_main",
            "order",
            "detail",
            "title_en",
            "short_desc_en",
            "full_desc_en",
            "price_note_en",
            "detail_en",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
        extra_kwargs = {
            "price_from": {"allow_null": True, "required": False},
            "price_to": {"allow_null": True, "required": False},
            "image": {"required": False, "allow_null": True},
        }

    def to_internal_value(self, data):
        if hasattr(data, "keys"):
            normalized = {}
            for key in data.keys():
                value = data.get(key)
                if key in {"price_from", "price_to"} and value in ("", None):
                    normalized[key] = None
                else:
                    normalized[key] = value
            data = normalized
        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        clear_image = validated_data.pop("clear_image", False)
        if clear_image and not validated_data.get("image"):
            if instance.image:
                instance.image.delete(save=False)
            instance.image = None
        return super().update(instance, validated_data)

    def create(self, validated_data):
        validated_data.pop("clear_image", None)
        return super().create(validated_data)
