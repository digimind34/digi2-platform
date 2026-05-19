from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck
from rest_framework_simplejwt.authentication import JWTAuthentication


def enforce_csrf(request):
    def dummy_get_response(request):
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})

    if reason:
        raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)

        if header is not None:
            raw_token = self.get_raw_token(header)
            is_cookie = False
        else:
            raw_token = request.COOKIES.get("access")
            is_cookie = True

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)

        if is_cookie:
            enforce_csrf(request)

        return self.get_user(validated_token), validated_token
