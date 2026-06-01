"use client";

import { useEffect, useState } from "react";

type Subscription = {
  plan: string;
  active: boolean;
  stripe_customer_id: string | null;
};

export function useSubscription() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    fetch("/api/billing/me/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data);
        setLoading(false);
      })
      .catch(() => {
        setSubscription(null);
        setLoading(false);
      });
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
