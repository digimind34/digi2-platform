# Import Django REST Framework viewset tools
from rest_framework import viewsets

# Import Business model
from .models import Business

# Import Business serializer
from .serializers import BusinessSerializer


class BusinessViewSet(viewsets.ModelViewSet):
    # Query all businesses, newest first
    queryset = Business.objects.all().order_by("-created_at")

    # Use BusinessSerializer for JSON conversion
    serializer_class = BusinessSerializer
