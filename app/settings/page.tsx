"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    companyName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Australia",
    companyNumber: "",
  });

  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("jwt-token");
        if (!token) {
          setMessage({ type: "error", text: "Not authenticated" });
          setLoading(false);
          return;
        }

        const response = await fetch("/api/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (data.ok && data.data) {
          setFormData({
            firstName: data.data.personalInfo?.firstName || "",
            lastName: data.data.personalInfo?.lastName || "",
            email: data.data.personalInfo?.email || "",
            oldPassword: "",
            newPassword: "",
            companyName: data.data.billingDetails?.companyName || "",
            address: data.data.billingDetails?.address || "",
            city: data.data.billingDetails?.city || "",
            zipCode: data.data.billingDetails?.zipCode || "",
            country: data.data.billingDetails?.country || "Australia",
            companyNumber: data.data.billingDetails?.companyNumber || "",
          });
          setSelectedPlan(data.data.subscription?.plan || "free");
        } else {
          setMessage({ type: "error", text: data.error || "Failed to load settings" });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setMessage({ type: "error", text: "Failed to load settings" });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePersonalInfo = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("jwt-token");
      if (!token) {
        setMessage({ type: "error", text: "Not authenticated" });
        return;
      }

      const response = await fetch("/api/settings/personal-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        setMessage({ type: "success", text: "Personal info saved successfully!" });
        setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error saving personal info" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBillingInfo = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("jwt-token");
      if (!token) {
        setMessage({ type: "error", text: "Not authenticated" });
        return;
      }

      const response = await fetch("/api/settings/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          companyNumber: formData.companyNumber,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        setMessage({ type: "success", text: "Billing info saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error saving billing info" });
    } finally {
      setSaving(false);
    }
  };

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
  };

  if (loading) {
    return (
      <div className="flex bg-slate-50 font-sans min-h-screen">
        <main className="flex w-full bg-white">
          <Sidebar />
          <section className="relative flex min-h-screen w-full flex-col items-center pb-8 sm:pb-12 gap-0 overflow-x-hidden">
            <MobileHeader />
            <div className="flex items-center justify-center w-full h-96">
              <div className="text-gray-600">Loading settings...</div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 font-sans min-h-screen">
      <main className="flex w-full bg-white">
        <Sidebar />

        <section className="relative flex min-h-screen w-full flex-col items-center pb-8 sm:pb-12 gap-0 overflow-x-hidden">
          {/* Mobile header */}
          <MobileHeader />

          {/* Settings Content */}
          <div className="self-stretch py-8 sm:py-12 bg-white inline-flex flex-col justify-start items-center">
            <div className="w-full max-w-[1144px] flex flex-col justify-start items-start gap-6 sm:gap-8 overflow-hidden px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-5">
                <div className="self-stretch inline-flex justify-start items-start gap-4">
                  <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="self-stretch justify-start text-gray-900 text-xl sm:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-7 sm:leading-8">
                      Settings
                    </div>
                    <div className="self-stretch justify-start text-gray-600 text-sm sm:text-base font-normal font-['Plus_Jakarta_Sans'] leading-5 sm:leading-6 line-clamp-1">
                      Manage your information and preferences here.
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-px bg-gray-200" />
              </div>

              {/* Personal Info Section */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-6">
                  {/* Personal Info Header */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-5">
                    <div className="self-stretch inline-flex justify-start items-start gap-4">
                      <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-0.5">
                        <div className="self-stretch justify-start text-gray-900 text-base sm:text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-6 sm:leading-7">
                          Personal info
                        </div>
                        <div className="self-stretch justify-start text-gray-600 text-xs sm:text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 sm:leading-5 line-clamp-1">
                          Update your personal details and photo here.
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-px bg-gray-200" />
                  </div>

                  {/* Personal Info Form */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-5">
                    {message && (
                      <div className={`w-full p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message.text}
                      </div>
                    )}
                    {/* Name Fields */}
                    <div className="self-stretch flex flex-col sm:flex-row justify-start items-start gap-4 sm:gap-8 flex-wrap">
                      <div className="w-full sm:flex-1 sm:max-w-72 sm:min-w-48 inline-flex flex-col justify-start items-start">
                        <div className="inline-flex justify-start items-center gap-0.5">
                          <div className="justify-start text-gray-700 text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-4 sm:leading-5">
                            Name
                          </div>
                          <div className="justify-start text-blue-700 text-xs sm:text-sm font-semibold font-['Inter'] leading-4 sm:leading-5">
                            *
                          </div>
                        </div>
                      </div>
                      <div className="w-full sm:flex-1 sm:min-w-[300px] flex flex-col sm:flex-row justify-start items-start gap-3 sm:gap-6">
                        <div className="w-full sm:flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-sm sm:text-base font-normal font-['Plus_Jakarta_Sans'] leading-5 sm:leading-6"
                          />
                        </div>
                        <div className="w-full sm:flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-sm sm:text-base font-normal font-['Plus_Jakarta_Sans'] leading-5 sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                      <div
                        data-actions="False"
                        data-help-icon="false"
                        data-required="true"
                        data-size="sm"
                        data-supporting-text="false"
                        className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start"
                      >
                        <div className="inline-flex justify-start items-center gap-0.5">
                          <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                            Email address
                          </div>
                          <div className="justify-start text-blue-700 text-sm font-semibold font-['Inter'] leading-5">
                            *
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-[480px] inline-flex flex-col justify-start items-start gap-1.5">
                        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                          <div className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center gap-2">
                            <div className="flex-1 flex justify-start items-center gap-2">
                              <div className="w-5 h-5 relative overflow-hidden">
                                <div className="w-4 h-3.5 left-[1.67px] top-[3.33px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-gray-500" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="flex-1 bg-transparent text-gray-500 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                      <div
                        data-actions="False"
                        data-help-icon="false"
                        data-required="true"
                        data-size="sm"
                        data-supporting-text="false"
                        className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start"
                      >
                        <div className="inline-flex justify-start items-center gap-0.5">
                          <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                            Password
                          </div>
                          <div className="justify-start text-blue-700 text-sm font-semibold font-['Inter'] leading-5">
                            *
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-[480px] flex justify-start items-start gap-6">
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                            <input
                              type="password"
                              name="oldPassword"
                              value={formData.oldPassword}
                              onChange={handleInputChange}
                              placeholder="Old password"
                              className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6"
                            />
                          </div>
                        </div>
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              placeholder="New password"
                              className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div
                    data-actions="true"
                    data-breakpoint="Desktop"
                    data-button-group="False"
                    data-divider="true"
                    data-secondary-button="false"
                    data-type="Section"
                    className="self-stretch flex flex-col justify-start items-center gap-5"
                  >
                    <div className="self-stretch h-px bg-gray-200" />
                    <div className="self-stretch inline-flex justify-end items-center gap-5">
                      <div className="flex-1 flex justify-end items-center gap-3">
                        <button
                          onClick={handleSavePersonalInfo}
                          className="px-3.5 py-2.5 bg-blue-700 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1 overflow-hidden hover:bg-blue-800 transition-colors"
                        >
                          <div className="px-0.5 flex justify-center items-center">
                            <div className="justify-start text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                              Save
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Plan Section */}
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch px-8 flex flex-col justify-start items-start gap-6">
                  {/* Your Plan Header */}
                  <div
                    data-actions="false"
                    data-breakpoint="Desktop"
                    data-divider="true"
                    data-dropdown-icon="false"
                    data-supporting-text="true"
                    data-tabs="False"
                    data-type="Buttons"
                    className="self-stretch flex flex-col justify-start items-start gap-5"
                  >
                    <div className="self-stretch inline-flex justify-start items-start gap-4">
                      <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-0.5">
                        <div className="self-stretch justify-start text-gray-900 text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                          Your plan
                        </div>
                        <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5 line-clamp-1">
                          Choose the best plan for your needs.
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-px bg-gray-200" />
                  </div>

                  {/* Plans Grid */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-start items-start gap-2.5">
                      <div className="flex-1 flex justify-start items-start gap-3">
                        {/* Plan X1 */}
                        <div className={`flex-1 bg-white rounded-xl inline-flex flex-col justify-start items-start ${selectedPlan === "x1" ? "outline outline-2 outline-offset-[-2px] outline-blue-700" : "outline outline-1 outline-offset-[-1px] outline-gray-200"}`}>
                          <div className={`self-stretch pl-3 pr-5 py-3 rounded-tl-xl rounded-tr-xl inline-flex justify-start items-center gap-1 ${selectedPlan === "x1" ? "outline outline-2 outline-offset-[-2px] outline-blue-700" : "outline outline-1 outline-offset-[-1px] outline-gray-200"}`}>
                            <div className="flex-1 flex justify-start items-center gap-4">
                              <div className="w-8 h-8 relative bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
                                <div className="w-4 h-4 left-[8px] top-[8px] absolute overflow-hidden">
                                  <div className="w-3.5 h-2.5 left-[1.33px] top-[3.04px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-gray-700" />
                                </div>
                              </div>
                              <div className="flex-1 justify-start text-gray-700 text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">
                                Margot X1
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="plan"
                              value="x1"
                              checked={selectedPlan === "x1"}
                              onChange={(e) => handlePlanChange(e.target.value)}
                              className="w-4 h-4"
                            />
                          </div>
                          <div className="self-stretch px-4 pt-4 pb-5 inline-flex justify-start items-start gap-1">
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
                              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                <div className="self-stretch inline-flex justify-between items-start">
                                  <div className="flex justify-start items-end gap-1">
                                    <div className="justify-start text-gray-700 text-3xl font-semibold font-['Inter'] leading-9">
                                      $10
                                    </div>
                                    <div className="pb-[3px] flex justify-start items-start gap-2.5">
                                      <div className="justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                        per month
                                      </div>
                                    </div>
                                  </div>
                                  <div className="px-2 py-0.5 bg-sky-100 rounded-2xl outline outline-1 outline-offset-[-1px] outline-blue-300 flex justify-start items-center">
                                    <div className="text-center justify-start text-blue-800 text-xs font-medium font-['Plus_Jakarta_Sans'] leading-4">
                                      Free trial
                                    </div>
                                  </div>
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                  <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                    • Up to 100 prospects
                                  </div>
                                  <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                    • 1 active campaign
                                  </div>
                                  <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                    • Email support
                                  </div>
                                  <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                    • Basic analytics
                                  </div>
                                  <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                    • 72h response time
                                  </div>
                                </div>
                              </div>
                              <div className="self-stretch justify-start text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
                                Next payment: 03/15/25
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Plan X3 */}
                        <div className={`flex-1 self-stretch bg-white rounded-xl inline-flex flex-col justify-start items-start ${selectedPlan === "x3" ? "outline outline-2 outline-offset-[-2px] outline-blue-700" : "outline outline-1 outline-offset-[-1px] outline-gray-200"}`}>
                          <div className={`self-stretch pl-3 pr-5 py-3 rounded-tl-xl rounded-tr-xl inline-flex justify-start items-center gap-1 ${selectedPlan === "x3" ? "outline outline-2 outline-offset-[-2px] outline-blue-700" : "outline outline-1 outline-offset-[-1px] outline-gray-200"}`}>
                            <div className="flex-1 flex justify-start items-center gap-4">
                              <div className="w-8 h-8 relative bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
                                <div className="w-4 h-4 left-[8px] top-[8px] absolute overflow-hidden">
                                  <div className="w-3.5 h-3.5 left-[1.33px] top-[1.37px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-gray-700" />
                                </div>
                              </div>
                              <div className="flex-1 justify-start text-gray-700 text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">
                                Margot X3
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="plan"
                              value="x3"
                              checked={selectedPlan === "x3"}
                              onChange={(e) => handlePlanChange(e.target.value)}
                              className="w-4 h-4"
                            />
                          </div>
                          <div className="self-stretch px-4 pt-4 pb-5 inline-flex justify-start items-start gap-1">
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                              <div className="self-stretch inline-flex justify-start items-end gap-1">
                                <div className="justify-start text-gray-700 text-3xl font-semibold font-['Inter'] leading-9">
                                  $20
                                </div>
                                <div className="pb-[3px] flex justify-start items-start gap-2.5">
                                  <div className="justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                    per month
                                  </div>
                                </div>
                              </div>
                              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • Up to 500 prospects
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • 3 active campaigns
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • Priority email support
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • Advanced analytics
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • 24h response time
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Plan X10 */}
                        <div className={`flex-1 self-stretch bg-white rounded-xl inline-flex flex-col justify-start items-start ${selectedPlan === "x10" ? "outline outline-2 outline-offset-[-2px] outline-blue-700" : "outline outline-1 outline-offset-[-1px] outline-gray-200"}`}>
                          <div className={`self-stretch pl-3 pr-5 py-3 rounded-tl-xl rounded-tr-xl inline-flex justify-start items-center gap-1 ${selectedPlan === "x10" ? "outline outline-2 outline-offset-[-2px] outline-blue-700" : "outline outline-1 outline-offset-[-1px] outline-gray-200"}`}>
                            <div className="flex-1 flex justify-start items-center gap-4">
                              <div className="w-8 h-8 relative bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
                                <div className="w-4 h-4 left-[8px] top-[8px] absolute overflow-hidden">
                                  <div className="w-3 h-3.5 left-[2.38px] top-[1.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-gray-700" />
                                </div>
                              </div>
                              <div className="flex-1 justify-start text-gray-700 text-base font-semibold font-['Plus_Jakarta_Sans'] leading-6">
                                Margot X10
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="plan"
                              value="x10"
                              checked={selectedPlan === "x10"}
                              onChange={(e) => handlePlanChange(e.target.value)}
                              className="w-4 h-4"
                            />
                          </div>
                          <div className="self-stretch px-4 pt-4 pb-5 inline-flex justify-start items-start gap-1">
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                              <div className="self-stretch inline-flex justify-start items-end gap-1">
                                <div className="justify-start text-gray-700 text-3xl font-semibold font-['Inter'] leading-9">
                                  $40
                                </div>
                                <div className="pb-[3px] flex justify-start items-start gap-2.5">
                                  <div className="justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                    per month
                                  </div>
                                </div>
                              </div>
                              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • Unlimited prospects
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • Unlimited active campaigns
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • 24/7 phone & email support
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • Custom analytics & reporting
                                </div>
                                <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                  • Dedicated account manager
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plan Action Buttons */}
                  <div
                    data-actions="true"
                    data-breakpoint="Desktop"
                    data-button-group="False"
                    data-divider="true"
                    data-secondary-button="false"
                    data-type="Section"
                    className="self-stretch flex flex-col justify-start items-center gap-5"
                  >
                    <div className="self-stretch h-px bg-gray-200" />
                    <div className="self-stretch inline-flex justify-end items-center gap-5">
                      <div className="flex-1 flex justify-end items-center gap-3">
                        <button className="px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex justify-center items-center gap-1 overflow-hidden hover:bg-gray-50 transition-colors">
                          <div className="px-0.5 flex justify-center items-center">
                            <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                              Cancel plan
                            </div>
                          </div>
                        </button>
                        <button className="px-3.5 py-2.5 bg-blue-700 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1 overflow-hidden hover:bg-blue-800 transition-colors">
                          <div className="px-0.5 flex justify-center items-center">
                            <div className="justify-start text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                              Upgrade plan
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Details Section */}
              <div className="self-stretch px-8 flex flex-col justify-start items-start gap-6">
                {/* Billing Header */}
                <div
                  data-actions="false"
                  data-breakpoint="Desktop"
                  data-divider="true"
                  data-dropdown-icon="false"
                  data-supporting-text="true"
                  data-tabs="False"
                  data-type="Buttons"
                  className="self-stretch flex flex-col justify-start items-start gap-5"
                >
                  <div className="self-stretch inline-flex justify-start items-start gap-4">
                    <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-0.5">
                      <div className="self-stretch justify-start text-gray-900 text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                        Billing details
                      </div>
                      <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5 line-clamp-1">
                        Manage your billing and company information.
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch h-px bg-gray-200" />
                </div>

                {/* Billing Form */}
                <div className="self-stretch flex flex-col justify-start items-start gap-5">
                  {/* Company Name */}
                  <div className="self-stretch inline-flex justify-start items-center gap-8 flex-wrap content-center">
                    <div
                      data-actions="False"
                      data-help-icon="false"
                      data-required="false"
                      data-size="sm"
                      data-supporting-text="false"
                      className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start"
                    >
                      <div className="inline-flex justify-start items-center gap-0.5">
                        <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Company name
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[480px] inline-flex flex-col justify-start items-start gap-1.5">
                      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Your company"
                          className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="self-stretch inline-flex justify-start items-center gap-8 flex-wrap content-center">
                    <div
                      data-actions="False"
                      data-help-icon="false"
                      data-required="false"
                      data-size="sm"
                      data-supporting-text="false"
                      className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start"
                    >
                      <div className="inline-flex justify-start items-center gap-0.5">
                        <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Address
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                          className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-base font-normal font-['Inter'] leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* City, Zip Code */}
                  <div className="self-stretch inline-flex justify-start items-center gap-8 flex-wrap content-center">
                    <div
                      data-actions="False"
                      data-help-icon="false"
                      data-required="false"
                      data-size="sm"
                      data-supporting-text="false"
                      className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start"
                    >
                      <div className="inline-flex justify-start items-center gap-0.5">
                        <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          City
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-base font-normal font-['Inter'] leading-6"
                      />
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Zip code"
                        className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-base font-normal font-['Inter'] leading-6"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="self-stretch inline-flex justify-start items-center gap-8 flex-wrap content-center">
                    <div
                      data-actions="False"
                      data-help-icon="false"
                      data-required="false"
                      data-size="sm"
                      data-supporting-text="false"
                      className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start"
                    >
                      <div className="inline-flex justify-start items-center gap-0.5">
                        <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Country
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-500 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6"
                        >
                          <option>Australia</option>
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Germany</option>
                          <option>France</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Company Number / Phone */}
                  <div className="self-stretch inline-flex justify-start items-center gap-8 flex-wrap content-center">
                    <div
                      data-actions="False"
                      data-help-icon="false"
                      data-required="false"
                      data-size="sm"
                      data-supporting-text="false"
                      className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start"
                    >
                      <div className="inline-flex justify-start items-center gap-0.5">
                        <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Company number
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[480px] inline-flex flex-col justify-start items-start gap-1.5">
                      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                        <div className="self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex justify-start items-center gap-2">
                          <div className="flex-1 flex justify-start items-center gap-2">
                            <div className="w-5 h-5 relative overflow-hidden">
                              <div className="w-4 h-4 left-[2.44px] top-[2.13px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-gray-500" />
                            </div>
                            <input
                              type="tel"
                              name="companyNumber"
                              value={formData.companyNumber}
                              onChange={handleInputChange}
                              placeholder="Phone number"
                              className="flex-1 bg-transparent text-gray-500 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Billing Button */}
                <div
                  data-actions="true"
                  data-breakpoint="Desktop"
                  data-button-group="False"
                  data-divider="true"
                  data-secondary-button="false"
                  data-type="Section"
                  className="self-stretch flex flex-col justify-start items-center gap-5"
                >
                  <div className="self-stretch h-px bg-gray-200" />
                  <div className="self-stretch inline-flex justify-end items-center gap-5">
                    <div className="flex-1 flex justify-end items-center gap-3">
                      <button
                        onClick={handleSaveBillingInfo}
                        className="px-3.5 py-2.5 bg-blue-700 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1 overflow-hidden hover:bg-blue-800 transition-colors"
                      >
                        <div className="px-0.5 flex justify-center items-center">
                          <div className="justify-start text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                            Save
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
