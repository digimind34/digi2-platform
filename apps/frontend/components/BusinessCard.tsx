// Define the shape of one business object from Django API
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

// Component receives one business and displays it as a card
export default function BusinessCard({ business }: { business: Business }) {
  return (
    <article className="card">
      <div className="cardHeader">
        <div>
          <h2>{business.name}</h2>
          <p>{business.city}</p>
        </div>

        <span className={business.is_active ? "badge active" : "badge inactive"}>
          {business.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <p>
        <strong>Owner:</strong> {business.owner_name}
      </p>

      <p>
        <strong>Type:</strong> {business.business_type}
      </p>

      <p>
        <strong>Email:</strong> {business.email || "Not provided"}
      </p>

      <p>
        <strong>Phone:</strong> {business.phone || "Not provided"}
      </p>

      <p className="description">{business.description}</p>

      <p className="slug">
        Website slug: <code>{business.website_slug}</code>
      </p>
    </article>
  );
}