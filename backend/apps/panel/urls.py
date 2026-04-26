from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .jwt_views import StaffTokenObtainPairView
from .views import PanelLeadViewSet, PanelNewsViewSet, panel_site, panel_stats

router = DefaultRouter()
router.register("leads", PanelLeadViewSet, basename="panel-lead")
router.register("news", PanelNewsViewSet, basename="panel-news")

urlpatterns = [
    path("auth/token/", StaffTokenObtainPairView.as_view(), name="panel-token"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="panel-token-refresh"),
    path("stats/", panel_stats, name="panel-stats"),
    path("site/", panel_site, name="panel-site"),
    path("", include(router.urls)),
]
