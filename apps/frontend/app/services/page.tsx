"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listPublicServices, type Service } from "@/lib/services";

export default function PublicServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadServices() {
      try {
        const data = await listPublicServices();

        if (isActive) {
          setServices(data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to load services.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <main className="p-6">Loading services...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              Services
            </p>
            <h1 className="text-4xl font-bold text-gray-900">
              Find Local Services
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Browse active services from businesses on Digi2.
            </p>
          </div>

          <Link href="/" className="rounded-md border bg-white px-4 py-2">
            Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {services.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No services available yet
            </h2>
            <p className="mt-2 text-gray-600">
              Active public services will appear here when businesses publish
              them.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300"
              >
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-100 text-sm font-medium text-gray-500">
                    {service.business_name}
                  </div>
                )}

                <div className="p-5">
                  <p className="text-sm font-medium text-blue-600">
                    {service.business_name}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    {service.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-gray-600">
                    {service.description}
                  </p>
                  {service.price && (
                    <p className="mt-4 font-semibold text-gray-900">
                      ${service.price}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
