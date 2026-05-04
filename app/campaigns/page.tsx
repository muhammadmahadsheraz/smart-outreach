"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Campaign {
  name: string;
  status: string;
  progress: number;
  sent: number;
  click: number;
  replied: number;
  replyPct: string;
  opportunities: number;
}

// ── Data Fetching & Transformation ─────────────────────────────────────────────
const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const res = await fetch("/api/campaigns", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch campaigns");
    
    const data = await res.json();
    
    // Transform database campaigns to match table format
    return data.map((c: any, index: number) => {
      // Calculate total emails: recipientCount * number of emails in sequence
      const emailsPerProspect = c.emailSequence?.length || 1;
      const totalEmails = (c.recipientCount || 0) * emailsPerProspect;
      const progressPercent = totalEmails > 0 ? Math.min(100, Math.round((c.sentCount / totalEmails) * 100)) : 0;
      
      return {
        name: `${c.name} #${index + 1}`,
        status: capitalizeStatus(c.status),
        progress: progressPercent,
        sent: c.sentCount || 0,
        click: c.clicks || 0,
        replied: c.replied || 0,
        replyPct: c.sentCount > 0 ? Math.round((c.replied / c.sentCount) * 100) + "%" : "0%",
        opportunities: c.opportunities || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
};

// ── Utilities ──────────────────────────────────────────────────────────────────
const capitalizeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: "Draft",
    sent: "Active",
    sending: "Active",
    scheduled: "Active",
    active: "Active",
    paused: "Paused",
  };
  return statusMap[status.toLowerCase()] || "Draft";
};

const STATUS_STYLES = {
  Draft:  { bg: "bg-sky-50",     border: "outline-sky-200",    text: "text-sky-700" },
  Paused: { bg: "bg-orange-50",  border: "outline-orange-200", text: "text-orange-700" },
  Active: { bg: "bg-emerald-50", border: "outline-emerald-200",text: "text-emerald-700" },
};

function StatusBadge({ label }: { label: string }) {
  const s = STATUS_STYLES[label as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.Draft;
  return (
    <span className={`px-2 py-0.5 ${s.bg} rounded-2xl outline outline-1 outline-offset-[-1px] ${s.border} text-xs font-medium font-['Inter'] leading-4 ${s.text}`}>
      {label}
    </span>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2 bg-blue-700 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-gray-700 text-xs font-['Plus_Jakarta_Sans'] whitespace-nowrap">{pct}%</span>
    </div>
  );
}

// ── Mobile card view ───────────────────────────────────────────────────────────
function CampaignCard({ c, selected, onSelect }: { c: Campaign; selected: boolean; onSelect: () => void }) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 flex flex-col gap-3 shadow-sm transition-colors ${
        selected ? "border-blue-300 bg-blue-50/30" : "border-gray-200"
      }`}
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-zinc-300 accent-blue-700 cursor-pointer"
          />
          <span className="text-gray-900 text-sm font-semibold font-['Plus_Jakarta_Sans']">{c.name}</span>
        </div>
        <StatusBadge label={c.status} />
      </div>

      {/* progress */}
      <ProgressBar pct={c.progress} />

      {/* stats grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Sent",    value: c.sent },
          { label: "Clicks",  value: c.click },
          { label: "Replied", value: c.replied },
          { label: "Opps",    value: c.opportunities },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-gray-400 text-[10px] font-medium font-['Plus_Jakarta_Sans'] uppercase tracking-wide">{label}</span>
            <span className="text-gray-800 text-sm font-semibold font-['Plus_Jakarta_Sans']">{value}</span>
          </div>
        ))}
      </div>

      {/* actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <button className="flex-1 text-xs font-medium text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          Edit
        </button>
        <button className="flex-1 text-xs font-medium text-gray-600 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          More
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Campaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const handleAddNew = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const res = await fetch("/api/gmail/status", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.connected) {
          // Not connected — trigger OAuth, redirect back to campaigns/new after
          const authRes = await fetch("/api/gmail/auth-url?redirect=campaigns/new", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (authRes.ok) {
            const authData = await authRes.json();
            if (authData.ok && authData.url) {
              window.location.href = authData.url;
              return;
            }
          }
          alert("Failed to start Gmail connection. Please try again.");
          return;
        }
      }
      // Gmail connected — go straight to new campaign
      router.push("/campaigns/new");
    } catch (error) {
      console.error("Error checking Gmail status:", error);
      router.push("/campaigns/new");
    }
  }, [router]);

  // Fetch campaigns on mount
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      const fetchedCampaigns = await fetchCampaigns();
      setCampaigns(fetchedCampaigns);
      setLoading(false);
    };
    
    loadCampaigns();
    
    // Refresh campaigns every 2 seconds while any are still sending
    const interval = setInterval(async () => {
      const fetchedCampaigns = await fetchCampaigns();
      setCampaigns(fetchedCampaigns);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleAll = () => {
    setSelected(selected.size === campaigns.length ? new Set() : new Set(campaigns.map((_, i) => i)));
  };
  const toggleOne = (i: number) => {
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  const filtered = campaigns
    .filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      sortOrder === "newest" ? campaigns.indexOf(b) - campaigns.indexOf(a) : campaigns.indexOf(a) - campaigns.indexOf(b)
    );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex bg-slate-50 font-sans min-h-screen">
      <main className="flex w-full bg-white">
        <Sidebar />

        <section className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden">
          <MobileHeader />

          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 flex flex-col gap-4 sm:gap-6">

            {/* Hero */}
            <div className="py-6 sm:py-8 lg:py-12 flex flex-col items-center gap-3 sm:gap-4 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center shadow-sm">
                <svg width="24" height="24" className="sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="#1d4ed8" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="max-w-md text-gray-900 text-base sm:text-lg lg:text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-6 sm:leading-7 px-4">
                Hi! I'm going to find prospects interested in your business.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-blue-200 w-full" />

            {/* Section header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 text-lg sm:text-xl lg:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-7 sm:leading-8">
                Campaigns
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-normal font-['Plus_Jakarta_Sans'] leading-5 sm:leading-6">
                Here you can see all your active campaigns
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
              {/* Search */}
              <div className="w-full sm:flex-1 sm:min-w-[160px] sm:max-w-xs">
                <div className="px-3 py-2 bg-white rounded-lg shadow-sm border border-zinc-300 flex items-center gap-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    className="flex-1 text-gray-700 text-sm font-['Plus_Jakarta_Sans'] bg-transparent outline-none placeholder-gray-400"
                    placeholder="Search campaigns…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-lg border border-zinc-300 text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm cursor-pointer outline-none"
                >
                  {["All", "Draft", "Active", "Paused"].map((s) => (
                    <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-lg border border-zinc-300 text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm cursor-pointer outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>

                {/* Add new */}
                <button
                  onClick={handleAddNew}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-700 rounded-lg text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-colors shadow-sm"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="whitespace-nowrap">Add new</span>
                </button>
              </div>
            </div>

            {/* ── Mobile: Cards ── */}
            <div className="flex flex-col gap-3 md:hidden">
              {loading ? (
                <div className="text-center py-12 text-gray-400 text-sm font-['Plus_Jakarta_Sans']">Loading campaigns...</div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm font-['Plus_Jakarta_Sans']">No campaigns found.</div>
              ) : (
                paginated.map((c, i) => (
                  <CampaignCard
                    key={c.name}
                    c={c}
                    selected={selected.has(i)}
                    onSelect={() => toggleOne(i)}
                  />
                ))
              )}
            </div>

            {/* ── Desktop: Table ── */}
            <div className="hidden md:block w-full overflow-x-auto rounded-xl shadow-sm border border-gray-200">
              <table className="min-w-full bg-white text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-gray-200">
                    <th className="px-3 lg:px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-zinc-300 accent-blue-700 cursor-pointer"
                        checked={selected.size === paginated.length && paginated.length > 0}
                        onChange={toggleAll}
                        disabled={loading}
                      />
                    </th>
                    {["Name", "Status", "Progress", "Sent", "Clicks", "Replied", "Opportunities", "", ""].map((h, i) => (
                      <th
                        key={i}
                        className="px-2 lg:px-4 py-3 text-gray-500 text-[10px] sm:text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-gray-400 text-sm font-['Plus_Jakarta_Sans']">
                        Loading campaigns...
                      </td>
                    </tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-gray-400 text-sm font-['Plus_Jakarta_Sans']">
                        No campaigns found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((c, i) => (
                      <tr
                        key={c.name}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          selected.has(i) ? "bg-blue-50/30" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-3 lg:px-4 py-3 lg:py-4">
                          <input
                            type="checkbox"
                            checked={selected.has(i)}
                            onChange={() => toggleOne(i)}
                            className="w-4 h-4 rounded border-zinc-300 accent-blue-700 cursor-pointer"
                          />
                        </td>

                        {/* Name */}
                        <td className="px-2 lg:px-4 py-3 lg:py-4 text-gray-800 text-xs sm:text-sm font-medium font-['Plus_Jakarta_Sans'] whitespace-nowrap">
                          {c.name}
                        </td>

                        {/* Status */}
                        <td className="px-2 lg:px-4 py-3 lg:py-4">
                          <StatusBadge label={c.status} />
                        </td>

                        {/* Progress */}
                        <td className="px-2 lg:px-4 py-3 lg:py-4 min-w-[100px] lg:min-w-[130px]">
                          <ProgressBar pct={c.progress} />
                        </td>

                        {/* Sent */}
                        <td className="px-2 lg:px-4 py-3 lg:py-4 text-gray-600 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">{c.sent}</td>

                        {/* Clicks */}
                        <td className="px-2 lg:px-4 py-3 lg:py-4 text-gray-600 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">{c.click}</td>

                        {/* Replied */}
                        <td className="px-2 lg:px-4 py-3 lg:py-4">
                          <div className="flex items-center gap-1.5 lg:gap-2">
                            <span className="text-gray-600 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">{c.replied}</span>
                            <span className="px-1.5 lg:px-2 py-0.5 bg-amber-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-amber-200 text-amber-700 text-[10px] sm:text-xs font-medium font-['Inter']">
                              {c.replyPct}
                            </span>
                          </div>
                        </td>

                        {/* Opportunities */}
                        <td className="px-2 lg:px-4 py-3 lg:py-4 text-gray-600 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">{c.opportunities}</td>

                        {/* Edit */}
                        <td className="px-2 lg:px-3 py-3 lg:py-4">
                          <button className="p-1 lg:p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
                            <svg width="14" height="14" className="lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2 2 0 112.828 2.828L11.828 15.828 8 17l1.172-3.828z" />
                            </svg>
                          </button>
                        </td>

                        {/* More */}
                        <td className="px-2 lg:px-3 py-3 lg:py-4">
                          <button className="p-1 lg:p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="More options">
                            <svg width="14" height="14" className="lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-4 lg:px-6 py-3 flex flex-wrap justify-between items-center gap-3 border-t border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm font-medium font-['Plus_Jakarta_Sans']">
                  Page {page} of {totalPages || 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2.5 lg:px-3 py-1.5 lg:py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm disabled:text-zinc-300 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-2.5 lg:px-3 py-1.5 lg:py-2 bg-white rounded-lg border border-zinc-300 text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm disabled:text-zinc-300 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile pagination */}
            <div className="flex md:hidden items-center justify-between pt-2">
              <span className="text-gray-600 text-xs sm:text-sm font-medium font-['Plus_Jakarta_Sans']">
                Page {page} of {totalPages || 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm disabled:text-zinc-300 disabled:cursor-not-allowed text-gray-700"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-zinc-300 text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm disabled:text-zinc-300 disabled:cursor-not-allowed text-gray-700"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}