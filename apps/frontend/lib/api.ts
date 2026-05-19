import type {
  BusinessProfile,
  BusinessProfilePayload,
} from "@/lib/businesses";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export type AuthResponse = {
  detail: string;
};

export type StoredTokens = {
  access?: string;
  refresh?: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "customer" | "handyman" | "business_owner" | "admin";
  is_profile_completed: boolean;
  created_at: string;
  updated_at: string;
  is_staff: boolean;
};

type RegisterResponse = {
  message: string;
  user: Pick<UserProfile, "id" | "username" | "email">;
};

type RefreshResponse = {
  detail: string;
};

function buildUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (API_URL.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${API_URL}${normalizedPath.slice("/api".length)}`;
  }

  return `${API_URL}${normalizedPath}`;
}

function getCSRFToken() {
  if (typeof document === "undefined") return "";

  const match = document.cookie.match(/csrftoken=([^;]+)/);

  return match ? match[1] : "";
}

function formatApiError(error: unknown) {
  if (!error) {
    return "Request failed";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const data = error as Record<string, unknown>;

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.non_field_errors)) {
      return data.non_field_errors.join(" ");
    }

    return JSON.stringify(data);
  }

  return String(error);
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let result: unknown = null;

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(`Expected JSON but received: ${text.slice(0, 120)}`);
    }
  }

  if (!res.ok) {
    throw new Error(formatApiError(result || res.statusText));
  }

  return result as T;
}

export async function clearStoredTokens() {
  // Since tokens are now HttpOnly cookies, we tell the backend to clear them.
  try {
    const headers = new Headers();
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }

    await fetch(buildUrl("/api/auth/logout/"), {
      method: "POST",
      headers,
      credentials: "include", // Send cookies to the backend to be cleared
    });
  } catch (error) {
    console.error("Failed to clear HttpOnly cookies:", error);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = true,
): Promise<T> {
  const headers = new Headers(options.headers);

  const csrfToken = getCSRFToken();
  const method = (options.method || "GET").toUpperCase();
  if (csrfToken && !["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    headers.set("X-CSRFToken", csrfToken);
  }

  let res = await fetch(buildUrl(path), {
    ...options,
    headers,
    credentials: "include", // Automatically send HttpOnly cookies attached to the browser
    cache: "no-store",
  });

  if (requireAuth && res.status === 401) {
    try {
      await refreshStoredAccessToken();
      res = await fetch(buildUrl(path), {
        ...options,
        headers,
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      // Refresh failed, fallback gracefully (e.g. redirect to login handled in layout/pages)
    }
  }

  return parseJsonResponse<T>(res);
}

export async function registerUser(data: RegisterData) {
  return apiRequest<RegisterResponse>(
    "/api/auth/register/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
}

export async function loginUser(data: LoginData) {
  return apiRequest<AuthResponse>(
    "/api/auth/login/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
}

export async function refreshToken() {
  return apiRequest<RefreshResponse>(
    "/api/auth/token/refresh/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // The refresh token is sent automatically via cookie!
    },
    false,
  );
}

export async function refreshStoredAccessToken() {
  try {
    return await refreshToken();
  } catch {
    clearStoredTokens();
    return null;
  }
}

export async function getCurrentUser() {
  return apiRequest<UserProfile>("/api/auth/me/");
}

export async function getProtectedData() {
  return getCurrentUser();
}

export async function getBusinessProfile() {
  return apiRequest<BusinessProfile>("/api/businesses/me/");
}

export async function createBusinessProfile(data: BusinessProfilePayload) {
  return apiRequest<BusinessProfile>("/api/businesses/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateBusinessProfile(
  data: Partial<BusinessProfilePayload>,
) {
  return apiRequest<BusinessProfile>("/api/businesses/me/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
