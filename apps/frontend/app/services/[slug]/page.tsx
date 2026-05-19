"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { type Service } from "@/lib/services";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    message: "",
    preferred_date: "",
    preferred_time: "",
  });

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/businesses/public/services/${slug}/`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch service");
        }

        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchService();
  }, [slug]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!service) return;

    setSubmitting(true);

    try {
      await apiRequest("/api/businesses/service-requests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service: service.id,
          message: formData.message,
          preferred_date: formData.preferred_date || null,
          preferred_time: formData.preferred_time || null,
        }),
      });

      alert("Service request submitted successfully.");

      setFormData({
        message: "",
        preferred_date: "",
        preferred_time: "",
      });
    } catch (error: any) {
      console.error("Failed to submit service request:", error);

      const errorMsg = String(error.message || "").toLowerCase();
      if (errorMsg.includes("authentication") || errorMsg.includes("credential")) {
        alert("Please login first to request this service.");
        router.push("/login");
        return;
      }

      alert(error.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="p-6">Loading service...</p>;
  }

  if (!service) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <Link href="/services" className="mt-4 inline-block text-blue-600">
          Back to services
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link href="/services" className="mb-6 inline-block text-blue-600">
        ← Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-[420px] w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              No image available
            </div>
          )}

          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-blue-600">
              Service
            </p>

            <h1 className="mt-2 text-4xl font-bold">{service.title}</h1>

            <p className="mt-4 text-gray-700">{service.description}</p>

            {service.price && (
              <p className="mt-6 text-2xl font-bold text-blue-600">
                ${service.price}
              </p>
            )}

            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Business</p>
              <p className="font-semibold">{service.business_name}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Request This Service</h2>

          <p className="mt-2 text-gray-600">
            Send a request to the business owner.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block font-medium">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3"
                placeholder="Describe what you need..."
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Preferred Date</label>
              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Preferred Time</label>
              <input
                type="time"
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Service"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}