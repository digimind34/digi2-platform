// Import global CSS for the whole frontend
import "./globals.css";

// Import Metadata type from Next.js
import type { Metadata } from "next";

// Metadata controls browser title and SEO basics
export const metadata: Metadata = {
  title: "Digi2 Platform",
  description: "Websites, apps, and digital tools for handyman businesses",
};

// RootLayout wraps every page in the Next.js app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}