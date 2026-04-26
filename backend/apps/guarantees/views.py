from rest_framework import viewsets

from .models import Guarantee
from .serializers import GuaranteeSerializer


class GuaranteeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Guarantee.objects.all().order_by("order", "id")
    serializer_class = GuaranteeSerializer
    pagination_class = None
