from rest_framework import serializers

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
