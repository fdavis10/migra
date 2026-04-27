from rest_framework import serializers

from config.api_i18n import get_api_lang, pick_str

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = (
            "id",
            "name",
            "service",
            "service_slug",
            "text",
            "source",
            "rating",
            "created_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["text"] = pick_str(data["text"], instance.text_en, True)
        data["service"] = pick_str(data["service"], instance.service_en, True)
        return data
