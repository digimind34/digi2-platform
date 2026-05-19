from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import BusinessProfile, Service, ServiceRequest

User = get_user_model()


class ServiceEndpointTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            email="testuser@example.com",
            role="business_owner",
        )

        self.business = BusinessProfile.objects.create(
            owner=self.user,
            business_name="Test Business",
        )

        self.service = Service.objects.create(
            business=self.business,
            title="Initial Service",
            slug="initial-service",
            description="A test service.",
            price="100.00",
            is_active=True,
        )

        self.inactive_service = Service.objects.create(
            business=self.business,
            title="Inactive Service",
            slug="inactive-service",
            description="This is inactive.",
            price="50.00",
            is_active=False,
        )

        # Authenticate all subsequent requests as our business owner
        self.client.force_authenticate(user=self.user)

    def test_get_services_list(self):
        response = self.client.get("/api/businesses/services/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle response format regardless of whether pagination is enabled
        data = response.data.get("results", response.data) if isinstance(response.data, dict) and "results" in response.data else response.data
        self.assertEqual(len(data), 2)

    def test_create_service(self):
        data = {
            "title": "New Service",
            "description": "Brand new service",
            "price": "150.00",
            "is_active": True,
        }
        response = self.client.post("/api/businesses/services/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Service.objects.count(), 3)
        self.assertEqual(response.data["slug"], "new-service")

    def test_get_service_detail(self):
        response = self.client.get(f"/api/businesses/services/{self.service.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Initial Service")

    def test_update_service(self):
        data = {
            "title": "Updated Service",
            "description": "Updated desc",
            "price": "200.00",
            "is_active": True,
        }
        response = self.client.put(f"/api/businesses/services/{self.service.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.service.refresh_from_db()
        self.assertEqual(self.service.title, "Updated Service")

    def test_partial_update_service(self):
        data = {"price": "250.00"}
        response = self.client.patch(f"/api/businesses/services/{self.service.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.service.refresh_from_db()
        self.assertEqual(self.service.price, 250.00)

    def test_delete_service(self):
        response = self.client.delete(f"/api/businesses/services/{self.service.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Service.objects.count(), 1)

    def test_public_services_list(self):
        self.client.force_authenticate(user=None) # Disconnect user
        response = self.client.get("/api/businesses/public/services/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("results", response.data) if isinstance(response.data, dict) and "results" in response.data else response.data
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "Initial Service")

    def test_public_services_detail(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(f"/api/businesses/public/services/{self.service.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Initial Service")


class ServiceRequestEndpointTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="owneruser",
            password="testpassword",
            email="owner@example.com",
            role="business_owner",
        )

        self.customer = User.objects.create_user(
            username="customeruser",
            password="testpassword",
            email="customer@example.com",
            role="customer",
        )

        self.business = BusinessProfile.objects.create(
            owner=self.owner,
            business_name="Test Business",
        )

        self.service = Service.objects.create(
            business=self.business,
            title="Test Service",
            slug="test-service",
            description="A test service.",
            price="100.00",
            is_active=True,
        )

        self.service_request = ServiceRequest.objects.create(
            service=self.service,
            business=self.business,
            customer=self.customer,
            message="Initial request message",
            status="pending"
        )

    def test_create_service_request(self):
        self.client.force_authenticate(user=self.customer)
        data = {
            "service": self.service.id,
            "message": "I need help with this service",
            "preferred_date": "2026-06-01",
            "preferred_time": "10:00:00"
        }
        response = self.client.post("/api/businesses/service-requests/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ServiceRequest.objects.count(), 2)

    def test_get_service_requests_list(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.get("/api/businesses/service-requests/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("results", response.data) if isinstance(response.data, dict) and "results" in response.data else response.data
        self.assertEqual(len(data), 1)

    def test_get_service_request_detail(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(f"/api/businesses/service-requests/{self.service_request.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Initial request message")

    def test_update_service_request_status(self):
        self.client.force_authenticate(user=self.owner)
        data = {"status": "accepted"}
        response = self.client.patch(f"/api/businesses/service-requests/{self.service_request.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.service_request.refresh_from_db()
        self.assertEqual(self.service_request.status, "accepted")

    def test_delete_service_request(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.delete(f"/api/businesses/service-requests/{self.service_request.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ServiceRequest.objects.count(), 0)