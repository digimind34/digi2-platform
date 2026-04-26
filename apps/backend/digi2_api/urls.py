# Import Django admin
from django.contrib import admin

# Import path and include for URL routing
from django.urls import path, include

# Main URL patterns for the whole backend project
urlpatterns = [
    # Django admin dashboard
    path("admin/", admin.site.urls),

    # Business API endpoints
    path("api/businesses/", include("businesses.urls")),
]