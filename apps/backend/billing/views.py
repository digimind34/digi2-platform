from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from .serializers import SubscriptionSerializer

from .models import Subscription
from accounts.models import User

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            metadata={
                "user_id": str(request.user.id),
                "plan": "starter",
            },
            subscription_data={
                "metadata": {
                    "user_id": str(request.user.id),
                    "plan": "starter",
                }
            },
            line_items=[
                {
                    "price": settings.STRIPE_PRICE_ID,
                    "quantity": 1,
                }
            ],
            success_url="https://digibab.com/billing/success",
            cancel_url="https://digibab.com/billing/cancel",
            customer_email=request.user.email,
        )

        return Response({"checkout_url": session.url})

class CreateCustomerPortalSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subscription = getattr(request.user, "subscription", None)

        if not subscription or not subscription.stripe_customer_id:
            return Response(
                {"detail": "No Stripe customer found for this user."},
                status=400
            )

        portal_session = stripe.billing_portal.Session.create(
            customer=subscription.stripe_customer_id,
            return_url=settings.STRIPE_PORTAL_RETURN_URL,
        )

        return Response({"portal_url": portal_session.url})


class CurrentSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscription, _ = Subscription.objects.get_or_create(
            user=request.user,
            defaults={
                "plan": "free",
                "active": True,
            }
        )

        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                settings.STRIPE_WEBHOOK_SECRET,
            )
        except ValueError:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            return HttpResponse(status=400)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]

           
            customer_email = getattr(session, "customer_email", None)
            customer_id = getattr(session, "customer", None)
            subscription_id = getattr(session, "subscription", None)

            metadata = getattr(session, "metadata", None)

            user_id = None
            if metadata:
                user_id = metadata["user_id"]

            try:
                user = User.objects.get(id=user_id)

                subscription, _ = Subscription.objects.get_or_create(
                    user=user
                )

                subscription.plan = "starter"
                subscription.active = True
                subscription.stripe_customer_id = customer_id
                subscription.stripe_subscription_id = subscription_id
                subscription.save()

            except User.DoesNotExist:
                pass

        return HttpResponse(status=200)