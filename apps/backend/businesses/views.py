from django.utils.text import slugify
from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import BusinessProfile, Service, ServiceRequest
from .serializers import BusinessProfileSerializer, ServiceSerializer, ServiceRequestSerializer
from billing.permissions import RequiresActiveSubscription


class BusinessProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = BusinessProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        profile, created = BusinessProfile.objects.get_or_create(
            owner=self.request.user,
            defaults={
                "business_name": "",
                "description": "",
                "phone": "",
                "website": "",
                "address": "",
                "city": "",
                "service_area": "",
            },
        )
        return profile


class CreateBusinessProfileView(generics.CreateAPIView):
    serializer_class = BusinessProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PublicBusinessProfileDetailView(generics.RetrieveAPIView):
    queryset = BusinessProfile.objects.all()
    serializer_class = BusinessProfileSerializer
    permission_classes = [permissions.AllowAny]


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action == "create":
            return [
                permissions.IsAuthenticated(),
                RequiresActiveSubscription(),
            ]

        return super().get_permissions()

    def get_queryset(self):
        return Service.objects.filter(
            business__owner=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        business = BusinessProfile.objects.get(owner=self.request.user)

        subscription = getattr(self.request.user, "subscription", None)
        plan = getattr(subscription, "plan", "free")

        active_service_count = Service.objects.filter(
            business=business,
            is_active=True,
        ).count()
        is_creating_active_service = serializer.validated_data.get("is_active", True)

        if plan == "free":
            raise PermissionDenied(
                "An active subscription is required to create services."
            )

        if (
            plan == "starter"
            and is_creating_active_service
            and active_service_count >= 5
        ):
            raise PermissionDenied(
                "Starter plan allows up to 5 active services. Upgrade to Pro for unlimited services."
            )

        title = serializer.validated_data.get("title")
        base_slug = slugify(title)
        slug = base_slug
        counter = 1

        while Service.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        serializer.save(business=business, slug=slug)


class PublicServiceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        print("PUBLIC SERVICES QUERYSET HIT")
        return Service.objects.filter(is_active=True).order_by("-created_at")


class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceRequest.objects.filter(
            business__owner=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        service = serializer.validated_data.get("service")

        serializer.save(
            customer=self.request.user,
            business=service.business,
            status="pending"
        )

    def perform_update(self, serializer):
        request_obj = self.get_object()

        if request_obj.business.owner != self.request.user:
            raise PermissionDenied("You cannot update this request.")

        serializer.save()


class MyServiceRequestViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceRequest.objects.filter(
            customer=self.request.user
        ).order_by("-created_at")
