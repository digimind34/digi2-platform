"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type ServiceRequest = {
  id: number;
  service_title: string;
  business_name: string;
  customer_email: string;
  message: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: "pending" | "accepted" | "completed" | "cancelled";
  created_at: string;
};

export default function RequestsDashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      // Handle both flat array and DRF paginated responses
      const data = await apiRequest<ServiceRequest[] | { results: ServiceRequest[] }>(
        "/api/businesses/service-requests/"
      );
      setRequests(Array.isArray(data) ? data : data.results);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: ServiceRequest["status"]) {
    try {
      await apiRequest(`/api/businesses/service-requests/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update request status.");
    }
  }

  if (loading) {
    return <p className="p-6">Loading requests...</p>;
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Service Requests</h1>
        <p className="text-gray-600">
          Manage customer requests for your services.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No requests yet</h2>
          <p className="mt-2 text-gray-600">
            Customer requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {request.service_title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    From: {request.customer_email}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm capitalize ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status === "accepted"
                      ? "bg-blue-100 text-blue-800"
                      : request.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <p className="mb-4 text-gray-700">{request.message}</p>

              <div className="mb-4 grid gap-3 text-sm text-gray-600 md:grid-cols-3">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {request.preferred_date || "Not provided"}
                </p>

                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {request.preferred_time || "Not provided"}
                </p>

                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(request.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus(request.id, "accepted")}
                  className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(request.id, "completed")}
                  className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 transition"
                >
                  Complete
                </button>

                <button
                  onClick={() => updateStatus(request.id, "cancelled")}
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}