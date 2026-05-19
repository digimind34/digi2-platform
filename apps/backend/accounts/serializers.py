from rest_framework import serializers
from .models import User, UserRole


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Basic serializer for returning user data to the frontend.

    This should be used for:
    - /api/auth/me/
    - dashboard user info
    - role-based frontend routing
    """

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_profile_completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class UserRoleUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a user's role.

    This should normally be restricted to admins only.
    Do not allow normal users to freely change their own role.
    """

    role = serializers.ChoiceField(choices=UserRole.choices)

    class Meta:
        model = User
        fields = ["role"]
