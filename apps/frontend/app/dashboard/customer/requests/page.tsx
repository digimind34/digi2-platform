"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type CustomerServiceRequest = {
  id: number;
  service_title: string;
  business_name: string;
  message: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: "pending" | "accepted" | "completed" | "cancelled";
  created_at: string;
};

type ServiceRequestListResponse =
  | CustomerServiceRequest[]
  | { results: CustomerServiceRequest[] };

function normalizeRequests(data: ServiceRequestListResponse) {
  return Array.isArray(data) ? data : data.results;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const statusStyles: Record<CustomerServiceRequest["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<CustomerServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadRequests() {
      try {
        const data = await apiRequest<ServiceRequestListResponse>(
          "/api/businesses/my-service-requests/",
        );

        if (isActive) {
          setRequests(normalizeRequests(data));
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to load requests.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <p className="p-6">Loading requests...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Customer Dashboard
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              My Service Requests
            </h1>
            <p className="mt-2 text-gray-600">
              Track the requests you have sent to businesses.
            </p>
          </div>

          <Link href="/services" className="rounded-md border bg-white px-4 py-2">
            Browse Services
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No service requests yet
            </h2>
            <p className="mt-2 text-gray-600">
              Requests you submit from public service pages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {request.service_title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {request.business_name}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm capitalize ${
                      statusStyles[request.status]
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <p className="whitespace-pre-line text-gray-700">
                  {request.message}
                </p>

                <div className="mt-5 grid gap-3 text-sm text-gray-600 md:grid-cols-3">
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{" "}
                    {request.preferred_date || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Time:</span>{" "}
                    {request.preferred_time || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Sent:</span>{" "}
                    {formatDateTime(request.created_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
