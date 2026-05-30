from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils.decorators import method_decorator

from .models import Subscription
from accounts.models import User

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
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

            customer_email = session.get("customer_email")
            customer_id = session.get("customer")
            subscription_id = session.get("subscription")

            try:
                user = User.objects.get(email=customer_email)

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