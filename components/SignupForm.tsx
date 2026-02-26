\"use client\";

import { useState } from "react";
import Image from "next/image";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, company, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Signup failed");
      }

      setSuccess("Account created. You can now log in.");
      event.currentTarget.reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="text-sm font-medium leading-5 text-[#414651]"
          >
            Name
          </label>
          <input
            id="firstName"
            name="firstName"
            placeholder="First name"
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="space-y-1 md:pt-[25px]">
          <label
            htmlFor="lastName"
            className="pointer-events-none block text-xs font-medium text-transparent md:sr-only"
          >
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Last name"
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="col-span-1 space-y-1 md:col-span-2">
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

        <div className="col-span-1 space-y-1 md:col-span-2">
          <label
            htmlFor="company"
            className="text-sm font-medium leading-5 text-[#414651]"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            placeholder="Enter your company name"
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="col-span-1 space-y-2 md:col-span-2">
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
            placeholder="Create a password"
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D5D7DA]">
                <Image src="/tick.svg" alt="" width={8} height={5} />
              </span>
              <p className="text-sm text-slate-500">
                Must be at least 8 characters
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D5D7DA]">
                <Image src="/tick.svg" alt="" width={8} height={5} />
              </span>
              <p className="text-sm text-slate-500">
                Must contain a special character
              </p>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#0254CF] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0254CF]-500/40 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {loading ? "Signing up..." : "Get started"}
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

