from rest_framework import serializers

from config.api_i18n import get_api_lang, pick_str

from .models import News


class NewsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = (
            "id",
            "slug",
            "title",
            "excerpt",
            "category",
            "published_at",
            "image",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        data["excerpt"] = pick_str(data["excerpt"], instance.excerpt_en, True)
        data["category"] = pick_str(data.get("category") or "", instance.category_en, True)
        return data


class NewsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = (
            "id",
            "slug",
            "title",
            "excerpt",
            "content",
            "category",
            "published_at",
            "image",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if get_api_lang(self.context.get("request")) != "en":
            return data
        data["title"] = pick_str(data["title"], instance.title_en, True)
        data["excerpt"] = pick_str(data["excerpt"], instance.excerpt_en, True)
        data["content"] = pick_str(data["content"], instance.content_en, True)
        data["category"] = pick_str(data.get("category") or "", instance.category_en, True)
        return data
