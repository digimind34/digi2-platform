import Link from "next/link";

import type { BusinessProfile } from "@/lib/businesses";

// Component receives one business and displays it as a card
export default function BusinessCard({ business }: { business: BusinessProfile }) {
  return (
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

      <p>
        <strong>Service Area:</strong> {business.service_area || "Not provided"}
      </p>

      <p>
        <strong>Website:</strong> {business.website || "Not provided"}
      </p>

      <p>
        <strong>Phone:</strong> {business.phone || "Not provided"}
      </p>

      <p className="description">{business.description}</p>

      <Link className="button secondary" href={`/business/${business.id}`}>
        View Profile
      </Link>
    </article>
  );
}
