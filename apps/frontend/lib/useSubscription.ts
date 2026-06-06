"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";

export type Subscription = {
  plan: string;
  active: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id?: string | null;
};

export function useSubscription() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    let isActive = true;

    apiRequest<Subscription>("/api/billing/me/")
      .then((data) => {
        if (isActive) {
          setSubscription(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setSubscription(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const isPremium =
    Boolean(subscription?.active) &&
    Boolean(subscription?.plan) &&
    subscription?.plan !== "free";

  return {
    loading,
    subscription,
    isPremium,
  };
}
