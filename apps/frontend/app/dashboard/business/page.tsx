"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import { useSubscription } from "@/lib/useSubscription";
import type { BusinessProfile } from "@/lib/businesses";

export default function BusinessDashboardPage() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { subscription, isPremium } = useSubscription();

  useEffect(() => {
    let isActive = true;

    apiRequest<BusinessProfile>("/api/businesses/me/")
      .then((profile) => {
        if (isActive) {
          setBusiness(profile);
        }
      })
      .catch(() => {
        if (isActive) {
          setBusiness(null);
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

  return (
    <main className="page">
      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Business Dashboard</h1>
        </div>

        <Link className="button secondary" href="/dashboard">
          Back
        </Link>
      </section>

      <section className="card">
        <div className="cardHeader">
          <div>
            <h2>Subscription</h2>
            <p>
              Current Plan:{" "}
              <strong className="capitalize">
                {subscription?.plan || "Loading..."}
              </strong>
            </p>
            <p>
              Status:{" "}
              <strong>{subscription?.active ? "Active" : "Inactive"}</strong>
            </p>
          </div>

          {isPremium ? (
            <Link className="button secondary" href="/billing">
              Manage Subscription
            </Link>
          ) : (
            <Link className="button" href="/billing">
              Upgrade Plan
            </Link>
          )}
        </div>
      </section>

      {loading ? (
        <p className="empty">Loading business profile...</p>
      ) : business ? (
        <article className="card">
          <div className="cardHeader">
            <div>
              <h2>{business.business_name}</h2>
              <p>{business.city || "City not provided"}</p>
            </div>

            <span className={business.is_verified ? "badge active" : "badge inactive"}>
              {business.is_verified ? "Verified" : "Unverified"}
            </span>
          </div>

          <p className="description">
            {business.description || "No description yet."}
          </p>

          <div className="actions">
            <Link className="button" href="/business/edit">
              Edit Business
            </Link>
            <Link className="button secondary" href={`/business/${business.id}`}>
              View Public Page
            </Link>
          </div>
        </article>
      ) : (
        <section className="empty">
          <p>No business profile found for this account.</p>
          <Link className="button" href="/business/create">
            Create Business
          </Link>
        </section>
      )}
    </main>
  );
}
