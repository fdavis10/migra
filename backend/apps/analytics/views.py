from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle

from .serializers import PageVisitCreateSerializer


class PageViewCreateThrottle(SimpleRateThrottle):
    scope = "pageview"


class PageViewCreateView(generics.CreateAPIView):
    """Принимает просмотр страницы с публичного сайта (без авторизации)."""

    permission_classes = [AllowAny]
    throttle_classes = [PageViewCreateThrottle]
    serializer_class = PageVisitCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"ok": True}, status=status.HTTP_201_CREATED)
