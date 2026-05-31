export default function BillingSuccessPage() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-6">
        Subscription Successful 🎉
      </h1>

      <p className="text-lg mb-4">
        Thank you for subscribing to DIGI2.
      </p>

      <p className="mb-8">
        Your payment has been processed and your account
        is now being activated.
      </p>

      <a
        href="/dashboard/customer"
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Go to Dashboard
      </a>
    </main>
  );
}