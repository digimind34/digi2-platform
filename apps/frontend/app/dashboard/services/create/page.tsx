"use client";

import Link from "next/link";

import { useSubscription } from "@/lib/useSubscription";
import ServiceForm from "../ServiceForm";

export default function CreateServicePage() {
  const { loading: subscriptionLoading, isPremium } = useSubscription();

  if (subscriptionLoading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-gray-600">Checking subscription status...</p>
      </main>
    );
  }

  if (!isPremium) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Service</h1>
            <p className="text-gray-600">
              Keep your public service listing clear and current.
            </p>
          </div>

          <Link href="/dashboard/services" className="rounded border px-4 py-2">
            Back
          </Link>
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Subscription Required
          </h2>
          <p className="mt-2 text-gray-600">
            Creating public services requires an active paid subscription.
          </p>

          <Link
            href="/billing"
            className="mt-5 inline-block rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Upgrade Plan
          </Link>
        </section>
      </main>
    );
  }

  return <ServiceForm />;
}
