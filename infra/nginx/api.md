# API Documentation

The DIGI2-PLATFORM backend exposes a RESTful API built with Django REST Framework (DRF).

## Authentication Flow

Authentication is handled securely via **HttpOnly Cookies** using JSON Web Tokens (JWT). The API does *not* return sensitive tokens in the JSON response body.

*   **Access Token:** Short-lived token stored as an `HttpOnly` cookie. Used to authorize requests.
*   **Refresh Token:** Long-lived token stored as an `HttpOnly` cookie. Used to silently obtain a new access token when the current one expires.
*   **CSRF Protection:** All state-changing HTTP requests (`POST`, `PUT`, `PATCH`, `DELETE`) require a valid `X-CSRFToken` header, which the frontend extracts from a separate, readable `csrftoken` cookie.

## Core Endpoints

### Authentication (`/api/auth/*`)

*   `GET /api/auth/csrf/`
    *   **Purpose:** Issues the initial CSRF cookie needed for subsequent POST requests.
*   `POST /api/auth/login/`
    *   **Purpose:** Authenticates a user and sets the `access` and `refresh` HttpOnly cookies.
    *   **Payload:** `{ "username": "...", "password": "..." }`
*   `POST /api/auth/logout/`
    *   **Purpose:** Clears the authentication cookies, securely logging the user out.
*   `POST /api/auth/token/refresh/`
    *   **Purpose:** Validates the existing `refresh` cookie and issues a new `access` cookie.
*   `POST /api/auth/register/`
    *   **Purpose:** Registers a new user account.
*   `GET /api/auth/profile/`
    *   **Purpose:** Retrieves the profile details of the currently authenticated user.

### Accounts (`/api/accounts/*`)

*   Used for legacy backward compatibility and extended user management features.

### Businesses (`/api/businesses/*`)

*   **Purpose:** Endpoints for creating, reading, updating, and deleting business entities.

## API Client Integration

The frontend interacts with the API via a centralized utility (`apps/frontend/lib/api.ts`). This client automatically handles CSRF injection, `401 Unauthorized` interceptions for silent token refreshes, and standardized error parsing.