"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBusinessProfile } from "@/lib/api";
import {
  emptyBusinessProfilePayload,
  type BusinessProfilePayload,
} from "@/lib/businesses";

export default function CreateBusinessProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<BusinessProfilePayload>(
    emptyBusinessProfilePayload,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createBusinessProfile(formData);
      router.push("/dashboard/business-profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create business profile",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm";

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create Business Profile</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="business_name"
          placeholder="Business Name"
          value={formData.business_name}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="website"
          placeholder="Website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="service_area"
          placeholder="Service Area"
          value={formData.service_area}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={inputClass}
        />

        <textarea
          name="description"
          placeholder="Business Description"
          value={formData.description}
          onChange={handleChange}
          className={`${inputClass} md:col-span-2 min-h-32`}
        />

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-black text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
}
