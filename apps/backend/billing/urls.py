from django.urls import path
from .views import (
    CreateCheckoutSessionView,
    CreateCustomerPortalSessionView,
    StripeWebhookView,
)

urlpatterns = [
    path(
        "create-checkout-session/",
        CreateCheckoutSessionView.as_view(),
        name="create-checkout-session",
    ),
    path(
        "create-portal-session/",
        CreateCustomerPortalSessionView.as_view(),
        name="create-portal-session",
    ),
    path(
        "webhook/",
        StripeWebhookView.as_view(),
        name="stripe-webhook",
    ),

]
