from rest_framework import serializers

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
