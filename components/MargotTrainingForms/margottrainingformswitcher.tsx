"use client";
import CompanyDetails from "../../components/MargotTrainingForms/CompanyDetails";
import ProductsDetails from "../../components/MargotTrainingForms/ProductsDetails";
import ClientsDetails from "../../components/MargotTrainingForms/ClientDetails";

import {useState, useRef} from "react";

export default function MargotTrainingFormSwitcher() {

  const [activeBtn, setActiveBtn] = useState("company");
  const companyRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  return (

      <div className = "pt-12 flex flex-col gap-12">
      <div className="self-stretch bg-neutral-50 rounded-lg border border-1 border-offset-[-1px] border-gray-200 inline-flex justify-center items-center gap-0.5">
      <div
        ref={companyRef}
        onClick={() => setActiveBtn("company")}
        className={`flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden ${activeBtn === "company" ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-1 border-offset-[-1px] border-gray-300" : "text-gray-500"}`}
      >
        <div className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          Your company
        </div>
      </div>
      <div
        ref={clientsRef}
        onClick={() => setActiveBtn("clients")}
        className={`flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden ${activeBtn === "clients" ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-1 border-offset-[-1px] border-gray-300" : "text-gray-500"}`}
      >
        <div className="text-gray-500 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          Your clients
        </div>
      </div>
      <div
        ref={productsRef}
        onClick={() => setActiveBtn("products")}
        className={`flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden ${activeBtn === "products" ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-1 border-offset-[-1px] border-gray-300" : "text-gray-500"}`}
      >
        <div className="text-gray-500 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          Products/Services offered
        </div>
      </div>
    </div>
    {activeBtn === "company" && <CompanyDetails />}
    {activeBtn === "clients" && <ClientsDetails />}
    {activeBtn === "products" && <ProductsDetails />}

      </div>
  );
}

