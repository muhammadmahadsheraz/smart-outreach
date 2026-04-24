"use client";
import React from "react";
import Image from "next/image";
interface OfferProps {
  product: string;
  setProduct: (value: string) => void;
  targetCustomer: string;
  setTargetCustomer: (value: string) => void;
  successStories: string;
  setSuccessStories: (value: string) => void;
  competitorDifference: string;
  setCompetitorDifference: (value: string) => void;
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  stepTitles: { [key: number]: { title: string; description: string } };
}

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
      <label className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5 sm:w-64 sm:max-w-[240px] sm:shrink-0 pt-2">
        {label}
      </label>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default function Offer({
  product,
  setProduct,
  targetCustomer,
  setTargetCustomer,
  successStories,
  setSuccessStories,
  competitorDifference,
  setCompetitorDifference,
  currentStep,
  onPrevious,
  onNext,
  stepTitles,
}: OfferProps) {
  const inputClass =
    "w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm text-gray-700 text-sm font-['Plus_Jakarta_Sans'] placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300 transition";

  const textareaClass =
    "w-full px-3.5 py-3 bg-white rounded-lg border border-zinc-300 shadow-sm text-gray-700 text-sm font-['Plus_Jakarta_Sans'] placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300 transition resize-y min-h-[80px]";

  return (
    <div className="w-full flex flex-col gap-8 lg:px-8">
      {/* Divider */}
      <div className="w-full">
        <div className="h-px bg-blue-200 w-full" />
      </div>

      {/* Main content */}
      <div className="w-full flex flex-col gap-8">

        {/* Section header + nav */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h2 className="text-gray-900 text-xl sm:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
              {stepTitles[currentStep]?.title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-['Plus_Jakarta_Sans'] leading-6">
              {stepTitles[currentStep]?.description}
            </p>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {currentStep === 3 ? (
              <button
                onClick={onPrevious}
                className="px-3 py-2 bg-blue-700 rounded-lg text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-colors shadow-sm"
              >
                Edit
                    <Image src="/icons/edit_icon.svg" alt="Edit" height = {4} width= {4} className = "w-[15px] h-[15px]" />
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

        {/* Form fields */}
        <div className="flex flex-col gap-6 pb-12">

          <FieldRow label="What product or service do you want to sell in this campaign?">
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Enter product or service"
              className={inputClass}
            />
          </FieldRow>

          <div className="h-px bg-gray-100" />

          <FieldRow label="What is your target customer?">
            <input
              type="text"
              value={targetCustomer}
              onChange={(e) => setTargetCustomer(e.target.value)}
              placeholder="Describe your target customer"
              className={inputClass}
            />
          </FieldRow>

          <div className="h-px bg-gray-100" />

          <FieldRow label="Do you have any success stories for this product/service?">
            <textarea
              value={successStories}
              onChange={(e) => setSuccessStories(e.target.value)}
              placeholder="Share success stories or case studies"
              className={textareaClass}
            />
          </FieldRow>

          <div className="h-px bg-gray-100" />

          <FieldRow label="Why should they choose your company over your competitors?">
            <textarea
              value={competitorDifference}
              onChange={(e) => setCompetitorDifference(e.target.value)}
              placeholder="Explain your competitive advantage"
              className={textareaClass}
            />
          </FieldRow>

        </div>
      </div>
    </div>
  );
}