"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import {
  emptyBusinessProfilePayload,
  toBusinessProfilePayload,
} from "@/lib/businesses";
import type {
  BusinessProfile,
  BusinessProfilePayload,
} from "@/lib/businesses";

type BusinessProfileFormProps = {
  mode: "create" | "edit";
};

export default function BusinessProfileForm({ mode }: BusinessProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessProfilePayload>(
    emptyBusinessProfilePayload,
  );
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }

    let isActive = true;

    apiRequest<BusinessProfile>("/api/businesses/me/")
      .then((profile) => {
        if (isActive) {
          setFormData(toBusinessProfilePayload(profile));
        }
      })
      .catch((err: Error) => {
        if (isActive) {
          setError(err.message || "Could not load your business profile.");
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
  }, [mode]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const path =
        mode === "create" ? "/api/businesses/create/" : "/api/businesses/me/";
      const method = mode === "create" ? "POST" : "PATCH";

      const profile = await apiRequest<BusinessProfile>(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      router.push(`/business/${profile.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to save business profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p className="empty">Loading business profile...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">Business Profile</p>
          <h1>{mode === "create" ? "Create Business" : "Edit Business"}</h1>
        </div>

        <Link className="button secondary" href="/dashboard/business">
          Back to Business Dashboard
        </Link>
      </section>

      {error && (
        <p className="empty errorState">
          {error}
          {mode === "edit" && (
            <>
              {" "}
              <Link href="/business/create">Create one instead.</Link>
            </>
          )}
        </p>
      )}

      <form className="profileForm" onSubmit={handleSubmit}>
        <label className="field">
          <span>Business Name</span>
          <input
            name="business_name"
            type="text"
            value={formData.business_name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
          />
        </label>

        <label className="field">
          <span>Phone</span>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Website</span>
          <input
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </label>

        <label className="field">
          <span>Address</span>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label className="field">
          <span>City</span>
          <input
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Service Area</span>
          <input
            name="service_area"
            type="text"
            value={formData.service_area}
            onChange={handleChange}
            placeholder="Toronto, Brampton, GTA"
          />
        </label>

        <button className="button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Business Profile"}
        </button>
      </form>
    </main>
  );
}
