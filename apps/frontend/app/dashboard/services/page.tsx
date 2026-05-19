"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  deleteService as deleteServiceRequest,
  listServices,
  type Service,
} from "@/lib/services";

export default function ServicesDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await listServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch services.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  async function deleteService(id: number) {
    const confirmed = confirm("Are you sure you want to delete this service?");
    if (!confirmed) return;

    try {
      await deleteServiceRequest(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service.");
    }
  }

  if (loading) {
    return <p className="p-6">Loading services...</p>;
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Services</h1>
          <p className="text-gray-600">
            Manage the services your business offers.
          </p>
        </div>

        <Link
          href="/dashboard/services/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Service
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No services yet</h2>
          <p className="mt-2 text-gray-600">
            Create your first service to display it publicly.
          </p>

          <Link
            href="/dashboard/services/create"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border bg-white shadow-sm">
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-48 w-full rounded-t-xl object-cover"
                />
              )}

              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{service.title}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      service.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="line-clamp-3 text-gray-600">
                  {service.description}
                </p>

                {service.price && (
                  <p className="mt-3 font-semibold">${service.price}</p>
                )}

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/dashboard/services/${service.id}/edit`}
                    className="rounded bg-gray-900 px-3 py-2 text-sm text-white"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteService(service.id)}
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
