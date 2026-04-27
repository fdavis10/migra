from rest_framework import serializers

from config.api_i18n import get_api_lang, merge_localized_json, pick_str

from .models import Service


class ServiceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            "id",
            "slug",
            "title",
            "short_desc",
            "icon",
            "price_from",
            "price_to",
            "price_note",
            "is_main",
            "order",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        data["short_desc"] = pick_str(data["short_desc"], instance.short_desc_en, True)
        data["price_note"] = pick_str(
            data.get("price_note") or "", instance.price_note_en, True
        )
        return data


class ServiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            "id",
            "slug",
            "title",
            "short_desc",
            "full_desc",
            "icon",
            "price_from",
            "price_to",
            "price_note",
            "is_main",
            "order",
            "detail",
            "created_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        data["short_desc"] = pick_str(data["short_desc"], instance.short_desc_en, True)
        data["full_desc"] = pick_str(data["full_desc"], instance.full_desc_en, True)
        data["price_note"] = pick_str(
            data.get("price_note") or "", instance.price_note_en, True
        )
        ru_detail = instance.detail or {}
        en_detail = instance.detail_en or {}
        if en_detail:
            data["detail"] = merge_localized_json(ru_detail, en_detail)
        return data
