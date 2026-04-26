from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets

from .models import Promotion
from .serializers import PromotionSerializer


class PromotionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PromotionSerializer
    pagination_class = None

    def get_queryset(self):
        now = timezone.now()
        qs = Promotion.objects.filter(is_active=True).order_by("order", "id")
        return qs.filter(Q(expires_at__isnull=True) | Q(expires_at__gte=now))
