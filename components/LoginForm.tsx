"use client";

import { useState } from "react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Login failed");
      }

      setSuccess(`Welcome back, ${json.user?.name || "user"}!`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="mt-6 grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-5 text-[#414651]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-5 text-[#414651]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </form>

      <div className="mt-6 space-y-3">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        {error && (
          <p className="text-center text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-center text-sm text-emerald-600">{success}</p>
        )}
      </div>
    </>
  );
}

