from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    Allows access only to users with the admin role.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsCustomer(BasePermission):
    """
    Allows access only to customer users.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "customer"
        )


class IsHandyman(BasePermission):
    """
    Allows access only to handyman users.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "handyman"
        )


class IsBusinessOwner(BasePermission):
    """
    Allows access only to business owner users.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "business_owner"
        )


class IsHandymanOrBusinessOwner(BasePermission):
    """
    Allows access to both handyman and business owner users.

    This is useful for features such as:
    - creating services
    - managing bookings
    - business dashboard access
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["handyman", "business_owner"]
        )