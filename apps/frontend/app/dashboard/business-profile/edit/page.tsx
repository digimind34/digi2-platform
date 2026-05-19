"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type BusinessProfileForm = {
  business_name: string;
  phone: string;
  address: string;
  city: string;
  service_area: string;
  website: string;
  description: string;
};

type BusinessProfileResponse = BusinessProfileForm & {
  logo_url?: string | null;
};

export default function EditBusinessProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<BusinessProfileForm>({
    business_name: "",
    phone: "",
    address: "",
    city: "",
    service_area: "",
    website: "",
    description: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest<BusinessProfileResponse>(
          "/api/businesses/profile/",
        );

        setFormData({
          business_name: data.business_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          service_area: data.service_area || "",
          website: data.website || "",
          description: data.description || "",
        });

        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();

      payload.append("business_name", formData.business_name);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("service_area", formData.service_area);
      payload.append("website", formData.website);
      payload.append("description", formData.description);

      if (logoFile) {
        payload.append("logo", logoFile);
      }

      const updatedProfile = await apiRequest<BusinessProfileResponse>(
        "/api/businesses/profile/",
        {
          method: "PATCH",
          body: payload,
        },
      );

      setSuccess("Business profile updated successfully.");
      setLogoFile(null);

      if (updatedProfile.logo_url) {
        setLogoPreview(updatedProfile.logo_url);
      }

      setTimeout(() => {
        router.push("/dashboard/business-profile");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to update business profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading business profile...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Edit Business Profile
        </h1>

        {error && (
          <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-100 p-4 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Business Logo
            </label>

            {logoPreview && (
              <div className="mb-4">
                <img
                  src={logoPreview}
                  alt="Business logo preview"
                  className="h-28 w-28 rounded-md border object-cover"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Business Name
            </label>
            <input
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="Business name"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Address
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="Address"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              City
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="City"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service Area
            </label>
            <input
              name="service_area"
              value={formData.service_area}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="Service area"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Website
            </label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Business Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900"
              placeholder="Describe your business"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Business Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
