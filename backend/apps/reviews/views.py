from django.db.models import Avg
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReviewSerializer
    pagination_class = None

    def get_queryset(self):
        qs = Review.objects.filter(is_active=True).order_by("-created_at")
        slug = self.request.query_params.get("service")
        if slug:
            qs = qs.filter(service_slug=slug)
        return qs

    @action(detail=False, methods=["get"])
    def stats(self, request):
        agg = Review.objects.filter(is_active=True).aggregate(avg=Avg("rating"))
        return Response(
            {
                "average_rating": round(float(agg["avg"] or 0), 2),
                "count": Review.objects.filter(is_active=True).count(),
            }
        )
