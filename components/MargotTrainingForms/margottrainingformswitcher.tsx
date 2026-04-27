"use client";
import CompanyDetails from "../../components/MargotTrainingForms/CompanyDetails";
import ProductsDetails from "../../components/MargotTrainingForms/ProductsDetails";
import ClientsDetails from "../../components/MargotTrainingForms/ClientDetails";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const tabs = [
  { id: "company", label: "Your company" },
  { id: "clients", label: "Your clients" },
  { id: "products", label: "Products/Services offered" },
];

export default function MargotTrainingFormSwitcher() {
  const [activeBtn, setActiveBtn] = useState("company");

  const activeLabel = tabs.find((t) => t.id === activeBtn)?.label;

  return (
    <div className="pt-8 sm:pt-12 flex flex-col gap-8 sm:gap-12">

      {/* Mobile/MD: Dropdown */}
      <div className="lg:hidden relative">
        <select
          value={activeBtn}
          onChange={(e) => setActiveBtn(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 font-['Plus_Jakarta_Sans'] shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
        >
          {tabs.map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 pointer-events-none" />
      </div>

      {/* LG+: Pill tab switcher */}
      <div className="hidden lg:flex self-stretch bg-neutral-50 rounded-lg border border-gray-200 flex-row justify-center items-stretch gap-0.5 p-0.5">
        {tabs.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => setActiveBtn(id)}
            className={`flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden cursor-pointer transition-all
              ${activeBtn === id
                ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-gray-300"
                : "hover:text-gray-700"
              }`}
          >
            <span className={`text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5 ${activeBtn === id ? "text-gray-700" : "text-gray-500"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {activeBtn === "company" && <CompanyDetails />}
      {activeBtn === "clients" && <ClientsDetails />}
      {activeBtn === "products" && <ProductsDetails />}
    </div>
  );
}