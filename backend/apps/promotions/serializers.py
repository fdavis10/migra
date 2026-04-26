from rest_framework import serializers

from .models import Promotion


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = (
            "id",
            "title",
            "discount",
            "description",
            "is_active",
            "expires_at",
            "order",
        )
