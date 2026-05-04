"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

// ── Prospects will be fetched from backend on search ────────────────────────────────────────────────────────────

// ── Tag chip ──────────────────────────────────────────────────────────────────
function Tag({ label, onRemove }: { label: string; onRemove: (label: string) => void }) {
  return (
    <div className="pl-2 pr-1 py-[3px] bg-white rounded-md border border-zinc-300 flex items-center gap-1">
      <span className="text-gray-700 text-xs font-medium font-['Inter'] leading-4">{label}</span>
      <button onClick={() => onRemove(label)} className="p-0.5 rounded hover:bg-gray-100">
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Prospect row ──────────────────────────────────────────────────────────────
function ProspectRow({
  prospect,
  checked,
  onToggle,
}: {
  prospect: { company: string; url: string; name: string; role: string; checked: boolean };
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 px-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${checked ? "bg-blue-50/30" : "bg-white"}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 rounded border-zinc-300 accent-blue-700 cursor-pointer shrink-0"
      />
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0 text-blue-700 text-xs font-semibold">
        {prospect.company[0]}
      </div>
      {/* Company */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-gray-900 text-sm font-medium font-['Plus_Jakarta_Sans'] truncate">{prospect.company}</span>
        <span className="text-gray-500 text-xs font-['Plus_Jakarta_Sans'] truncate">{prospect.url}</span>
      </div>
      {/* Name — hide on xs */}
      <div className="hidden sm:block text-gray-600 text-sm font-['Plus_Jakarta_Sans'] w-32 truncate shrink-0">{prospect.name}</div>
      {/* Role — hide on sm */}
      <div className="hidden md:block text-gray-600 text-sm font-['Plus_Jakarta_Sans'] w-24 truncate shrink-0">{prospect.role}</div>
    </div>
  );
}

// ── Props interface ────────────────────────────────────────────────────────────
interface IdealCustomerProps {
  country: string;
  setCountry: (value: string) => void;
  jobTags: string[];
  setJobTags: (tags: string[]) => void;
  jobInput: string;
  setJobInput: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  employees: string;
  setEmployees: (value: string) => void;
  selected: Set<number>;
  setSelected: (selected: Set<number>) => void;
  prospectPage: number;
  setProspectPage: (page: number) => void;
  removeTag: (tag: string) => void;
  addTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleProspect: (i: number) => void;
  toggleAll: () => void;
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  stepTitles: { [key: number]: { title: string; description: string } };
  prospects?: any[];
  setProspectsList?: (prospects: any[]) => void;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function IdealCustomer({
  country,
  setCountry,
  jobTags,
  setJobTags,
  jobInput,
  setJobInput,
  industry,
  setIndustry,
  keywords,
  setKeywords,
  employees,
  setEmployees,
  selected,
  setSelected,
  prospectPage,
  setProspectPage,
  removeTag,
  addTag,
  toggleProspect,
  toggleAll,
  currentStep,
  onPrevious,
  onNext,
  stepTitles,
  prospects: propsProspects,
  setProspectsList,
}: IdealCustomerProps) {
  const [localProspects, setLocalProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination constants
  const ITEMS_PER_PAGE = 10;

  // Use props prospects if available, otherwise use local state
  const prospects = propsProspects && propsProspects.length > 0 ? propsProspects : localProspects;
  const setProspects = propsProspects && propsProspects.length > 0 ? setProspectsList || (() => {}) : setLocalProspects;

  // Calculate pagination
  const totalPages = Math.ceil(prospects.length / ITEMS_PER_PAGE);
  
  // Ensure prospectPage is valid
  const validProspectPage = prospectPage > totalPages && totalPages > 0 ? totalPages : prospectPage < 1 ? 1 : prospectPage;
  
  // Update page if invalid (and notify parent)
  useEffect(() => {
    if (validProspectPage !== prospectPage) {
      setProspectPage(validProspectPage);
    }
  }, [totalPages]);

  const startIndex = (validProspectPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProspects = prospects.slice(startIndex, endIndex);

  // Handle toggle all locally with dynamic prospect count
  const handleToggleAll = () => {
    if (selected.size === prospects.length && prospects.length > 0) {
      setSelected(new Set());
    } else if (prospects.length > 0) {
      setSelected(new Set(Array.from({ length: prospects.length }, (_, i) => i)));
    }
  };

  const handleSearchProspects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Searching prospects with:", { country, jobTags, industry, keywords, employees });
      
      const response = await fetch("/api/prospects/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country || undefined,
          jobTitles: jobTags.length > 0 ? jobTags : undefined,
          industry: industry || undefined,
          keywords: keywords || undefined,
          employees: employees || undefined,
        }),
      });

      if (!response.ok) throw new Error(`Search failed: ${response.status}`);

      const data = await response.json();
      console.log("Response received:", data);
      
      if (data.success && data.prospects && data.prospects.length > 0) {
        const mappedProspects = data.prospects.map((p: any) => ({
          ...p,
          checked: false,
        }));
        console.log("Mapped prospects:", mappedProspects);
        
        setProspects(mappedProspects);
        if (setProspectsList) setProspectsList(mappedProspects);
        setSelected(new Set());
        setProspectPage(1);
        setHasSearched(true);
      } else if (data.prospects && data.prospects.length === 0) {
        setProspects([]);
        if (setProspectsList) setProspectsList([]);
        setHasSearched(true);
        setError("No prospects found matching your criteria");
      } else {
        setProspects([]);
        if (setProspectsList) setProspectsList([]);
        setError("No prospects found matching your criteria");
      }
    } catch (err) {
      setError("Failed to search prospects. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Header section */}
      <div className="flex flex-col justify-start items-center gap-6 mb-6 px-0 lg:px-8">
        <div className="w-full flex flex-col justify-start items-start gap-5">
          <div className="self-stretch flex flex-col justify-start items-start gap-5">
            <div className="self-stretch inline-flex justify-between items-start gap-4 flex-wrap content-start">
              {/* Title and description */}
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-gray-900 text-xl sm:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                  {stepTitles[currentStep]?.title}
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
                  {stepTitles[currentStep]?.description}
                </div>
              </div>
              {/* Navigation buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {currentStep === 3 ? (
                  <button
                    onClick={() => onPrevious()}
                    className="px-3 py-2 bg-blue-700 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 inline-flex justify-center items-center gap-1 overflow-hidden"
                  >
                    <div className="px-0.5 flex justify-center items-center">
                      <div className="justify-start text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">Edit</div>
                    </div>
                    <div className="w-5 h-5 relative overflow-hidden">
                        <Image src="/icons/edit_icon.svg" alt="Edit" height = {12} width= {12} className = "w-[15px] h-[15px]"/>
                    </div>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onPrevious}
                      disabled={currentStep === 0}
                      className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm transition-colors ${
                        currentStep === 0
                          ? "bg-white border border-gray-200 text-zinc-400 cursor-not-allowed"
                          : "bg-white border border-zinc-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    <button
                      onClick={onNext}
                      disabled={currentStep === 3}
                      className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm transition-colors ${
                        currentStep === 3
                          ? "bg-gray-200 text-zinc-400 cursor-not-allowed"
                          : "bg-blue-700 text-white hover:bg-blue-800"
                      }`}
                    >
                      Next
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 w-full px-0 lg:px-8">

        {/* ── LEFT: Filter form ── */}
        <div className="w-full xl:flex-1 flex flex-col gap-5 min-w-0">

          {/* Country / city */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">Country or city</label>
            <input
              className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm text-sm font-['Plus_Jakarta_Sans'] text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="e.g. United States, New York…"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Job Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">Job Title</label>
            <div className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm flex flex-wrap gap-1.5 items-center focus-within:ring-2 focus-within:ring-blue-300 transition min-h-[40px]">
              {jobTags.map((tag) => <Tag key={tag} label={tag} onRemove={removeTag} />)}
              <input
                className="flex-1 min-w-[80px] text-sm font-['Plus_Jakarta_Sans'] text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                placeholder="e.g. CEO, Founder, VP Sales, CTO…"
                value={jobInput}
                onChange={(e) => setJobInput(e.target.value)}
                onKeyDown={addTag}
              />
            </div>
            <p className="text-gray-400 text-xs font-['Plus_Jakarta_Sans']">Press Enter or comma to add</p>
          </div>

          {/* Industries */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">Industries</label>
            <div className="relative">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm text-sm font-['Plus_Jakarta_Sans'] text-gray-600 outline-none appearance-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
              >
                <option value="">Select</option>
                {["Technology", "Finance", "Healthcare", "Retail", "Marketing"].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">Keywords</label>
            <textarea
              className="w-full px-3.5 py-3 bg-white rounded-lg border border-zinc-300 shadow-sm text-sm font-['Plus_Jakarta_Sans'] text-gray-700 placeholder-gray-400 outline-none resize-y focus:ring-2 focus:ring-blue-300 transition"
              rows={3}
              placeholder="e.g. SaaS, B2B, growth…"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          {/* Number of employees */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">Number of employees</label>
            <div className="relative">
              <select
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm text-sm font-['Plus_Jakarta_Sans'] text-gray-600 outline-none appearance-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
              >
                <option value="">Select</option>
                {["1–10", "11–50", "51–200", "201–500", "500+"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search button with validation */}
          <button
            onClick={handleSearchProspects}
            disabled={loading || (!country && jobTags.length === 0 && !industry && !keywords && !employees)}
            title={!country && jobTags.length === 0 && !industry && !keywords && !employees ? "Please fill in at least one filter" : ""}
            className="w-full sm:w-auto sm:self-start px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] rounded-lg hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            {loading ? "Searching..." : "Find prospects"}
          </button>

          {/* Error message */}
          {error && (
            <div className="w-full sm:w-auto px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium font-['Plus_Jakarta_Sans']">
              {error}
            </div>
          )}

          {/* Validation message */}
          {!country && jobTags.length === 0 && !industry && !keywords && !employees && (
            <div className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium font-['Plus_Jakarta_Sans'] text-center">
              Fill in at least one filter to get started
            </div>
          )}

          {/* No results message */}
          {hasSearched && prospects.length === 0 && !error && (
            <div className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium font-['Plus_Jakarta_Sans'] text-center">
              No prospects found. Try adjusting your filters.
            </div>
          )}
        </div>

        {/* ── RIGHT: Prospects panel ── */}
        <div className="w-full xl:w-[520px] shrink-0 bg-sky-50 rounded-xl p-4 flex flex-col gap-4">
          {/* Panel header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 text-base sm:text-lg font-semibold font-['Plus_Jakarta_Sans']">Prospects I've found</span>
              <span className="px-2 py-0.5 bg-sky-100 rounded-2xl border border-blue-300 text-blue-800 text-xs font-medium font-['Inter']">
                {prospects.length} prospects
              </span>
            </div>
            <button
              onClick={handleToggleAll}
              className="px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              {selected.size === prospects.length && prospects.length > 0 ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="h-px bg-blue-300" />

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="max-h-[400px] xl:max-h-[500px] overflow-y-auto">
              {prospects.length === 0 && hasSearched ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm font-['Plus_Jakarta_Sans']">
                  No prospects found matching your criteria. Try adjusting your filters.
                </div>
              ) : prospects.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm font-['Plus_Jakarta_Sans']">
                  Click "Find prospects" to get started
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 bg-neutral-50 border-b border-gray-200 sticky top-0 z-10">
                    <input
                      type="checkbox"
                      checked={selected.size === prospects.length && prospects.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-zinc-300 accent-blue-700 cursor-pointer shrink-0"
                    />
                    <span className="flex-1 text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">Company</span>
                    <span className="hidden sm:block w-32 text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide shrink-0">Name</span>
                    <span className="hidden md:block w-24 text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide shrink-0">Role</span>
                  </div>

                  {/* Rows */}
                  {paginatedProspects.map((p: any, i: number) => (
                    <ProspectRow
                      key={i}
                      prospect={p}
                      checked={selected.has(startIndex + i)}
                      onToggle={() => toggleProspect(startIndex + i)}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Pagination — outside scroll area */}
            {prospects.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <span className="text-gray-600 text-sm font-medium font-['Plus_Jakarta_Sans']">Page {validProspectPage} of {totalPages || 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={validProspectPage === 1}
                    onClick={() => setProspectPage(validProspectPage - 1)}
                    className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm disabled:text-zinc-300 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={validProspectPage === totalPages || totalPages === 0}
                    onClick={() => setProspectPage(validProspectPage + 1)}
                    className="px-3 py-1.5 bg-white rounded-lg border border-zinc-300 text-sm font-semibold font-['Plus_Jakarta_Sans'] shadow-sm disabled:text-zinc-300 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Selected count */}
          {selected.size > 0 && (
            <div className="text-center text-blue-700 text-sm font-medium font-['Plus_Jakarta_Sans']">
              {selected.size} prospect{selected.size > 1 ? "s" : ""} selected
            </div>
          )}
        </div>

      </div>
    </>
  );
}
