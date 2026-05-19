"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

type BusinessProfile = {
  business_name: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  service_area: string;
  logo_url?: string | null;
};

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest<BusinessProfile>(
          "/api/businesses/profile/",
        );
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load business profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="p-6">Loading business profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div className="p-6">No business profile found.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Profile
          </h1>

          <Link
            href="/dashboard/business-profile/edit"
            className="rounded-md bg-black px-5 py-3 text-white hover:bg-gray-800"
          >
            Edit
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {profile.logo_url && (
            <div className="mb-6">
              <img
                src={profile.logo_url}
                alt={`${profile.business_name} logo`}
                className="h-32 w-32 rounded-lg border object-cover"
              />
            </div>
          )}

          <div className="space-y-4 text-gray-900">
            <p>
              <strong>Name:</strong> {profile.business_name}
            </p>

            <p>
              <strong>Description:</strong> {profile.description}
            </p>

            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>

            <p>
              <strong>Email:</strong> {profile.email}
            </p>

            <p>
              <strong>Website:</strong>{" "}
              {profile.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {profile.website}
                </a>
              ) : (
                "Not provided"
              )}
            </p>

            <p>
              <strong>Address:</strong> {profile.address}
            </p>

            <p>
              <strong>City:</strong> {profile.city}
            </p>

            <p>
              <strong>Service Area:</strong> {profile.service_area}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
