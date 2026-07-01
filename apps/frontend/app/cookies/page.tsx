export const metadata = {
  title: "Cookie Policy | Digi2",
  description: "Cookie Policy for Digi2.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Cookie Policy
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Last updated: July 1, 2026
        </p>

        <section className="space-y-5 text-gray-700">
          <p>
            Digi2 uses cookies and similar technologies to provide secure login,
            improve platform functionality, protect user accounts, and support
            essential website features.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            1. What Cookies Are
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help websites remember information about your visit.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            2. How Digi2 Uses Cookies
          </h2>
          <p>
            We may use cookies for authentication, security, session management,
            CSRF protection, user preferences, and platform performance.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            3. Essential Cookies
          </h2>
          <p>
            Some cookies are necessary for Digi2 to work properly. These include
            cookies used for login sessions, account security, and request
            protection.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            4. Third-Party Services
          </h2>
          <p>
            Digi2 may use trusted third-party services such as Stripe for
            billing and payment processing. These services may use their own
            cookies according to their policies.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            5. Managing Cookies
          </h2>
          <p>
            You can control or delete cookies through your browser settings.
            Disabling essential cookies may affect login, billing, or other
            platform features.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">
            6. Contact
          </h2>
          <p>
            For questions about this Cookie Policy, contact Digi2 support
            through the Contact page on the platform.
          </p>
        </section>
      </div>
    </main>
  );
}