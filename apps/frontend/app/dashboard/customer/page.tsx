import Link from "next/link";

const customerLinks = [
  {
    href: "/services",
    title: "Browse Services",
    description: "Find active services from businesses on Digi2.",
  },
  {
    href: "/dashboard/customer/requests",
    title: "My Requests",
    description: "Track the service requests you have submitted.",
  },
];

export default function CustomerDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Dashboard
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {customerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
