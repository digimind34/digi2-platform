import Link from "next/link";

const dashboardLinks = [
  {
    href: "/dashboard/business-profile",
    title: "Business Profile",
    description: "Manage your public business details and logo.",
  },
  {
    href: "/dashboard/services",
    title: "Services",
    description: "Create, edit, and publish the services you offer.",
  },
  {
    href: "/dashboard/business",
    title: "Business Dashboard",
    description: "Review your business account overview.",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Your Business
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {dashboardLinks.map((item) => (
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
