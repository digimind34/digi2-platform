from django.conf import settings
from django.db import models


class BusinessProfile(models.Model):
    """
    Business profile for handymen and business owners.

    Each profile belongs to one user.
    This allows a handyman/business owner to publicly show their services,
    contact details, location, and business information.
    """

    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="business_profile",
        help_text="The user who owns this business profile.",
    )

    business_name = models.CharField(
        max_length=255,
        help_text="Public name of the business.",
    )

    description = models.TextField(
        blank=True,
        help_text="Short explanation of what the business does.",
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
        help_text="Business contact phone number.",
    )

    address = models.TextField(
        blank=True,
        help_text="Business address or operating address.",
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        help_text="City where the business operates.",
    )

    service_area = models.CharField(
        max_length=255,
        blank=True,
        help_text="Areas covered by this business, e.g. Toronto, Brampton, GTA.",
    )

    logo = models.ImageField(
        upload_to="business_logos/",
        blank=True,
        null=True,
        help_text="Optional business logo.",
    )

    website = models.URLField(
        blank=True,
        help_text="Optional business website.",
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Admin verification status.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date this business profile was created.",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date this business profile was last updated.",
    )

    def __str__(self):
        return self.business_name


class Service(models.Model):
    business = models.ForeignKey(
        "businesses.BusinessProfile",
        on_delete=models.CASCADE,
        related_name="services"
    )
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to="services/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="requests"
    )
    business = models.ForeignKey(
        BusinessProfile,
        on_delete=models.CASCADE,
        related_name="service_requests"
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_requests"
    )

    message = models.TextField()
    preferred_date = models.DateField(null=True, blank=True)
    preferred_time = models.TimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.service.title} request from {self.customer}"
