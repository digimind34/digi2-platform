"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createService,
  getService,
  updateService,
  type ServicePayload,
} from "@/lib/services";

type ServiceFormProps = {
  serviceId?: string;
};

const emptyForm: ServicePayload = {
  title: "",
  description: "",
  price: "",
  is_active: true,
  image: null,
};

export default function ServiceForm({ serviceId }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ServicePayload>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    let isActive = true;

    async function loadService() {
      try {
        const service = await getService(serviceId);

        if (!isActive) return;

        setForm({
          title: service.title || "",
          description: service.description || "",
          price: service.price || "",
          is_active: service.is_active,
          image: null,
        });
        setImagePreview(service.image);
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to load service.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadService();

    return () => {
      isActive = false;
    };
  }, [serviceId]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleActiveChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({
      ...current,
      is_active: event.target.checked,
    }));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setForm((current) => ({ ...current, image: file }));
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (serviceId) {
        await updateService(serviceId, form);
      } else {
        await createService(form);
      }

      router.push("/dashboard/services");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-6">Loading service...</p>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {serviceId ? "Edit Service" : "Create Service"}
          </h1>
          <p className="text-gray-600">
            Keep your public service listing clear and current.
          </p>
        </div>

        <Link href="/dashboard/services" className="rounded border px-4 py-2">
          Back
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block font-medium text-gray-700">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white p-3"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium text-gray-700">
            Description
          </span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="min-h-32 w-full rounded-md border border-gray-300 bg-white p-3"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium text-gray-700">Price</span>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white p-3"
            inputMode="decimal"
            placeholder="150.00"
          />
        </label>

        <div>
          <span className="mb-2 block font-medium text-gray-700">Image</span>
          {imagePreview && (
            <img
              src={imagePreview}
              alt=""
              className="mb-3 h-36 w-36 rounded-md border object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-md border border-gray-300 bg-white p-3"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={handleActiveChange}
            className="h-4 w-4"
          />
          <span className="font-medium text-gray-700">Active</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : serviceId ? "Update Service" : "Create Service"}
        </button>
      </form>
    </main>
  );
}
