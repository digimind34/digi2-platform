export const metadata = {
  title: "Terms of Service | Digi2",
  description: "Terms of Service for using the Digi2 platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Terms of Service
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Last updated: June 28, 2026
        </p>

        <section className="space-y-5 text-gray-700">
          <p>
            These Terms of Service govern your use of Digi2. By creating an
            account, listing services, sending service requests, or using Digi2,
            you agree to these terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            1. Use of the Platform
          </h2>
          <p>
            Digi2 provides digital tools for customers, small businesses, and
            service providers to create profiles, list services, manage requests,
            and access subscription-based platform features.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            2. User Accounts
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            3. Business Listings and Requests
          </h2>
          <p>
            Service providers are responsible for the accuracy of their business
            profiles, service descriptions, pricing, availability, and customer
            communications.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            4. Subscriptions and Billing
          </h2>
          <p>
            Some Digi2 features require a paid subscription. Payments,
            renewals, cancellations, and billing management may be handled
            through third-party payment providers such as Stripe.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            5. Acceptable Use
          </h2>
          <p>
            You must not misuse Digi2, attempt unauthorized access, upload
            harmful content, abuse platform features, or use the platform for
            unlawful activity.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            6. Limitation of Liability
          </h2>
          <p>
            Digi2 is provided on an “as is” and “as available” basis. We are not
            responsible for disputes between customers and service providers or
            for losses resulting from misuse of the platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            7. Changes to These Terms
          </h2>
          <p>
            We may update these Terms of Service from time to time. Continued
            use of Digi2 after changes means you accept the updated terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            8. Contact
          </h2>
          <p>
            For questions about these terms, contact Digi2 support through the
            Contact page on the platform.
          </p>
        </section>
      </div>
    </main>
  );
}