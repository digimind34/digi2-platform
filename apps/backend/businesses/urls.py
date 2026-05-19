from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BusinessProfileView,
    CreateBusinessProfileView,
    PublicBusinessProfileDetailView,
    ServiceViewSet,
    PublicServiceViewSet,
    ServiceRequestViewSet,
    MyServiceRequestViewSet,
)

router = DefaultRouter()
router.register(r"services", ServiceViewSet, basename="services")
router.register(r"public/services", PublicServiceViewSet, basename="public-services")
router.register(r"service-requests", ServiceRequestViewSet, basename="service-requests")
router.register(r"my-service-requests", MyServiceRequestViewSet, basename="my-service-requests")

urlpatterns = [
    path("me/", BusinessProfileView.as_view(), name="business-me"),
    path("profile/", BusinessProfileView.as_view(), name="business-profile"),
    path("create/", CreateBusinessProfileView.as_view(), name="business-create"),
    path("<int:pk>/", PublicBusinessProfileDetailView.as_view(), name="business-detail"),
    path("", include(router.urls)),
]
