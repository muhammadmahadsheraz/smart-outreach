'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import BarChart from "../../components/BarChart";
import Sidebar from "../../components/Sidebar";
import MobileHeader from "../../components/MobileHeader";

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("company");
  const [selectedTimeRange, setSelectedTimeRange] = useState("12months");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Calculate stats from campaigns
  const totalCampaigns = campaigns.length;
  const totalLeads = 0; // Will be dynamic when leads functionality is implemented
  const totalResponses = campaigns.reduce((sum, c) => sum + (c.replied || 0), 0);

  // Calculate percentage changes (for now, using a simple calculation)
  const campaignPercentage = totalCampaigns > 0 ? "2.4%" : "0%";
  const leadsPercentage = "0%";
  const responsesPercentage = totalResponses > 0 ? "2.4%" : "0%";

  const statsData = [
    {
      src: "/LandingPage/announcement-gray-icon.svg",
      text: "All Campaigns",
      number: totalCampaigns.toString(),
      percentage: campaignPercentage,
      key: 1,
    },
    {
      src: "/LandingPage/leads-icon.svg",
      text: "Leads",
      number: totalLeads.toString(),
      percentage: leadsPercentage,
      key: 2,
    },
    {
      src: "/LandingPage/responses-obtained-icon.svg",
      text: "Responses obtained",
      number: totalResponses.toString(),
      percentage: responsesPercentage,
      key: 3,
    },
  ];

  return (
    <div className="flex bg-slate-50 font-sans min-h-screen">
      <main className="flex w-full bg-white">
        <Sidebar />

        <section className="relative flex min-h-screen w-full flex-col items-center pb-8 sm:pb-12 gap-6 sm:gap-9 overflow-x-hidden">
          {/* Mobile header */}
          <MobileHeader />
          
          {/* Background gradients — percentage-based so they scale */}
          <div
            style={{
              position: "absolute",
              top: "-2%",
              left: 0,
              width: "65%",
              height: "42%",
              background:
                "radial-gradient(ellipse at 45% 52%, rgba(255, 195, 215, 0.42) 0%, rgba(255, 210, 225, 0.28) 35%, rgba(255, 225, 232, 0.12) 60%, transparent 78%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-2%",
              right: 0,
              width: "65%",
              height: "42%",
              background:
                "radial-gradient(ellipse at 55% 52%, rgba(175, 215, 248, 0.42) 0%, rgba(190, 222, 250, 0.28) 35%, rgba(205, 228, 250, 0.12) 60%, transparent 78%)",
              pointerEvents: "none",
            }}
          />

          {/* Avatar + welcome text */}
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-4 sm:gap-6 px-4 sm:px-8 pt-6 sm:pt-8">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-full border-[3px] sm:border-[4px] border-white bg-white shadow-[0px_2px_2px_-1px_#0A0D120A,0px_4px_6px_-2px_#0A0D1208] overflow-hidden">
              <Image
                src="/avatar.png"
                alt="Margot"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex max-w-[640px] flex-col gap-1 text-center px-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-7 sm:leading-8 text-slate-900">
                Welcome, I&apos;m Margot
              </h1>
              <p className="text-xs sm:text-sm lg:text-base font-normal leading-5 sm:leading-6 text-slate-600">
                How can I help you get new customers?
              </p>
            </div>
          </div>

          {/* Dashboard header row */}
          <div className="w-full max-w-[1280px] px-4 sm:px-8">
            <div className="flex w-full items-start sm:items-center justify-between gap-3 sm:gap-4 flex-col sm:flex-row">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl leading-7 sm:leading-8 font-semibold text-[#181D27]">
                  Dashboard
                </h2>
                <p className="text-xs sm:text-sm lg:text-base leading-5 sm:leading-6 text-slate-600">
                  Here is a summary of the customer search campaigns I am running.
                </p>
              </div>

              <button
                type="button"
                className="flex items-center h-9 sm:h-10 rounded-[8px] bg-[#3373F5] text-white border-2 border-[#3373F5] px-3 sm:px-[14px] gap-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)] whitespace-nowrap self-start sm:self-auto"
              >
                <span className="px-[2px] text-xs sm:text-[14px] font-semibold leading-5">
                  Create campaign
                </span>
                <Image
                  src="/LandingPage/announcement.svg"
                  alt="announcement"
                  className="ml-1 sm:ml-2 inline-block w-4 h-4 sm:w-5 sm:h-5"
                  width={20}
                  height={20}
                  aria-hidden
                />
              </button>
            </div>
          </div>

          {/* Stat cards — 1 col on mobile, 3 on sm+ */}
          <div className="w-full max-w-[1280px] px-4 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {statsData.map((item) => (
                <div
                  key={item.key}
                  className="flex w-full rounded-[12px] border-2 border-[#E9EAEB] bg-white p-4 sm:p-5 gap-3 sm:gap-4 shadow-[0px_1px_2px_0px_#1018280D]"
                >
                  <div className="flex items-start">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[8px] border border-[#E9EAEB] bg-white flex items-center justify-center shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#0A0D120A]">
                      <Image
                        src={item.src}
                        alt="icon"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-[#535862]">
                      {item.text}
                    </span>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-[30px] leading-8 sm:leading-[38px] font-semibold text-[#181D27]">
                        {item.number}
                      </span>

                      <div className="flex items-center gap-[4px] border rounded-[6px] border-[#D5D7DA] px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-[0px_1px_2px_0px_#1018280D]">
                        <div className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] relative">
                          <Image
                            src="/LandingPage/arrow-upright-icon.svg"
                            alt="icon"
                            width={20}
                            height={20}
                            className="absolute top-[3px] sm:top-[3.5px] left-[3px] sm:left-[3.5px] w-[5px] sm:w-[6px] h-[5px] sm:h-[6px]"
                          />
                        </div>
                        <span className="text-xs sm:text-[14px] leading-[18px] sm:leading-[20px] font-medium font-inter text-[#414651]">
                          {item.percentage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls + chart section */}
          <div className="w-full max-w-[1280px] px-4 sm:px-8">
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Tab toggle: Your company / Your clients / Products */}
              <div className="self-stretch bg-neutral-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-0.5 cursor-pointer p-0.5 overflow-hidden">
                <button
                  onClick={() => setActiveTab("company")}
                  className={`flex-1 h-8 sm:h-9 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex justify-center items-center gap-1 overflow-hidden transition-all ${
                    activeTab === "company"
                      ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                      : ""
                  }`}
                >
                  <div
                    className={`text-[11px] sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-4 sm:leading-5 text-center truncate ${
                      activeTab === "company" ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    Your company
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`flex-1 h-8 sm:h-9 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex justify-center items-center gap-1 overflow-hidden transition-all ${
                    activeTab === "clients"
                      ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                      : ""
                  }`}
                >
                  <div
                    className={`text-[11px] sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-4 sm:leading-5 text-center truncate ${
                      activeTab === "clients" ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    Your clients
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 h-8 sm:h-9 px-1 sm:px-2 py-1.5 sm:py-2 rounded-lg flex justify-center items-center gap-1 overflow-hidden transition-all ${
                    activeTab === "products"
                      ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                      : ""
                  }`}
                >
                  <div
                    className={`text-[11px] sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-4 sm:leading-5 text-center truncate ${
                      activeTab === "products" ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    Products
                  </div>
                </button>
              </div>

              {/* Chart header row */}
              <div className="flex items-start justify-between gap-3 sm:gap-4 w-full flex-col lg:flex-row">
                <div className="flex items-center gap-1 flex-wrap">
                  <div className="text-sm sm:text-base lg:text-[18px] leading-6 sm:leading-7 font-semibold text-[#181D27] font-['Plus_Jakarta_Sans']">
                    Business opportunities found by Margot
                  </div>
                  <div className="text-emerald-600 text-sm sm:text-base lg:text-[18px] leading-6 sm:leading-7 font-semibold font-['Plus_Jakarta_Sans']">
                    +104%
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 flex-wrap w-full lg:w-auto">
                  {/* Time range toggle */}
                  <div className="bg-neutral-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-center gap-0.5 p-0.5 flex-1 lg:flex-none overflow-x-auto">
                    <button
                      onClick={() => setSelectedTimeRange("12months")}
                      className={`h-8 sm:h-9 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden transition-all flex-shrink-0 ${
                        selectedTimeRange === "12months"
                          ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-xs sm:text-sm font-semibold font-['Inter'] leading-5 whitespace-nowrap ${
                          selectedTimeRange === "12months" ? "text-gray-700" : "text-gray-500"
                        }`}
                      >
                        12 months
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedTimeRange("30days")}
                      className={`h-8 sm:h-9 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden transition-all flex-shrink-0 ${
                        selectedTimeRange === "30days"
                          ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-xs sm:text-sm font-semibold font-['Inter'] leading-5 whitespace-nowrap ${
                          selectedTimeRange === "30days" ? "text-gray-700" : "text-gray-500"
                        }`}
                      >
                        30 days
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedTimeRange("7days")}
                      className={`h-8 sm:h-9 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden transition-all flex-shrink-0 ${
                        selectedTimeRange === "7days"
                          ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-xs sm:text-sm font-semibold font-['Inter'] leading-5 whitespace-nowrap ${
                          selectedTimeRange === "7days" ? "text-gray-700" : "text-gray-500"
                        }`}
                      >
                        7 days
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedTimeRange("24hours")}
                      className={`h-8 sm:h-9 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden transition-all flex-shrink-0 ${
                        selectedTimeRange === "24hours"
                          ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-xs sm:text-sm font-semibold font-['Inter'] leading-5 whitespace-nowrap ${
                          selectedTimeRange === "24hours" ? "text-gray-700" : "text-gray-500"
                        }`}
                      >
                        24 hours
                      </div>
                    </button>
                  </div>

                  {/* Filter button */}
                  <button
                    onClick={() => console.log("Filters clicked")}
                    className="px-3 py-1.5 sm:py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex justify-center items-center gap-1 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors h-8 sm:h-9"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 relative overflow-hidden">
                      <div className="w-[12px] sm:w-[14px] h-[9px] sm:h-[10px] left-[2px] sm:left-[2.5px] top-[4px] sm:top-[5px] absolute outline outline-[1.5px] sm:outline-[1.67px] outline-offset-[-0.75px] sm:outline-offset-[-0.83px] outline-gray-700" />
                    </div>
                    <div className="px-0.5 flex justify-center items-center">
                      <div className="text-gray-700 text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                        Filters
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bar chart — full width, responsive height */}
          <div className="w-full max-w-[1280px] px-4 sm:px-8">
            <div className="w-full bg-white overflow-x-auto">
              <BarChart
                data={[
                  20, 14, 3, 20, 24, 12, 16, 20, 28, 36, 2, 2, 16, 6, 4, 6, 2,
                  44, 2, 20, 16, 8, 36, 14, 14, 32, 5, 24, 28, 12, 20, 28, 28,
                  20, 28, 32, 36, 9, 9, 36, 36, 36,
                ]}
                height={208}
                color="#3373F5"
                timeRange={selectedTimeRange}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}