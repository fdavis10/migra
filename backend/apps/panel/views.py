from django.db.models import Count, Q
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.leads.models import Lead
from apps.news.models import News
from apps.siteinfo.models import SiteContent

from .serializers import PanelLeadSerializer, PanelNewsSerializer, PanelSiteSerializer


class PanelPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 100


class PanelLeadViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = PanelLeadSerializer
    pagination_class = PanelPagination
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        qs = Lead.objects.all().order_by("-created_at")
        src = self.request.query_params.get("source")
        if src in ("modal", "chat", "other"):
            qs = qs.filter(source=src)
        st = self.request.query_params.get("status")
        if st in ("new", "in_progress", "done", "spam"):
            qs = qs.filter(status=st)
        return qs


class PanelNewsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = PanelNewsSerializer
    queryset = News.objects.all().order_by("-published_at", "-id")
    pagination_class = PanelPagination


@api_view(["GET"])
@permission_classes([IsAdminUser])
def panel_stats(request):
    leads = Lead.objects.aggregate(
        total=Count("id"),
        modal=Count("id", filter=Q(source="modal")),
        chat=Count("id", filter=Q(source="chat")),
        new=Count("id", filter=Q(status="new")),
    )
    news_total = News.objects.count()
    news_draft = News.objects.filter(is_published=False).count()
    return Response(
        {
            "leads": leads,
            "news": {"total": news_total, "unpublished": news_draft},
            "site_configured": SiteContent.objects.exists(),
        }
    )


@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAdminUser])
def panel_site(request):
    row = SiteContent.objects.order_by("pk").first()
    if not row:
        return Response({"detail": "Запись SiteContent не найдена."}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(PanelSiteSerializer(row).data)
    ser = PanelSiteSerializer(row, data=request.data, partial=request.method == "PATCH")
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data)
