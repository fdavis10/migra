from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .jwt_views import StaffTokenObtainPairView
from .tech_views import tech_logs_overview, tech_logs_unlock
from .views import PanelLeadViewSet, PanelNewsViewSet, PanelServiceViewSet, panel_site, panel_stats

router = DefaultRouter()
router.register("leads", PanelLeadViewSet, basename="panel-lead")
router.register("news", PanelNewsViewSet, basename="panel-news")
router.register("services", PanelServiceViewSet, basename="panel-service")

urlpatterns = [
    path("auth/token/", StaffTokenObtainPairView.as_view(), name="panel-token"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="panel-token-refresh"),
    path("stats/", panel_stats, name="panel-stats"),
    path("site/", panel_site, name="panel-site"),
    path("tech-logs/unlock/", tech_logs_unlock, name="panel-tech-logs-unlock"),
    path("tech-logs/", tech_logs_overview, name="panel-tech-logs"),
    path("", include(router.urls)),
]
