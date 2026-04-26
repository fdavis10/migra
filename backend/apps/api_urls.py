from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.faq.views import FAQCategoryViewSet
from apps.guarantees.views import GuaranteeViewSet
from apps.leads.views import LeadCreateView
from apps.news.views import NewsViewSet
from apps.prices.views import PriceCategoryViewSet
from apps.promotions.views import PromotionViewSet
from apps.reviews.views import ReviewViewSet
from apps.services.views import ServiceViewSet
from apps.siteinfo.views import site_contact

router = DefaultRouter()
router.register(r"services", ServiceViewSet, basename="service")
router.register(r"prices", PriceCategoryViewSet, basename="pricecategory")
router.register(r"promotions", PromotionViewSet, basename="promotion")
router.register(r"news", NewsViewSet, basename="news")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"faq", FAQCategoryViewSet, basename="faq")
router.register(r"guarantees", GuaranteeViewSet, basename="guarantee")

urlpatterns = [
    path("", include(router.urls)),
    path("leads/", LeadCreateView.as_view(), name="lead-create"),
    path("site/contact/", site_contact, name="site-contact"),
    path("panel/", include("apps.panel.urls")),
]
