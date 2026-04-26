from rest_framework import viewsets

from .models import PriceCategory
from .serializers import PriceCategorySerializer


class PriceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PriceCategorySerializer
    pagination_class = None

    def get_queryset(self):
        qs = PriceCategory.objects.prefetch_related("items").order_by("order", "id")
        cid = self.request.query_params.get("category")
        if cid and cid.isdigit():
            qs = qs.filter(pk=int(cid))
        return qs
