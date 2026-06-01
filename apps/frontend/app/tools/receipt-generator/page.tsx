"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSubscription } from "@/lib/useSubscription";

type ReceiptItem = {
  description: string;
  quantity: number;
  price: number;
};

const getTodayDateString = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;

  return new Date(now.getTime() - timezoneOffset).toISOString().split("T")[0];
};

export default function ReceiptGeneratorPage() {
  const { loading, isPremium } = useSubscription();
  const [isMounted, setIsMounted] = useState(false);
  const [businessName, setBusinessName] = useState("Digi2 Service Provider");
  const [logo, setLogo] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState("#2563eb");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("RCPT-001");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<ReceiptItem[]>([
    { description: "Service completed", quantity: 1, price: 0 },
  ]);

  useEffect(() => {
    setDate((currentDate) => currentDate || getTodayDateString());
    setIsMounted(true);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const taxAmount = useMemo(() => {
    return (subtotal * taxRate) / 100;
  }, [subtotal, taxRate]);

  const total = useMemo(() => {
    return Math.max(subtotal + taxAmount - discount, 0);
  }, [subtotal, taxAmount, discount]);

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result as string;
      setLogo(imageUrl);

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const data = ctx.getImageData(0, 0, 50, 50).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        setBrandColor(`rgb(${r}, ${g}, ${b})`);
      };
    };

    reader.readAsDataURL(file);
  };

  const updateItem = (
    index: number,
    field: keyof ReceiptItem,
    value: string
  ) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "description" ? value : Number(value),
    };

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const saveReceipt = () => {
    const receiptData = {
      businessName,
      customerName,
      customerEmail,
      receiptNumber,
      date,
      paymentMethod,
      taxRate,
      discount,
      notes,
      items,
      logo,
      brandColor,
    };

    localStorage.setItem(
      `digi2_receipt_${receiptNumber}`,
      JSON.stringify(receiptData)
    );
    alert("Receipt saved only on this device.");
  };

  const loadReceipt = () => {
    const saved = localStorage.getItem(`digi2_receipt_${receiptNumber}`);

    if (!saved) {
      alert("No saved receipt found with this number on this device.");
      return;
    }

    const data = JSON.parse(saved);

    setBusinessName(data.businessName || "");
    setCustomerName(data.customerName || "");
    setCustomerEmail(data.customerEmail || "");
    setDate(data.date || "");
    setPaymentMethod(data.paymentMethod || "Cash");
    setTaxRate(data.taxRate || 0);
    setDiscount(data.discount || 0);
    setNotes(data.notes || "");
    setItems(data.items || []);
    setLogo(data.logo || null);
    setBrandColor(data.brandColor || "#2563eb");

    alert("Receipt loaded from this device.");
  };

  const clearReceipt = () => {
    localStorage.removeItem(`digi2_receipt_${receiptNumber}`);

    alert("Saved receipt removed from this device.");
  };

  const shareByEmail = () => {
    const subject = `Receipt ${receiptNumber} from ${businessName}`;

    const body = `
Hello ${customerName || "Customer"},

Please find your receipt details below:

Receipt Number: ${receiptNumber}
Date: ${date}
Payment Method: ${paymentMethod}
Total Paid: $${total.toFixed(2)}

Thank you,
${businessName}
`;

    window.location.href = `mailto:${customerEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const downloadPdf = () => {
    const input = document.querySelector(".receipt-preview") as HTMLElement;
    if (!input) return;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const ratio = imgWidth / imgHeight;
      const pdfHeight = pdfWidth / ratio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${receiptNumber}.pdf`);
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isPremium) {
    return (
      <main className="p-8">
        <div className="max-w-xl rounded-lg border p-6">
          <h1 className="text-2xl font-bold">
            🔒 Premium Feature
          </h1>

          <p className="mt-3">
            Receipt Generator requires an active subscription.
          </p>

          <Link
            href="/billing"
            className="mt-4 inline-block rounded bg-green-600 px-5 py-2 text-white"
          >
            Upgrade Plan
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 18mm;
          }

          body {
            background: white;
          }

          .receipt-preview {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl print:max-w-full">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Receipt Generator
            </h1>
            <p className="mt-2 text-gray-600">
              Create a printable receipt with tax, discount, and payment method.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareByEmail}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white"
              style={isMounted ? { backgroundColor: brandColor } : undefined}
            >
              Share by Email
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-gray-900 px-5 py-3 text-white"
            >
              Print
            </button>
            <button
              onClick={downloadPdf}
              className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
            >
              Download PDF
            </button>
            <button
              onClick={saveReceipt}
              className="rounded-lg border bg-white px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Save to Device
            </button>
            <button
              onClick={loadReceipt}
              className="rounded-lg border px-5 py-3"
            >
              Load Saved
            </button>
            <button
              onClick={clearReceipt}
              className="rounded-lg border border-red-300 px-5 py-3 text-red-600"
            >
              Clear Saved
            </button>
          </div>
        </div>

        <div className="no-print mb-6 mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            Privacy Notice:
            Digi2 does not keep your invoices, receipts, customer information,
            payment details, or uploaded logos.
            Everything stays only on your phone or computer.
          </p>
        </div>

        <div className="grid gap-8 space-y-6 lg:grid-cols-2 lg:space-y-0 print:block">
          <section className="no-print rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Receipt Details
            </h2>

            <div className="mt-6 space-y-5">
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business name"
                className="w-full rounded-lg border px-4 py-3"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand Color
                </label>

                <input
                  type="color"
                  value={brandColor.startsWith("#") ? brandColor : "#2563eb"}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="mt-2 h-12 w-24 rounded border"
                />
              </div>

              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
                className="w-full rounded-lg border px-4 py-3"
              />

              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Customer email"
                className="w-full rounded-lg border px-4 py-3"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="Receipt number"
                  className="w-full rounded-lg border px-4 py-3"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Cheque</option>
                <option>Online Payment</option>
              </select>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Items</h3>

                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg border p-4 md:grid-cols-4"
                  >
                    <input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="Description"
                      className="rounded-lg border px-3 py-2 md:col-span-2"
                    />

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                      placeholder="Qty"
                      className="rounded-lg border px-3 py-2"
                    />

                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                      placeholder="Price"
                      className="rounded-lg border px-3 py-2"
                    />

                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="text-left text-sm text-red-600 md:col-span-4"
                      >
                        Remove item
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addItem}
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  Add Item
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  placeholder="Tax %"
                  className="w-full rounded-lg border px-4 py-3"
                />

                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="Discount amount"
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes or payment details"
                className="min-h-28 w-full rounded-lg border px-4 py-3"
              />
            </div>
          </section>

          <section
            className="receipt-preview rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
            style={{
              borderTop: `6px solid ${brandColor}`,
            }}
          >
            <div className="flex items-start justify-between border-b pb-6">
              <div className="flex items-center gap-4">
                {logo && (
                  <img
                    src={logo}
                    alt="Business logo"
                    className="h-16 w-16 rounded-lg object-contain"
                  />
                )}

                <div>
                  <h2
                    className="text-2xl font-bold text-blue-600"
                    style={isMounted ? { color: brandColor } : undefined}
                  >
                    {businessName || "Business Name"}
                  </h2>
                  <p className="mt-1 text-gray-600">Official Receipt</p>
                </div>
              </div>

              <div className="text-right text-sm">
                <p className="font-semibold text-gray-900">{receiptNumber}</p>
                <p className="text-gray-500">{date}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">
                  {customerName || "—"}
                </p>
                {customerEmail && (
                  <p className="text-gray-600">{customerEmail}</p>
                )}
              </div>

              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-900">{paymentMethod}</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">
                        {item.description || "Service item"}
                      </td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({taxRate}%)</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div
                    className="flex justify-between text-lg font-bold tracking-tight"
                  >
                    <span>Total Paid</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {notes && (
              <div className="mt-8 rounded-lg bg-gray-50 p-4 print:border print:bg-white">
                <p className="text-sm font-medium text-gray-900">Notes</p>
                <p className="mt-1 text-sm text-gray-600">{notes}</p>
              </div>
            )}

            <div className="mt-12 border-t pt-6 text-center">
              <p className="text-sm font-medium text-gray-900">
                Thank you for your business.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Generated with Digi2 Tools Hub
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
