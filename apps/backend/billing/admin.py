from django.contrib import admin
from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "plan", "active", "stripe_customer_id", "created_at")
    list_filter = ("plan", "active", "created_at")
    search_fields = ("user__email", "stripe_customer_id", "stripe_subscription_id")