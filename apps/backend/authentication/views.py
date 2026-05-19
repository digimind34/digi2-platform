from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.middleware.csrf import get_token


class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as error:
            raise InvalidToken(error.args[0])

        access_token = serializer.validated_data.get("access")
        refresh_token = serializer.validated_data.get("refresh")

        response = Response(
            {"detail": "Login successful."},
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=request.is_secure(),
            samesite="Lax",
            max_age=60 * 60,
        )

        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=request.is_secure(),
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return response


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            request.data["refresh"] = refresh_token

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as error:
            raise InvalidToken(error.args[0])

        access_token = serializer.validated_data.get("access")

        response = Response(
            {"detail": "Token refreshed successfully."},
            status=status.HTTP_200_OK,
        )

        if access_token:
            response.set_cookie(
                key="access",
                value=access_token,
                httponly=True,
                secure=request.is_secure(),
                samesite="Lax",
                max_age=60 * 60,
            )

        return response


class CsrfCookieView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        token = get_token(request)
        response = Response({"detail": "CSRF cookie set."})
        response.set_cookie(
            key="csrftoken",
            value=token,
            httponly=False,
            secure=request.is_secure(),
            samesite="Lax",
            max_age=60 * 60 * 24 * 7,
        )
        return response


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        response = Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK,
        )
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response
