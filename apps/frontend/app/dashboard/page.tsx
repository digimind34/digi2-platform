// Import the reusable BusinessCard component
import BusinessCard from "../../components/BusinessCard";

// Define the expected API data shape
type Business = {
  id: number;
  name: string;
  owner_name: string;
  business_type: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  website_slug: string;
  is_active: boolean;
};

// Fetch businesses from Django backend
async function getBusinesses(): Promise<{
  businesses: Business[];
  error?: string;
}> {
  // This must be http://backend:8000/api inside Docker
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000/api";

  try {
    // Call Django REST API
    const response = await fetch(`${apiUrl}/businesses/`, {
      cache: "no-store",
    });

    // Show actual HTTP error if Django returns a bad response
    if (!response.ok) {
      return {
        businesses: [],
        error: `API returned status ${response.status}`,
      };
    }

    // Convert response to JSON
    const data = await response.json();

    return {
      businesses: data,
    };
  } catch (error) {
    // Show connection error
    return {
      businesses: [],
      error: `Could not connect to API: ${String(error)}`,
    };
  }
}

// Dashboard page
export default async function DashboardPage() {
  // Get businesses and possible error
  const { businesses, error } = await getBusinesses();

  return (
    <main className="page">
      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Digi2 Business Dashboard</h1>
          <p>Manage handyman business profiles from one place.</p>
        </div>

        <a className="button" href="/">
          Back Home
        </a>
      </section>

      {error && (
        <p className="empty">
          API Error: {error}
        </p>
      )}

      <section className="grid">
        {businesses.length === 0 && !error ? (
          <p className="empty">
            No businesses found yet. Add one from Django Admin.
          </p>
        ) : (
          businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))
        )}
      </section>
    </main>
  );
}