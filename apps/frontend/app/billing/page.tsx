"use client";

import { useState } from "react";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const csrfToken = getCookie("csrftoken");

      const res = await fetch("/api/billing/create-checkout-session/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken || "",
        },
      });

      const data = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      setError(data.detail || "Unable to start checkout.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Plan</h1>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">DIGI2 Pro</h2>

          <p className="mt-2 text-gray-600">
            Unlock premium tools, subscription features, and advanced business support.
          </p>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            Subscription Plan
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={startCheckout}
            disabled={loading}
            className="mt-6 rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Redirecting..." : "Upgrade Plan"}
          </button>
        </div>
      </div>
    </main>
  );
}
