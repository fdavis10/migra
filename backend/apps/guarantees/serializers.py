from rest_framework import serializers

from config.api_i18n import get_api_lang, pick_str

from .models import Guarantee


class GuaranteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guarantee
        fields = ("id", "icon", "title", "description", "order")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        data["description"] = pick_str(data["description"], instance.description_en, True)
        return data
