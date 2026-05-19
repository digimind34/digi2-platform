"use client";

import { useState } from "react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  // Form state for register inputs
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  // Message state for success/error feedback
  const [message, setMessage] = useState("");

  // Loading state prevents double-submit
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send register request to Django backend
      await registerUser(form);

      setMessage("Registration successful. You can now login.");

      // Clear form after successful registration
      setForm({
        username: "",
        email: "",
        password: "",
        password2: "",
      });
    } catch (error: any) {
      // Show backend/frontend error
      setMessage(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: "420px", margin: "80px auto", fontFamily: "Arial" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Confirm Password"
          type="password"
          value={form.password2}
          onChange={(e) => setForm({ ...form, password2: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
