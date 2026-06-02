"use client";

import ServiceForm from "../ServiceForm";

export default function CreateServicePage() {
  const { loading: subscriptionLoading, isPremium } = useSubscription();
  return <ServiceForm />;
}
