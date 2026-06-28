export const metadata = {
  title: "Privacy Policy | Digi2",
  description: "Privacy Policy for Digi2 users, customers, and service providers.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Privacy Policy
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Last updated: June 28, 2026
        </p>

        <section className="space-y-5 text-gray-700">
          <p>
            Digi2 respects your privacy. This Privacy Policy explains how we
            collect, use, store, and protect information when customers,
            businesses, and service providers use the Digi2 platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            1. Information We Collect
          </h2>
          <p>
            We may collect account information such as your name, email address,
            business profile details, service listings, service requests,
            billing-related information, and platform usage data.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            2. How We Use Information
          </h2>
          <p>
            We use information to provide user accounts, business profiles,
            service listings, customer requests, subscriptions, support,
            platform security, analytics, and service improvement.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            3. Payments
          </h2>
          <p>
            Digi2 uses third-party payment providers such as Stripe to process
            subscriptions. Digi2 does not store full credit card details on its
            own servers.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            4. Cookies
          </h2>
          <p>
            Digi2 may use cookies and similar technologies for authentication,
            security, session management, and platform functionality.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            5. Data Protection
          </h2>
          <p>
            We use reasonable technical and organizational measures to protect
            user data, including secure authentication, HTTPS, access controls,
            monitoring, and production security practices.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            6. Contact
          </h2>
          <p>
            For privacy questions, contact Digi2 support through the Contact
            page on the platform.
          </p>
        </section>
      </div>
    </main>
  );
}