from rest_framework import serializers

from config.api_i18n import get_api_lang, pick_str

from .models import PriceCategory, PriceItem


class PriceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceItem
        fields = (
            "id",
            "title",
            "price_from",
            "price_to",
            "price_display",
            "duration",
            "order",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        data["duration"] = pick_str(data.get("duration") or "", instance.duration_en, True)
        return data


class PriceCategorySerializer(serializers.ModelSerializer):
    items = PriceItemSerializer(many=True, read_only=True)

    class Meta:
        model = PriceCategory
        fields = ("id", "title", "order", "service", "items")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        return data
