export const metadata = {
  title: "Contact | Digi2",
  description: "Contact Digi2 support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Contact Digi2
        </h1>

        <p className="mb-8 text-gray-700">
          Need help with your account, business profile, subscription, service
          listing, or customer request? Contact the Digi2 team using the details
          below.
        </p>

        <section className="space-y-5 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Support Email
            </h2>
            <p>support@digibab.com</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Business Support
            </h2>
            <p>
              For business profile, service listing, and subscription support,
              include your account email and business name when contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Customer Support
            </h2>
            <p>
              For customer service requests, include the request details and the
              service provider name where applicable.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Response Time
            </h2>
            <p>
              During beta launch, Digi2 aims to respond to support messages as
              soon as possible during normal business hours.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}