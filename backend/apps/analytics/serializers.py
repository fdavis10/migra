from rest_framework import serializers

from .models import PageVisit


class PageVisitCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageVisit
        fields = ("path", "visitor_id")

    def validate_path(self, value: str) -> str:
        value = (value or "").strip()
        if len(value) > 512:
            raise serializers.ValidationError("Слишком длинный путь.")
        if not value.startswith("/"):
            raise serializers.ValidationError("Путь должен начинаться с «/».")
        if "\x00" in value or "\n" in value or "\r" in value:
            raise serializers.ValidationError("Некорректный путь.")
        return value

    def validate_visitor_id(self, value):
        if value is None or value == "":
            return None
        if len(value) > 64:
            raise serializers.ValidationError("Слишком длинный идентификатор.")
        return value
