"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

interface Campaign {
  _id: string;
  name: string;
}

interface Opportunity {
  company: string;
  website: string;
  name: string;
  role: string;
  email: string;
  status: string;
}

interface CampaignStats {
  totalSent: number;
  totalClicks: number;
  totalOpened: number;
  totalReplied: number;
  totalOpportunities: number;
  campaignCount: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("12 months");
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [opportunityFilter, setOpportunityFilter] = useState<string>("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        // 1. Fetch Stats
        const statsUrl = selectedCampaignId === "all" 
          ? "/api/campaigns/stats" 
          : `/api/campaigns/stats?campaignId=${selectedCampaignId}`;
          
        const statsRes = await fetch(statsUrl, { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // 2. Fetch Real Opportunities (replies with attribution)
        const oppsUrl = selectedCampaignId === "all"
          ? "/api/campaigns/opportunities"
          : `/api/campaigns/opportunities?campaignId=${selectedCampaignId}`;
        
        const oppsRes = await fetch(oppsUrl, { headers });
        if (oppsRes.ok) {
          const oppsData = await oppsRes.json();
          setOpportunities(oppsData.opportunities || []);
        }

      } catch (err) {
        console.error("Error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCampaignId]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const calculateRate = (part: number, total: number) => {
    if (!total || total === 0) return "0.0%";
    return ((part / total) * 100).toFixed(1) + "%";
  };

  const chartMeta = useMemo(() => {
    const rawSent = stats?.totalSent || 0;
    const rawOpened = stats?.totalOpened || 0;
    const rawEngaged = stats?.totalClicks || 0;

    let maxVal = 1000;
    if (rawSent > 0) {
      maxVal = Math.max(rawSent * 1.5, 10); 
    }

    const points = 12;
    const width = 1010;
    const height = 140; 
    const step = width / (points - 1);
    const getVal = (val: number, fallback: number) => (rawSent === 0 ? fallback : val);
    const baseSent = getVal(rawSent, 400); 
    const baseOpened = getVal(rawOpened, 250);
    const baseUnique = getVal(rawEngaged, 100);

    const generatePath = (val: number, variance: number, seed: number) => {
      let currentVal = val * 0.7; 
      let path = `M 0,${height - (currentVal / maxVal) * height}`;
      const avgStep = (val * 0.3) / points; 
      for (let i = 1; i < points; i++) {
        const wobble = Math.sin(i * 0.5 + seed) * (val * 0.1 * variance);
        currentVal += avgStep + wobble;
        const normalizedY = Math.min(Math.max(currentVal / maxVal, 0), 1);
        const y = height - (normalizedY * height);
        path += ` L ${i * step},${y}`;
      }
      return path;
    };

    return {
      maxVal,
      labels: [1, 0.8, 0.6, 0.4, 0.2, 0].map(v => Math.round(v * maxVal)),
      paths: { sent: generatePath(baseSent, 1, 1), opens: generatePath(baseOpened, 0.8, 2), unique: generatePath(baseUnique, 0.6, 3) }
    };
  }, [stats]);

  const selectedCampaignName = selectedCampaignId === "all" 
    ? "All Campaigns" 
    : campaigns.find(c => c._id === selectedCampaignId)?.name || "Campaign";

  const statusOptions = ["all", "lead", "meeting_booked", "possible", "not_interested", "wrong_person"];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opportunitySearch.trim() === "" || 
      opp.company.toLowerCase().includes(opportunitySearch.toLowerCase()) ||
      opp.name.toLowerCase().includes(opportunitySearch.toLowerCase()) ||
      opp.email.toLowerCase().includes(opportunitySearch.toLowerCase());
    const matchesFilter = opportunityFilter === "all" || opp.status === opportunityFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-[1440px] mx-auto flex bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex w-full flex-col bg-white overflow-x-hidden">
        <MobileHeader />
        <section className="relative flex flex-col items-center pb-12 gap-9 overflow-x-hidden px-4 md:px-0">
          <div className="self-stretch pb-12 inline-flex flex-col justify-start items-center">
            
            <div className="self-stretch px-16 py-10 flex flex-col justify-center items-center gap-5">
              <div className="w-16 h-16 relative rounded-[200px] bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">S</div>
              <div className="self-stretch text-center text-gray-900 text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">Here is the report of your campaigns.</div>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-9 px-8">
              <div className="self-stretch h-px bg-blue-300" />

              {/* REPORTS HEADER SECTION */}
              <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
                  <div className="flex-1 min-w-80 inline-flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch justify-start text-gray-900 text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">Reports</div>
                      <div className="self-stretch justify-start text-gray-600 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">Check your campaign performance at a glance.</div>
                  </div>
                  <div className="flex justify-start items-center gap-3">
                      <div className="px-3.5 py-2.5 bg-white rounded-lg shadow-sm border border-zinc-300 flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-50">
                          <div className="px-0.5 text-gray-700 text-sm font-semibold">Share</div>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"><path d="M12 4L7 9L2 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="px-3.5 py-2.5 bg-white rounded-lg shadow-sm border border-zinc-300 flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-50">
                          <div className="px-0.5 text-gray-700 text-sm font-semibold">Filter</div>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M2.5 4.5H9.5M4 7.5H8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <div className="px-3.5 py-2.5 bg-white rounded-lg shadow-sm border border-zinc-300 flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-50">
                          <div className="px-0.5 text-gray-700 text-sm font-semibold">Month to date</div>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M2.5 4.5H9.5M4 7.5H8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                  </div>
              </div>

              {/* STAT CARDS */}
              <div className="self-stretch inline-flex justify-start items-start gap-5 flex-wrap content-start">
                {[
                  { label: "Total sent", val: stats?.totalSent, rate: "Delivered", color: "blue" },
                  { label: "Open rate", val: calculateRate(stats?.totalOpened || 0, stats?.totalSent || 0), rate: "Read rate", color: "gray" },
                  { label: "Click rate", val: calculateRate(stats?.totalClicks || 0, stats?.totalSent || 0), rate: "Engagement", color: "gray" },
                  { label: "Reply rate", val: calculateRate(stats?.totalReplied || 0, stats?.totalSent || 0), rate: "Response", color: "gray" }
                ].map((stat, i) => (
                  <div key={i} className={`flex-1 min-w-[200px] p-5 bg-white rounded-xl shadow-sm border ${stat.color === 'blue' ? 'border-blue-600 border-2' : 'border-gray-200'} inline-flex flex-col gap-5`}>
                    <div className="text-gray-900 text-base font-semibold">{stat.label}</div>
                    <div className="flex flex-col gap-3">
                      <div className="text-gray-900 text-3xl font-semibold">{loading ? "..." : stat.val}</div>
                      {stat.rate && <div className="text-emerald-700 text-sm font-medium">{stat.rate}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* SELECTOR PANEL */}
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-2 relative">
                    <div className="inline-flex justify-center items-center gap-1 overflow-hidden cursor-pointer group"
                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="justify-start text-gray-600 text-sm font-semibold group-hover:text-blue-600 transition-colors">Select campaign</div>
                        <div className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-600"><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center gap-3">
                        <div className="justify-start text-gray-900 text-3xl font-semibold leading-9">{selectedCampaignName}</div>
                        <div className="pl-1.5 pr-2 py-0.5 bg-white rounded-md shadow-sm border border-zinc-300 flex justify-start items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <div className="text-gray-700 text-sm font-medium">Live stats</div>
                        </div>
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute top-12 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden ring-4 ring-black ring-opacity-5">
                          <div className="p-2">
                             <button onClick={() => { setSelectedCampaignId("all"); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${selectedCampaignId === "all" ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>All Campaigns</button>
                             {campaigns.map((camp) => (
                               <button key={camp._id} onClick={() => { setSelectedCampaignId(camp._id); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${selectedCampaignId === camp._id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>{camp.name}</button>
                             ))}
                          </div>
                        </div>
                    )}
                  </div>

                  {/* Time Range Tabs */}
                  <div className="flex justify-start items-start gap-3">
                      <div className="bg-neutral-50 rounded-lg border border-gray-200 flex justify-start items-center gap-0.5 overflow-hidden">
                          {["12 months", "30 days", "7 days", "24 hours"].map((range) => (
                            <button 
                              key={range}
                              onClick={() => setSelectedRange(range)}
                              className={`h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 transition-all ${selectedRange === range ? 'bg-white shadow-sm border border-zinc-300 text-gray-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <div className="text-sm font-semibold whitespace-nowrap">{range}</div>
                            </button>
                          ))}
                      </div>
                  </div>
                </div>

                {/* CHART AREA */}
                <div className="self-stretch h-72 relative mt-4">
                    <div className="w-full h-full relative inline-flex justify-start items-start gap-0">
                        <div className="w-6 self-stretch pb-10 flex flex-col justify-center items-center">
                            <div className="origin-center -rotate-90 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Performance</div>
                        </div>
                        <div className="flex-1 self-stretch relative flex flex-col">
                            <div className="self-end inline-flex gap-3 mb-4">
                               <div className="flex items-center gap-2"><div className="w-2 h-2 bg-violet-500 rounded-full" /><div className="text-gray-600 text-sm">Sent</div></div>
                               <div className="flex items-center gap-2"><div className="w-2 h-2 bg-violet-400 rounded-full" /><div className="text-gray-600 text-sm">Opens</div></div>
                               <div className="flex items-center gap-2"><div className="w-2 h-2 bg-violet-700 rounded-full" /><div className="text-gray-600 text-sm">Unique</div></div>
                            </div>
                            <div className="self-stretch flex-1 flex flex-col justify-between items-start select-none relative">
                                {chartMeta.labels.map((lbl, idx) => (
                                  <div key={idx} className="self-stretch h-5 inline-flex justify-start items-center gap-2">
                                      <div className="w-10 text-right text-gray-600 text-xs">{formatNumber(lbl)}</div>
                                      <div className="flex-1 h-px bg-neutral-100/50"></div>
                                  </div>
                                ))}
                                <div className="absolute left-[48px] right-0 h-40 top-[10px] overflow-visible">
                                   <svg width="100%" height="100%" viewBox="0 0 1000 140" fill="none" preserveAspectRatio="none">
                                      <path d={`${chartMeta.paths.sent} L 1000,140 L 0,140 Z`} fill="url(#grad1)" opacity="0.05" />
                                      <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
                                      <path d={chartMeta.paths.sent} stroke="#8B5CF6" strokeWidth="3" fill="none" strokeLinecap="round" />
                                      <path d={chartMeta.paths.opens} stroke="#A78BFA" strokeWidth="2.5" fill="none" strokeDasharray="6 6" />
                                      <path d={chartMeta.paths.unique} stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeDasharray="4 4" />
                                   </svg>
                                </div>
                            </div>
                            <div className="pl-12 pr-0 mt-4 inline-flex justify-between items-center select-none">
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                                  <div key={m} className="text-center text-gray-600 text-xs flex-1">{m}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* BUSINESS OPPORTUNITIES TABLE */}
              <div className="self-stretch flex flex-col justify-start items-start gap-5 mt-9">
                  <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap">
                      <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-0.5">
                          <div className="self-stretch justify-start text-gray-900 text-lg font-semibold leading-7">Business opportunities achieved</div>
                      </div>
                      <div className="flex-1 max-w-80 inline-flex flex-col justify-start items-start gap-1.5">
                          <div className="self-stretch px-3 py-2 bg-white rounded-lg shadow-sm border border-zinc-300 inline-flex justify-start items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" className="shrink-0"><circle cx="6" cy="6" r="4"/><path d="M10 10L13 13"/></svg>
                              <input
                                type="text"
                                placeholder="Search by company, name, email..."
                                value={opportunitySearch}
                                onChange={(e) => setOpportunitySearch(e.target.value)}
                                className="flex-1 text-gray-700 text-sm font-normal outline-none bg-transparent placeholder-gray-400"
                              />
                              {opportunitySearch && (
                                <button onClick={() => setOpportunitySearch("")} className="text-gray-400 hover:text-gray-600 shrink-0">
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3L3 9M3 3L9 9" strokeLinecap="round"/></svg>
                                </button>
                              )}
                          </div>
                      </div>
                      <div className="relative">
                        <select
                          value={opportunityFilter}
                          onChange={(e) => setOpportunityFilter(e.target.value)}
                          className="appearance-none px-3.5 py-2.5 pr-8 bg-white rounded-lg shadow-sm border border-zinc-300 cursor-pointer hover:bg-gray-50 text-gray-700 text-sm font-semibold outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="lead">Lead</option>
                          <option value="meeting_booked">Meeting Booked</option>
                          <option value="possible">Possible</option>
                          <option value="not_interested">Not Interested</option>
                          <option value="wrong_person">Wrong Person</option>
                        </select>
                        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                  </div>

                  <div className="w-full overflow-x-auto">
                      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                          <div className="flex flex-nowrap bg-neutral-50 border-b border-gray-200">
                             <div className="flex-1 min-w-[240px] px-4 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">Company</div>
                             <div className="w-48 px-4 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">Name</div>
                             <div className="w-40 px-4 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">Role</div>
                             <div className="w-48 px-4 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">Email</div>
                             <div className="w-40 px-4 py-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">Status</div>
                          </div>
                          <div className="divide-y divide-gray-100 flex flex-col">
                             {filteredOpportunities.length > 0 ? filteredOpportunities.map((opp, idx) => (
                               <div key={idx} className="flex flex-nowrap items-center hover:bg-slate-50 transition-colors">
                                  <div className="flex-1 min-w-[240px] px-4 py-4 flex items-center gap-3">
                                     <div className="w-4 h-4 rounded border border-blue-700 bg-blue-700 flex items-center justify-center">
                                         <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white"><path d="M3 7L6 10L11 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                     </div>
                                     <div className="w-10 h-10 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-slate-400">
                                        {opp.company[0]}
                                     </div>
                                     <div className="flex flex-col">
                                        <div className="text-gray-900 text-sm font-medium">{opp.company}</div>
                                        <div className="text-gray-600 text-xs">{opp.website}</div>
                                     </div>
                                  </div>
                                  <div className="w-48 px-4 py-4 text-gray-600 text-sm">{opp.name}</div>
                                  <div className="w-40 px-4 py-4 text-gray-600 text-sm">{opp.role}</div>
                                  <div className="w-48 px-4 py-4 text-gray-600 text-sm truncate">{opp.email}</div>
                                  <div className="w-40 px-4 py-4">
                                     <div className={`px-2 py-0.5 rounded-2xl text-xs font-medium inline-flex ${opp.status === 'meeting_booked' || opp.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}>
                                        {opp.status.replace('_', ' ')}
                                     </div>
                                  </div>
                               </div>
                             )) : (
                               <div className="p-8 text-center text-gray-500 italic">
                                 {loading ? "Loading live opportunities..." : (opportunitySearch || opportunityFilter !== "all") ? "No results match your search or filter." : "No precise campaign replies detected yet."}
                               </div>
                             )}
                          </div>
                      </div>
                      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-white">
                          <div className="text-gray-700 text-sm font-medium">Page 1 of 1</div>
                          <div className="flex gap-3">
                              <button disabled className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-zinc-400 text-sm font-semibold opacity-50">Previous</button>
                              <button className="px-3 py-2 bg-white rounded-lg border border-zinc-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 shadow-sm">Next</button>
                          </div>
                      </div>
                  </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      {isDropdownOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsDropdownOpen(false)} />}
    </div>
  );
}