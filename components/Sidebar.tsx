"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <section className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
      <div className="flex w-full flex-col px-5 gap-5 py-5">
        <div className="flex w-full items-center justify-between">
          <Image
            src="/logo.svg"
            alt="Ateni"
            width={142}
            height={28}
            priority
          />
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5D7DA] p-2">
            <Image
              src="/chevron-left-double.svg"
              alt="Expand navigation"
              width={20}
              height={20}
            />
          </div>
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
          { label: "Home", icon: "home", href: "/" },
          { label: "Margot training", icon: "margot_training", href: "/margot_training" },
          { label: "Campaigns", icon: "campaigns", href: "/campaigns" },
          { label: "Inbox", icon: "inbox", href: "/inbox" },
          { label: "Reports", icon: "reports", href: "/reports" },
        ].map((item, index) => (
          <Link key={item.label} href={item.href}>
            <button
              type="button"
              className={`flex h-11 w-full items-center rounded-lg px-2 py-0.5 gap-2 text-base leading-6 font-semibold ${
                index === 0
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
        ))}
      </div>

      <div className="flex w-full flex-col px-4 pb-6 pt-4 gap-4 mt-auto">
        <button
          type="button"
          className="flex h-11 w-full items-center gap-2 rounded-lg px-2 py-0.5 text-base leading-6 font-semibold text-slate-700 hover:bg-slate-50"
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
        <div className="flex w-full flex-col rounded-[12px] border border-[#D5D7DA] p-4 gap-4">
          <h3 className="text-sm font-semibold leading-5 text-slate-900">
            Active campaigns
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { color: "#3A88FD", label: "Smart Shopping" },
              { color: "#7A5AF8", label: "Conscious Consumption" },
              { color: "#EE46BC", label: "Go Further" },
            ].map((item) => (
              <div
                key={item.color}
                className="flex w-full items-center gap-2"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium leading-5 text-slate-700">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium leading-5 text-[#013F9D]"
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
        </div>

        <div className="flex w-full items-center gap-4 rounded-[12px] border border-[#D5D7DA] p-3">
          <div className="relative h-10 w-10 rounded-full bg-slate-200">
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#16A34A]" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold leading-5 text-slate-900">
              User name
            </span>
            <span className="text-sm font-normal leading-5 text-slate-600">
              loremipsum@gmail.com
            </span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {/* mobile header */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4">
          <Image
            src="/logo.svg"
            alt="Ateni"
            width={142}
            height={28}
            priority
          />
          <button
            type="button"
            className="p-2 bg-white rounded-lg"
            data-opened={open}
            aria-expanded={open}
            aria-controls="sidebar-panel"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="w-6 h-6 relative">
              <div className="absolute top-1 h-0.5 w-full bg-gray-700"></div>
              <div className="absolute top-1/2 h-0.5 w-full bg-gray-700"></div>
              <div className="absolute bottom-1 h-0.5 w-full bg-gray-700"></div>
            </div>
          </button>
        </div>
      </div>

      {/* backdrop when open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => setOpen(false)}
        />
      )}

      {/* sliding panel for small screens */}
      <div
        id="sidebar-panel"
        className={`fixed inset-y-0 left-0 z-50 w-[296px] max-w-full transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* permanent sidebar on md+ */}
      <div className="hidden md:flex h-[960px] w-[296px] flex-col">
        {sidebarContent}
      </div>
    </>
  );
}
