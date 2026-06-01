"use client";

import Link from "next/link";
import { useSubscription } from "@/lib/useSubscription";

const tools = [
  {
    title: "Metric Converter",
    description: "Convert common measurements quickly.",
    href: "/tools/metric-converter",
    premium: false,
  },
  {
    title: "Receipt Generator",
    description: "Create simple receipts for handyman jobs.",
    href: "/tools/receipt-generator",
    premium: true,
  },
  {
    title: "Invoice Generator",
    description: "Create basic invoices for customers.",
    href: "/tools/invoice-generator",
    premium: true,
  },
];

export default function ToolsPage() {
  const { loading, isPremium } = useSubscription();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">Tools Hub</h1>
        <p className="mt-2 text-gray-600">
          Simple business tools to help service providers work faster.
        </p>

        {loading && (
          <p className="mt-4 text-sm text-gray-500">
            Checking subscription status...
          </p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {tools.map((tool) => {
            const locked = tool.premium && !isPremium;

            return (
              <Link
                key={tool.href}
                href={locked ? "/billing" : tool.href}
                className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tool.title}
                  </h2>

                  {tool.premium && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      Premium
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  {tool.description}
                </p>

                {locked ? (
                  <span className="mt-4 inline-block text-sm font-medium text-green-600">
                    Upgrade required →
                  </span>
                ) : (
                  <span className="mt-4 inline-block text-sm font-medium text-blue-600">
                    Open tool →
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
