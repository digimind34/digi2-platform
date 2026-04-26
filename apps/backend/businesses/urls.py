# Import DRF router
from rest_framework.routers import DefaultRouter

# Import Business API viewset
from .views import BusinessViewSet

# Create router instance
router = DefaultRouter()

# Register BusinessViewSet at the root of /api/businesses/
router.register(r"", BusinessViewSet, basename="business")

# Expose router-generated URLs
urlpatterns = router.urls