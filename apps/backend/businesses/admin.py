# Import Django admin
from django.contrib import admin

# Import BusinessProfile model
from .models import BusinessProfile


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    # Columns shown in Django admin list page
    list_display = (
        "business_name",
        "owner",
        "city",
        "is_verified",
    )

    # Fields searchable in admin
    search_fields = (
        "business_name",
        "owner__username",
        "city",
    )

    # Sidebar filters in admin
    list_filter = (
        "is_verified",
        "city",
    )