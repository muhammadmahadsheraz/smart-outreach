"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

const SPECIAL_CHARACTER_PATTERN = /[^A-Za-z0-9]/;

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const hasMinLength = password.length >= 8;
  const hasSpecialCharacter = SPECIAL_CHARACTER_PATTERN.test(password);

  function getPasswordValidationMessage(currentPassword: string) {
    const meetsMinLength = currentPassword.length >= 8;
    const includesSpecialCharacter = SPECIAL_CHARACTER_PATTERN.test(currentPassword);

    if (meetsMinLength && includesSpecialCharacter) {
      return null;
    }

    if (!meetsMinLength && !includesSpecialCharacter) {
      return "Password must be at least 8 characters and contain a special character.";
    }

    if (!meetsMinLength) {
      return "Password must be at least 8 characters.";
    }

    return "Password must contain a special character.";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log("✅ Form submitted!");
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const passwordValidationMessage = getPasswordValidationMessage(password);
    if (passwordValidationMessage) {
      setError(passwordValidationMessage);
      return;
    }

    setLoading(true);

    console.log("📝 Form data:", { firstName, lastName, email, company, password });

    try {
      console.log("🚀 Sending signup request...");
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, company, password }),
      });

      console.log("📨 Response received:", { status: res.status, statusText: res.statusText });
      
      // Get raw text first to debug HTML errors
      const text = await res.text();
      console.log("📄 Raw response text:", text.slice(0, 500));
      
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError);
        throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 200)}`);
      }
      
      console.log("📦 Parsed JSON response:", json);
      
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Signup failed");
      }

      console.log("✨ Signup successful!");
      // Store user in context and localStorage
      const userData = json.user;
      const token = json.token;
      
      if (!userData || !token) {
        throw new Error("Invalid server response: missing user data or token");
      }
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("jwt-token", token);

      // Set auth cookie for middleware
      document.cookie = `jwt-token=${token}; path=/; max-age=86400`;

      setSuccess("Account created. Redirecting...");
      event.currentTarget?.reset();
      setPassword("");
      
      // Redirect to home after short delay
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } catch (err: any) {
      console.error("❌ Error during signup:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1.5">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium leading-5 text-[#414651]"
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
        <div className="space-y-1.5 md:pt-[25px]">
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

        <div className="col-span-1 space-y-1.5 md:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-5 text-[#414651]"
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

        <div className="col-span-1 space-y-1.5 md:col-span-2">
          <label
            htmlFor="company"
            className="block text-sm font-medium leading-5 text-[#414651]"
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

        <div className="col-span-1 space-y-1.5 md:col-span-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-5 text-[#414651]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={password.length > 0 && (!hasMinLength || !hasSpecialCharacter)}
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  hasMinLength ? "bg-emerald-500" : "bg-[#D5D7DA]"
                }`}
              >
                <Image src="/images/tick.svg" alt="" width={8} height={5} />
              </span>
              <p className={`text-xs sm:text-sm ${hasMinLength ? "text-emerald-600" : "text-slate-500"}`}>
                Must be at least 8 characters
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  hasSpecialCharacter ? "bg-emerald-500" : "bg-[#D5D7DA]"
                }`}
              >
                <Image src="/images/tick.svg" alt="" width={8} height={5} />
              </span>
              <p
                className={`text-xs sm:text-sm ${
                  hasSpecialCharacter ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                Must contain a special character
              </p>
            </div>
          </div>
        </div>

          <div className="col-span-1 mt-4 sm:mt-6 space-y-3 md:col-span-2">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#0254CF] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0254CF]-500/40 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
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
      </form>
    </>
  );
}

