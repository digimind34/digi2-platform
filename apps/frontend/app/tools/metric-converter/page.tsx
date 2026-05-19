"use client";

import { useMemo, useState } from "react";

type Conversion = {
  label: string;
  from: string;
  to: string;
  convert: (value: number) => number;
};

const conversions: Record<string, Conversion[]> = {
  Length: [
    { label: "Meters to Feet", from: "m", to: "ft", convert: (v) => v * 3.28084 },
    { label: "Feet to Meters", from: "ft", to: "m", convert: (v) => v / 3.28084 },
    { label: "Kilometers to Miles", from: "km", to: "mi", convert: (v) => v * 0.621371 },
    { label: "Miles to Kilometers", from: "mi", to: "km", convert: (v) => v / 0.621371 },
    { label: "Centimeters to Inches", from: "cm", to: "in", convert: (v) => v / 2.54 },
    { label: "Inches to Centimeters", from: "in", to: "cm", convert: (v) => v * 2.54 },
  ],
  Weight: [
    { label: "Kilograms to Pounds", from: "kg", to: "lb", convert: (v) => v * 2.20462 },
    { label: "Pounds to Kilograms", from: "lb", to: "kg", convert: (v) => v / 2.20462 },
    { label: "Grams to Ounces", from: "g", to: "oz", convert: (v) => v * 0.035274 },
    { label: "Ounces to Grams", from: "oz", to: "g", convert: (v) => v / 0.035274 },
  ],
  Temperature: [
    { label: "Celsius to Fahrenheit", from: "°C", to: "°F", convert: (v) => (v * 9) / 5 + 32 },
    { label: "Fahrenheit to Celsius", from: "°F", to: "°C", convert: (v) => ((v - 32) * 5) / 9 },
  ],
  Area: [
    { label: "Square Meters to Square Feet", from: "m²", to: "ft²", convert: (v) => v * 10.7639 },
    { label: "Square Feet to Square Meters", from: "ft²", to: "m²", convert: (v) => v / 10.7639 },
  ],
  Volume: [
    { label: "Liters to US Gallons", from: "L", to: "gal", convert: (v) => v * 0.264172 },
    { label: "US Gallons to Liters", from: "gal", to: "L", convert: (v) => v / 0.264172 },
  ],
  Speed: [
    { label: "Kilometers/hour to Miles/hour", from: "km/h", to: "mph", convert: (v) => v * 0.621371 },
    { label: "Miles/hour to Kilometers/hour", from: "mph", to: "km/h", convert: (v) => v / 0.621371 },
  ],
};

export default function MetricConverterPage() {
  const [category, setCategory] = useState("Length");
  const [conversionIndex, setConversionIndex] = useState(0);
  const [value, setValue] = useState("");

  const selectedConversion = conversions[category][conversionIndex];

  const result = useMemo(() => {
    const numberValue = Number(value);

    if (!value || Number.isNaN(numberValue)) return null;

    return selectedConversion.convert(numberValue);
  }, [value, selectedConversion]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setConversionIndex(0);
    setValue("");
  };

  const swapConversion = () => {
    const currentLabel = selectedConversion.label;
    const [fromText, toText] = currentLabel.split(" to ");
    const oppositeLabel = `${toText} to ${fromText}`;

    const oppositeIndex = conversions[category].findIndex(
      (item) => item.label === oppositeLabel
    );

    if (oppositeIndex !== -1) {
      setConversionIndex(oppositeIndex);
      setValue(result !== null ? String(Number(result.toFixed(4))) : "");
    }
  };

  const clearConverter = () => {
    setValue("");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Metric Converter
          </h1>
          <p className="mt-2 text-gray-600">
            Convert common measurements used in service, repair, and handyman work.
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            Privacy Notice: Digi2 does not keep anything you enter here.
            This tool works directly on your phone or computer.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Converter Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                >
                  {Object.keys(conversions).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Conversion Type
                </label>
                <select
                  value={conversionIndex}
                  onChange={(e) => setConversionIndex(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                >
                  {conversions[category].map((item, index) => (
                    <option key={item.label} value={index}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter Value ({selectedConversion.from})
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Example: 10"
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={swapConversion}
                  className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                >
                  Swap Direction
                </button>

                <button
                  onClick={clearConverter}
                  className="rounded-lg border px-5 py-3"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="border-t-4 border-blue-600 pt-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Conversion Result
              </h2>
              <p className="mt-2 text-gray-600">{selectedConversion.label}</p>

              <div className="mt-8 rounded-xl bg-gray-50 p-6">
                <p className="text-sm text-gray-500">Input</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {value || "—"} {value ? selectedConversion.from : ""}
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-blue-50 p-6">
                <p className="text-sm text-blue-700">Result</p>
                <p className="mt-2 text-3xl font-bold text-blue-700">
                  {result !== null
                    ? `${Number(result.toFixed(4))} ${selectedConversion.to}`
                    : "—"}
                </p>
              </div>

              <div className="mt-8 border-t pt-6">
                <p className="text-sm text-gray-600">
                  This is a quick estimate tool for everyday business use.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Generated with Digi2 Tools Hub
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}