import { apiRequest } from "@/lib/api";

export type Service = {
  id: number;
  business: number;
  business_name: string;
  title: string;
  slug: string;
  description: string;
  price: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServicePayload = {
  title: string;
  description: string;
  price: string;
  is_active: boolean;
  image?: File | null;
};

type ServiceListResponse = Service[] | { results: Service[] };

function normalizeServices(data: ServiceListResponse) {
  return Array.isArray(data) ? data : data.results;
}

function toServiceFormData(data: ServicePayload) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("is_active", String(data.is_active));

  if (data.image) {
    formData.append("image", data.image);
  }

  return formData;
}

export async function listServices() {
  const data = await apiRequest<ServiceListResponse>("/api/businesses/services/");
  return normalizeServices(data);
}

export async function listPublicServices() {
  const data = await apiRequest<ServiceListResponse>(
    "/api/businesses/public/services/",
    {},
    false,
  );
  return normalizeServices(data);
}

export async function getService(id: string | number) {
  return apiRequest<Service>(`/api/businesses/services/${id}/`);
}

export async function getPublicService(slug: string) {
  return apiRequest<Service>(
    `/api/businesses/public/services/${slug}/`,
    {},
    false,
  );
}

export async function createService(data: ServicePayload) {
  return apiRequest<Service>("/api/businesses/services/", {
    method: "POST",
    body: toServiceFormData(data),
  });
}

export async function updateService(id: string | number, data: ServicePayload) {
  return apiRequest<Service>(`/api/businesses/services/${id}/`, {
    method: "PATCH",
    body: toServiceFormData(data),
  });
}

export async function deleteService(id: string | number) {
  return apiRequest<void>(`/api/businesses/services/${id}/`, {
    method: "DELETE",
  });
}
