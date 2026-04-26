from rest_framework import serializers

from .models import Guarantee


class GuaranteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guarantee
        fields = ("id", "icon", "title", "description", "order")
