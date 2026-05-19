"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearStoredTokens } from "@/lib/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleLogout() {
      try {
        await clearStoredTokens();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        router.push("/login");
      }
    }

    handleLogout();
  }, [router]);

  return (
    <main className="p-6">
      <p>Logging out...</p>
    </main>
  );
}