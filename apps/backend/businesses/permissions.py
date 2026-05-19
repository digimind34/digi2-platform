from rest_framework.permissions import BasePermission


class IsBusinessProfileOwner(BasePermission):
    """
    Allows only the owner of a business profile to edit it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class CanCreateBusinessProfile(BasePermission):
    """
    Allows only handyman or business_owner users to create a business profile.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["handyman", "business_owner"]
        )