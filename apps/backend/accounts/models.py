from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    """
    These are the allowed user roles in the Digi2 Platform.

    CUSTOMER:
        A normal user who can request handyman/business services.

    HANDYMAN:
        A service provider who can receive job requests.

    BUSINESS_OWNER:
        A business user who can manage services, bookings, team, and profile.

    ADMIN:
        Platform administrator with full management access.
    """

    CUSTOMER = "customer", "Customer"
    HANDYMAN = "handyman", "Handyman"
    BUSINESS_OWNER = "business_owner", "Business Owner"
    ADMIN = "admin", "Admin"


class User(AbstractUser):
    """
    Custom User model for Digi2 Platform.

    This extends Django's default AbstractUser and adds a role field.
    Since authentication phases are already completed, this model supports
    role-based access for future dashboard and business features.
    """

    role = models.CharField(
        max_length=30,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER,
        help_text="Defines what this user can access inside the platform.",
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
        help_text="Optional phone number for contact or business use.",
    )

    is_profile_completed = models.BooleanField(
        default=False,
        help_text="Used to know if the user has completed onboarding.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time this user account was created.",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date and time this user account was last updated.",
    )

    def __str__(self):
        return f"{self.username} ({self.role})"