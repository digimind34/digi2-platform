from rest_framework.permissions import BasePermission

from billing.utils import has_active_subscription


class RequiresActiveSubscription(BasePermission):
    message = "An active subscription is required to access this feature."

    def has_permission(self, request, view):
        return has_active_subscription(request.user)
