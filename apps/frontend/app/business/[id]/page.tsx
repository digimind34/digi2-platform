"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import type { BusinessProfile } from "@/lib/businesses";

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    apiRequest<BusinessProfile>(`/api/businesses/${id}/`, {}, false)
      .then((profile) => {
        if (isActive) {
          setBusiness(profile);
        }
      })
      .catch((err: Error) => {
        if (isActive) {
          setError(err.message || "Business profile could not be loaded.");
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
  }, [id]);

  if (loading) {
    return (
      <main className="page">
        <p className="empty">Loading business...</p>
      </main>
    );
  }

  if (error || !business) {
    return (
      <main className="page">
        <p className="empty errorState">
          {error || "Business profile could not be found."}
        </p>
        <Link className="button" href="/">
          Back Home
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">Business Profile</p>
          <h1>{business.business_name}</h1>
        </div>

        <span className={business.is_verified ? "badge active" : "badge inactive"}>
          {business.is_verified ? "Verified" : "Unverified"}
        </span>
      </section>

      <article className="card detailCard">
        {business.description && (
          <p className="description">{business.description}</p>
        )}

        <dl className="detailList">
          <div>
            <dt>City</dt>
            <dd>{business.city || "Not provided"}</dd>
          </div>
          <div>
            <dt>Service Area</dt>
            <dd>{business.service_area || "Not provided"}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{business.phone || "Not provided"}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>
              {business.website ? (
                <a href={business.website}>{business.website}</a>
              ) : (
                "Not provided"
              )}
            </dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{business.address || "Not provided"}</dd>
          </div>
        </dl>
      </article>
    </main>
  );
}
