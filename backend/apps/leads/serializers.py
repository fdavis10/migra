from rest_framework import serializers

from .models import Lead


class LeadCreateSerializer(serializers.ModelSerializer):
    source = serializers.ChoiceField(
        choices=Lead.SOURCE,
        default="modal",
        required=False,
    )

    class Meta:
        model = Lead
        fields = (
            "name",
            "phone",
            "citizenship",
            "region",
            "service",
            "message",
            "source_page",
            "source",
        )

    def create(self, validated_data):
        return Lead.objects.create(**validated_data)
