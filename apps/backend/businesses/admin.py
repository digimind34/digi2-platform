# Import Django admin
from django.contrib import admin

# Import Business model
from .models import Business


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    # Columns shown in Django admin list page
    list_display = (
        "name",
        "owner_name",
        "business_type",
        "city",
        "is_active",
    )

    # Fields searchable in admin
    search_fields = (
        "name",
        "owner_name",
        "city",
    )

    # Sidebar filters in admin
    list_filter = (
        "business_type",
        "is_active",
        "city",
    )