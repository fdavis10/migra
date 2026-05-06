from datetime import timedelta

from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.analytics.models import PageVisit
from apps.faq.models import FAQCategory
from apps.guarantees.models import Guarantee
from apps.leads.models import Lead
from apps.news.models import News
from apps.prices.models import PriceCategory
from apps.promotions.models import Promotion
from apps.reviews.models import Review
from apps.services.models import Service
from apps.siteinfo.models import SiteContent

from .serializers import PanelLeadSerializer, PanelNewsSerializer, PanelSiteSerializer


def _stats_period_start(days: int = 30):
    return timezone.now() - timedelta(days=days)


def _fill_daily_series(rows, key_day, key_count, days: int = 30):
    """Заполняет пропуски датами с нулём для графиков."""
    by_day = {r[key_day]: int(r[key_count]) for r in rows if r[key_day] is not None}
    out = []
    today = timezone.localdate()
    for i in range(days - 1, -1, -1):
        d = today - timedelta(days=i)
        out.append({"date": d.isoformat(), "count": by_day.get(d, 0)})
    return out


def _visits_daily_series(days: int = 30):
    start = _stats_period_start(days)
    rows = (
        PageVisit.objects.filter(created_at__gte=start)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(views=Count("id"), unique_visitors=Count("visitor_id", distinct=True))
        .order_by("day")
    )
    by_day = {r["day"]: r for r in rows if r["day"] is not None}
    today = timezone.localdate()
    out = []
    for i in range(days - 1, -1, -1):
        d = today - timedelta(days=i)
        r = by_day.get(d)
        out.append(
            {
                "date": d.isoformat(),
                "views": int(r["views"]) if r else 0,
                "unique_visitors": int(r["unique_visitors"]) if r else 0,
            }
        )
    return out


def _leads_daily_series(days: int = 30):
    start = _stats_period_start(days)
    rows = (
        Lead.objects.filter(created_at__gte=start)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )
    return _fill_daily_series(list(rows), "day", "count", days)


def _top_paths(limit: int = 10, days: int = 30):
    start = _stats_period_start(days)
    rows = (
        PageVisit.objects.filter(created_at__gte=start)
        .values("path")
        .annotate(views=Count("id"))
        .order_by("-views")[:limit]
    )
    return [{"path": r["path"], "views": r["views"]} for r in rows]


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
        if src in {key for key, _ in Lead.SOURCE}:
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
    now = timezone.now()
    promo_active_q = Q(is_active=True) & (
        Q(expires_at__isnull=True) | Q(expires_at__gt=now)
    )
    period_start = _stats_period_start(30)
    visits_qs = PageVisit.objects.filter(created_at__gte=period_start)
    visits_agg = visits_qs.aggregate(
        views=Count("id"),
        unique_visitors=Count("visitor_id", distinct=True),
    )
    catalog = {
        "services": Service.objects.count(),
        "promotions_total": Promotion.objects.count(),
        "promotions_active": Promotion.objects.filter(promo_active_q).count(),
        "price_categories": PriceCategory.objects.count(),
        "reviews_active": Review.objects.filter(is_active=True).count(),
        "faq_categories": FAQCategory.objects.count(),
        "guarantees": Guarantee.objects.count(),
    }
    return Response(
        {
            "leads": leads,
            "news": {"total": news_total, "unpublished": news_draft},
            "site_configured": SiteContent.objects.exists(),
            "catalog": catalog,
            "visits_period": {
                "days": 30,
                "views": visits_agg["views"] or 0,
                "unique_visitors": visits_agg["unique_visitors"] or 0,
            },
            "visits_series": _visits_daily_series(30),
            "leads_series": _leads_daily_series(30),
            "top_paths": _top_paths(10, 30),
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
