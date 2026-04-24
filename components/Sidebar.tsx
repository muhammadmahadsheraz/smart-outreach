"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import ActiveCampaigns from "@/components/ActiveCampaigns";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/login");
  };

  const sidebarContent = (
    <section className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      <div className="flex w-full flex-col px-5 gap-5 py-5">
        <div className="flex w-full items-center justify-between">
          <Image
            src="/images/logo.svg"
            alt="Ateni"
            width={142}
            height={28}
            priority
          />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5D7DA] p-2 hover:bg-slate-50 transition-colors"
          >
            <Image
              src="/images/chevron-left-double.svg"
              alt="Collapse navigation"
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="w-full">
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded-lg border border-[#D5D7DA] bg-white px-3 py-2 text-sm text-slate-900 outline-none shadow-[0px_1px_2px_0px_#0A0D120D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="flex w-full flex-col px-4 pt-2 space-y-1">
        {[
          { label: "Home", icon: "home", href: "/home" },
          { label: "Margot training", icon: "margot_training", href: "/margot_training" },
          { label: "Campaigns", icon: "campaigns", href: "/campaigns" },
          { label: "Inbox", icon: "inbox", href: "/inbox" },
          { label: "Reports", icon: "reports", href: "/reports" },
          { label: "CRM", icon: "reports", href: "/crm" },
        ].map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.label} href={item.href}>
              <button
                type="button"
                className={`flex h-11 w-full items-center rounded-lg px-2 py-0.5 gap-2 text-base leading-6 font-semibold ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex h-5 w-[22px] items-center justify-center">
                  <Image
                    src={`/${item.icon}.svg`}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>

      <div className="flex w-full flex-col px-4 pb-6 pt-4 gap-4 mt-auto">
        <Link href="/settings">
          <button
            type="button"
            className={`flex h-11 w-full items-center gap-2 rounded-lg px-2 py-0.5 text-base leading-6 font-semibold ${
              pathname === "/settings"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <Image
                src="/settings.svg"
                alt="Settings"
                width={20}
                height={20}
              />
            </span>
            <span>Settings</span>
          </button>
        </Link>
        <ActiveCampaigns />

        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center gap-4 rounded-[12px] border border-[#D5D7DA] p-3">
            <div className="relative h-10 w-10 rounded-full bg-slate-200">
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#16A34A]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold leading-5 text-slate-900">
                {user?.name || "User name"}
              </span>
              <span className="text-sm font-normal leading-5 text-slate-600">
                {user?.email || "email@example.com"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-full items-center justify-center rounded-lg px-2 py-0.5 text-base leading-6 font-semibold text-red-600 hover:bg-red-50 border border-red-200"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {/* permanent sidebar on laptop screens only */}
      {!isCollapsed && (
        <div className="hidden lg:flex h-screen w-[296px] flex-col sticky top-0 flex-shrink-0">
          {sidebarContent}
        </div>
      )}
    </>
  );
}
