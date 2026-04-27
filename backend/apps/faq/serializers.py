from rest_framework import serializers

from config.api_i18n import get_api_lang, pick_str

from .models import FAQ, FAQCategory


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ("id", "question", "answer", "order")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["question"] = pick_str(data["question"], instance.question_en, True)
        data["answer"] = pick_str(data["answer"], instance.answer_en, True)
        return data


class FAQCategorySerializer(serializers.ModelSerializer):
    items = FAQItemSerializer(many=True, read_only=True)

    class Meta:
        model = FAQCategory
        fields = ("id", "title", "order", "items")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        return data
