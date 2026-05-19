"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, login } = useAuth();

  // Form state for login inputs
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // Message state for errors
  const [message, setMessage] = useState("");

  // Loading state prevents double-submit
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await login(form);
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: "420px", margin: "80px auto", fontFamily: "Arial" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button type="submit" disabled={submitting || authLoading}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
