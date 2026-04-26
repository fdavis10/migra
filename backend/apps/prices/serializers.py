from rest_framework import serializers

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


class PriceCategorySerializer(serializers.ModelSerializer):
    items = PriceItemSerializer(many=True, read_only=True)

    class Meta:
        model = PriceCategory
        fields = ("id", "title", "order", "service", "items")
