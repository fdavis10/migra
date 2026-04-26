from rest_framework import viewsets

from .models import Service
from .serializers import ServiceDetailSerializer, ServiceListSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    pagination_class = None

    def get_queryset(self):
        qs = Service.objects.all().order_by("order", "id")
        if self.request.query_params.get("is_main") == "true":
            qs = qs.filter(is_main=True)
        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ServiceDetailSerializer
        return ServiceListSerializer
