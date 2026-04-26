from rest_framework import viewsets

from .models import News
from .serializers import NewsDetailSerializer, NewsListSerializer


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"

    def get_queryset(self):
        return News.objects.filter(is_published=True).order_by("-published_at", "-id")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return NewsDetailSerializer
        return NewsListSerializer
