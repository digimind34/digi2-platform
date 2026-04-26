# Import Django REST Framework serializer tools
from rest_framework import serializers

# Import Business model
from .models import Business


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        # Tell serializer which model to convert to/from JSON
        model = Business

        # Expose all model fields in the API
        fields = "__all__"