"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function EditBusinessProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    business_name: "",
    slug: "",
    category: "",
    description: "",
    phone: "",
    city: "",
    province: "",
    website: "",
  });

  useEffect(() => {
    apiRequest<any>("/api/business/me/")
      .then((data) => {
        setFormData({
          business_name: data.business_name || "",
          slug: data.slug || "",
          category: data.category || "",
          description: data.description || "",
          phone: data.phone || "",
          city: data.city || "",
          province: data.province || "",
          website: data.website || "",
        });
        setIsNew(false);
      })
      .catch(() => setIsNew(true))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isNew ? "/api/business/create/" : "/api/business/update/";
      const method = isNew ? "POST" : "PATCH";
      
      await apiRequest(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      router.push("/dashboard/business");
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="page"><p>Loading...</p></main>;

  return (
    <main className="page">
      <h1>{isNew ? "Create Business Profile" : "Edit Business Profile"}</h1>
      
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", marginTop: "1rem" }}>
        <div><label>Business Name</label><br/><input type="text" name="business_name" value={formData.business_name} onChange={handleChange} required /></div>
        <div><label>Slug (URL-friendly)</label><br/><input type="text" name="slug" value={formData.slug} onChange={handleChange} required /></div>
        <div><label>Category</label><br/><input type="text" name="category" value={formData.category} onChange={handleChange} required /></div>
        <div><label>Description</label><br/><textarea name="description" value={formData.description} onChange={handleChange} rows={4} /></div>
        <div><label>City</label><br/><input type="text" name="city" value={formData.city} onChange={handleChange} /></div>
        <div><label>Province</label><br/><input type="text" name="province" value={formData.province} onChange={handleChange} /></div>
        <div><label>Phone</label><br/><input type="text" name="phone" value={formData.phone} onChange={handleChange} /></div>
        <div><label>Website</label><br/><input type="url" name="website" value={formData.website} onChange={handleChange} /></div>
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
      </form>
    </main>
  );
}