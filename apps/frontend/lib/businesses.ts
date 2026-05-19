export type BusinessProfile = {
  id: number;
  owner?: number;
  email?: string;
  owner_email?: string;
  owner_role?: string;
  business_name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  service_area: string;
  logo: string | null;
  logo_url?: string | null;
  website: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type BusinessProfilePayload = {
  business_name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  service_area: string;
  website: string;
};

export const emptyBusinessProfilePayload: BusinessProfilePayload = {
  business_name: "",
  description: "",
  phone: "",
  address: "",
  city: "",
  service_area: "",
  website: "",
};

export function toBusinessProfilePayload(
  profile: BusinessProfile,
): BusinessProfilePayload {
  return {
    business_name: profile.business_name || "",
    description: profile.description || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    service_area: profile.service_area || "",
    website: profile.website || "",
  };
}
