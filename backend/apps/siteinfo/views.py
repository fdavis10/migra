from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import SiteContent
from .serializers import SiteContentSerializer


@api_view(["GET"])
def site_contact(request):
    row = SiteContent.objects.order_by("pk").first()
    if not row:
        return Response({})
    return Response(SiteContentSerializer(row).data)
