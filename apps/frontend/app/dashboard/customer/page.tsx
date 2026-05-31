"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Subscription = {
  plan: string;
  active: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

const customerLinks = [
  {
    href: "/services",
    title: "Browse Services",
    description: "Find active services from businesses on Digi2.",
  },
  {
    href: "/dashboard/customer/requests",
    title: "My Requests",
    description: "Track the service requests you have submitted.",
  },
];

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export default function CustomerDashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    fetch("/api/billing/me/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSubscription(data))
      .catch(() => setSubscription(null));
  }, []);

  async function openCustomerPortal() {
    const csrfToken = getCookie("csrftoken");

    const res = await fetch("/api/billing/create-portal-session/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken || "",
      },
    });

    const data = await res.json();

    if (data.portal_url) {
      window.location.href = data.portal_url;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Dashboard
          </h1>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Subscription
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Current Plan:{" "}
            <span className="font-semibold capitalize">
              {subscription?.plan || "Loading..."}
            </span>
          </p>

          <p className="text-sm text-gray-600">
            Status:{" "}
            <span className="font-semibold">
              {subscription?.active ? "Active" : "Inactive"}
            </span>
          </p>

          {subscription?.stripe_customer_id && (
            <button
              onClick={openCustomerPortal}
              className="mt-4 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Manage Subscription
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {customerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}