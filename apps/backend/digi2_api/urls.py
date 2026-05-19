from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from authentication.views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    CsrfCookieView,
    LogoutView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/auth/csrf/", CsrfCookieView.as_view(), name="csrf_cookie"),
    path("api/auth/login/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/accounts/", include("accounts.urls")),
    path("api/businesses/", include("businesses.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
