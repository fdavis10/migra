from rest_framework import viewsets

from .models import FAQCategory
from .serializers import FAQCategorySerializer


class FAQCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQCategory.objects.prefetch_related("items").order_by("order", "id")
    serializer_class = FAQCategorySerializer
    pagination_class = None
