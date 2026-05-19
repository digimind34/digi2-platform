from rest_framework import serializers
from .models import BusinessProfile, Service, ServiceRequest


class BusinessProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="owner.email", read_only=True)
    owner_email = serializers.EmailField(source="owner.email", read_only=True)
    owner_role = serializers.CharField(source="owner.role", read_only=True)
    logo_url = serializers.SerializerMethodField()
    legacy_write_only_fields = {"business_type", "province", "postal_code"}

    class Meta:
        model = BusinessProfile
        fields = [
            "id",
            "owner",
            "owner_email",
            "owner_role",
            "business_name",
            "description",
            "phone",
            "email",
            "website",
            "address",
            "city",
            "service_area",
            "logo",
            "logo_url",
            "is_verified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "owner",
            "owner_email",
            "owner_role",
            "email",
            "is_verified",
            "created_at",
            "updated_at",
            "logo_url",
        ]

    def get_logo_url(self, obj):
        request = self.context.get("request")

        if obj.logo and hasattr(obj.logo, "url"):
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url

        return None

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = data.copy()
            for field in self.legacy_write_only_fields:
                data.pop(field, None)

        return super().to_internal_value(data)


class ServiceSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source="business.business_name", read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "business",
            "business_name",
            "title",
            "slug",
            "description",
            "price",
            "image",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "business", "slug", "created_at", "updated_at"]


class ServiceRequestSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source="service.title", read_only=True)
    business_name = serializers.CharField(source="business.business_name", read_only=True)
    customer_email = serializers.EmailField(source="customer.email", read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "service",
            "service_title",
            "business",
            "business_name",
            "customer",
            "customer_email",
            "message",
            "preferred_date",
            "preferred_time",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "business",
            "customer",
            "created_at",
            "updated_at",
        ]
