import Link from "next/link";

const tools = [
  {
    title: "Metric Converter",
    description: "Convert common measurements quickly.",
    href: "/tools/metric-converter",
  },
  {
    title: "Receipt Generator",
    description: "Create simple receipts for handyman jobs.",
    href: "/tools/receipt-generator",
  },
  {
    title: "Invoice Generator",
    description: "Create basic invoices for customers.",
    href: "/tools/invoice-generator",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">Tools Hub</h1>
        <p className="mt-2 text-gray-600">
          Simple business tools to help service providers work faster.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-blue-600">
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}