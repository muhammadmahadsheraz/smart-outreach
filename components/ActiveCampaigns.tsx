"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Campaign {
  _id: string;
  name: string;
  status: string;
  color?: string;
  createdAt?: string;
}

const CAMPAIGN_COLORS = [
  "#3A88FD",
  "#7A5AF8",
  "#EE46BC",
  "#FF6B35",
  "#00B4D8",
  "#FFB703",
];

export default function ActiveCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        
        const data = await res.json();
        
        // Sort by creation date (most recent first) and take top 3
        const sorted = Array.isArray(data)
          ? data
              .sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
              })
              .slice(0, 3)
              .map((c: any, index: number) => ({
                _id: c._id,
                name: c.name,
                status: c.status,
                color: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
                createdAt: c.createdAt,
              }))
          : [];
        
        setCampaigns(sorted);
        setError(null);
      } catch (err) {
        console.error("Error fetching active campaigns:", err);
        setError(err instanceof Error ? err.message : "Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="flex w-full flex-col rounded-[12px] border border-[#D5D7DA] p-4 gap-4">
      <h3 className="text-sm font-semibold leading-5 text-slate-900">
        Active campaigns
      </h3>
      
      {loading && (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex w-full items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-200" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          Failed to load campaigns
        </div>
      )}

      {!loading && !error && campaigns.length === 0 && (
        <div className="text-sm text-slate-600">
          No campaigns yet
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <div className="flex flex-col gap-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="flex w-full items-center gap-2"
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: campaign.color }}
              />
              <span className="text-sm font-medium leading-5 text-slate-700 truncate">
                {campaign.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link href="/campaigns">
        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium leading-5 text-[#013F9D] hover:text-[#0A2F7F] transition-colors"
        >
          <span>View all</span>
          <Image
            src="/arrow-blue.svg"
            alt=""
            width={11.67}
            height={11.67}
            aria-hidden
          />
        </button>
      </Link>
    </div>
  );
}
