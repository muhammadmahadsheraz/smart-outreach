"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import IdealCustomer from "@/components/campaigns/IdealCustomer";
import Offer from "@/components/campaigns/Offer";
import ConfirmMessages from "@/components/campaigns/ConfirmMessages";
import Image from "next/image";

// ── Step Indicator ────────────────────────────────────────────────────────────
const STEPS = ["Your ideal customer", "Offer", "Confirm messages", "Automate"];
const STEP_TITLES = {
  0: { title: "Your ideal customer", description: "Tell me who would be your ideal client for this campaign." },
  1: { title: "Offer", description: "Tell me what product or services you want to sell in this campaign." },
  2: { title: "Confirm messages", description: "Review and confirm the messages we'll send." },
  3: { title: "Automate", description: "Set up automation for your campaign." },
};

function StepIndicator({ current = 0 }: { current?: number }) {
  return (
    <>
      {/* Mobile / md: vertical list */}
      <div className="flex flex-col lg:hidden">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={label} className="flex items-stretch gap-3 min-h-[56px]">
              <div className="flex flex-col items-center flex-shrink-0">
                {done ? (
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : active ? (
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl ring-2 ring-blue-300 ring-offset-2 ring-offset-white flex items-center justify-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-white rounded-2xl border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 bg-zinc-300 rounded-full" />
                  </div>
                )}
                {!isLast && <div className="w-0.5 flex-1 min-h-[16px] bg-gray-200" />}
              </div>
              <span className={`text-sm font-semibold font-['Plus_Jakarta_Sans'] pt-1.5 ${active ? "text-blue-700" : done ? "text-blue-500" : "text-gray-500"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* lg+: horizontal stepper */}
      <div className="hidden lg:block relative w-full py-2 overflow-hidden">
        <div
          className="absolute h-0.5 z-0"
          style={{
            top: 'calc(0.5rem + 16px)',
            left: `${100 / (2 * STEPS.length)}%`,
            right: `${100 / (2 * STEPS.length)}%`,
            background: '#e5e7eb',
          }}
        />
        <div
          className="relative z-10 grid w-full"
          style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}
        >
          {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={label} className="flex flex-col items-center gap-3 relative z-10 pt-1">
                {done ? (
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : active ? (
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl ring-2 ring-blue-300 ring-offset-2 ring-offset-white flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-white rounded-2xl border-2 border-gray-200 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-zinc-300 rounded-full" />
                  </div>
                )}
                <span className={`text-xs sm:text-sm font-semibold font-['Plus_Jakarta_Sans'] text-center leading-tight ${active ? "text-blue-700" : done ? "text-blue-500" : "text-gray-500"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NewCampaign() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 0: Your ideal customer
  const [country, setCountry] = useState("");
  const [jobTags, setJobTags] = useState<string[]>([]);
  const [jobInput, setJobInput] = useState("");
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");
  const [employees, setEmployees] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [prospectPage, setProspectPage] = useState(1);
  const [prospects, setProspects] = useState<any[]>([]);

  // Step 1: Offer
  const [product, setProduct] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [successStories, setSuccessStories] = useState("");
  const [competitorDifference, setCompetitorDifference] = useState("");

  // Step 2: Confirm Messages
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [emails, setEmails] = useState<Array<{ id: string; subject: string; body: string }>>([]);

  // Handle OAuth callback — Gmail redirects back here after connecting
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gmail") === "connected") {
      window.history.replaceState({}, "", "/campaigns/new");
    }
  }, []);

  const removeTag = (tag: string) => setJobTags(jobTags.filter((t) => t !== tag));
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && jobInput.trim()) {
      e.preventDefault();
      if (!jobTags.includes(jobInput.trim())) setJobTags([...jobTags, jobInput.trim()]);
      setJobInput("");
    }
  };

  const toggleProspect = (i: number) => {
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  const toggleAll = () => {
    setSelected(selected.size === 7 ? new Set() : new Set([0, 1, 2, 3, 4, 5, 6]));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        if (selected.size === 0) {
          alert("Please select at least one prospect before proceeding");
          return false;
        }
        return true;
      case 1:
        if (!product.trim()) {
          alert("Please fill in the product/service details before proceeding");
          return false;
        }
        return true;
      case 2:
        if (emails.length === 0) {
          alert("Please generate and save at least one email before proceeding");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const saveCampaign = async () => {
    if (!product || emails.length === 0 || selected.size === 0) {
      alert("Please complete all steps before saving");
      return;
    }

    try {
      // Extract selected prospect contacts with email data
      const selectedProspectContacts = Array.from(selected)
        .map(index => prospects[index])
        .filter(prospect => prospect && prospect.email)
        .map(prospect => ({
          id: prospect.id,
          email: prospect.email,
          name: prospect.name,
          company: prospect.company,
          role: prospect.role,
        }));

      if (selectedProspectContacts.length === 0) {
        throw new Error("No valid prospects selected with email addresses");
      }

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Campaign - ${new Date().toLocaleDateString()}`,
          country,
          jobTitles: jobTags.length > 0 ? jobTags : undefined,
          industry,
          keywords,
          employees,
          selectedProspects: Array.from(selected),
          selectedProspectContacts,
          product,
          targetCustomer,
          successStories,
          competitorDifference,
          subject: emails[0]?.subject || subject,
          messageBody: emails[0]?.body || messageBody,
          emailSequence: emails,
          sendTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to save campaign (${response.status})`);
      }

      if (data.success) {
        alert("Campaign saved successfully!");
        router.push("/campaigns");
      } else {
        throw new Error(data.error || "Campaign save failed");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Save campaign error:", errorMsg);
      alert(`Error saving campaign: ${errorMsg}`);
    }
  };

  const handleNavigate = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="flex bg-slate-50 font-sans min-h-screen overflow-x-hidden">
      <main className="flex w-full bg-white min-w-0">
        <Sidebar />

        <section className="flex flex-col w-full min-h-screen overflow-x-hidden min-w-0">
          <MobileHeader />

          <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-12 py-8 w-full max-w-full">

            {/* Top nav bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Link href="/campaigns" className="px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm flex items-center gap-1.5 text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-gray-50 transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to campaigns
              </Link>
              {currentStep === 0 && (
                <button className="px-3 py-2 bg-blue-700 rounded-lg text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-1.5 hover:bg-blue-800 transition-colors shadow-sm">
                  Add new prospects
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              )}
            </div>

            {/* Hero */}
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center shadow-sm">
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#1d4ed8" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-900 text-lg sm:text-xl font-semibold font-['Plus_Jakarta_Sans'] text-center max-w-md leading-7">
                Hi! I'm going to find prospects interested in your business.
              </p>
            </div>

            {/* Step indicator */}
            <StepIndicator current={currentStep} />

            {/* Step 0 */}
            {currentStep === 0 && (
              <IdealCustomer
                country={country}
                setCountry={setCountry}
                jobTags={jobTags}
                setJobTags={setJobTags}
                jobInput={jobInput}
                setJobInput={setJobInput}
                industry={industry}
                setIndustry={setIndustry}
                keywords={keywords}
                setKeywords={setKeywords}
                employees={employees}
                setEmployees={setEmployees}
                selected={selected}
                setSelected={setSelected}
                prospectPage={prospectPage}
                setProspectPage={setProspectPage}
                removeTag={removeTag}
                addTag={addTag}
                toggleProspect={toggleProspect}
                toggleAll={toggleAll}
                currentStep={currentStep}
                onPrevious={() => setCurrentStep(currentStep - 1)}
                onNext={handleNextStep}
                stepTitles={STEP_TITLES}
                setProspectsList={setProspects}
                prospects={prospects}
              />
            )}

            {/* Step 1 */}
            {currentStep === 1 && (
              <Offer
                product={product}
                setProduct={setProduct}
                targetCustomer={targetCustomer}
                setTargetCustomer={setTargetCustomer}
                successStories={successStories}
                setSuccessStories={setSuccessStories}
                competitorDifference={competitorDifference}
                setCompetitorDifference={setCompetitorDifference}
                currentStep={currentStep}
                onPrevious={() => setCurrentStep(currentStep - 1)}
                onNext={handleNextStep}
                stepTitles={STEP_TITLES}
              />
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <ConfirmMessages
                subject={subject}
                setSubject={setSubject}
                messageBody={messageBody}
                setMessageBody={setMessageBody}
                product={product}
                targetCustomer={targetCustomer}
                successStories={successStories}
                competitorDifference={competitorDifference}
                emails={emails}
                setEmails={setEmails}
                currentStep={currentStep}
                onPrevious={() => setCurrentStep(currentStep - 1)}
                onNext={() => handleNavigate(currentStep + 1)}
                stepTitles={STEP_TITLES}
                selectedProspects={Array.from(selected)
                  .map(index => prospects[index])
                  .filter(p => p && p.email)}
              />
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-12 w-full">
                <IdealCustomer
                  country={country}
                  setCountry={setCountry}
                  jobTags={jobTags}
                  setJobTags={setJobTags}
                  jobInput={jobInput}
                  setJobInput={setJobInput}
                  industry={industry}
                  setIndustry={setIndustry}
                  keywords={keywords}
                  setKeywords={setKeywords}
                  employees={employees}
                  setEmployees={setEmployees}
                  selected={selected}
                  setSelected={setSelected}
                  prospectPage={prospectPage}
                  setProspectPage={setProspectPage}
                  removeTag={removeTag}
                  addTag={addTag}
                  toggleProspect={toggleProspect}
                  toggleAll={toggleAll}
                  currentStep={3}
                  onPrevious={() => setCurrentStep(0)}
                  onNext={() => setCurrentStep(0)}
                  stepTitles={STEP_TITLES}
                  prospects={prospects}
                  setProspectsList={setProspects}
                />
                <Offer
                  product={product}
                  setProduct={setProduct}
                  targetCustomer={targetCustomer}
                  setTargetCustomer={setTargetCustomer}
                  successStories={successStories}
                  setSuccessStories={setSuccessStories}
                  competitorDifference={competitorDifference}
                  setCompetitorDifference={setCompetitorDifference}
                  currentStep={3}
                  onPrevious={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(1)}
                  stepTitles={STEP_TITLES}
                />
                <ConfirmMessages
                  subject={subject}
                  setSubject={setSubject}
                  messageBody={messageBody}
                  setMessageBody={setMessageBody}
                  product={product}
                  targetCustomer={targetCustomer}
                  successStories={successStories}
                  competitorDifference={competitorDifference}
                  emails={emails}
                  setEmails={setEmails}
                  currentStep={3}
                  onPrevious={() => setCurrentStep(2)}
                  onNext={() => setCurrentStep(2)}
                  stepTitles={STEP_TITLES}
                  selectedProspects={Array.from(selected)
                    .map(index => prospects[index])
                    .filter(p => p && p.email)}
                />
                <div className="self-stretch p-5 sm:p-6 bg-blue-300 rounded-xl flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-gray-800 text-xl sm:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                        Confirm
                      </div>
                      <div className="text-gray-700 text-sm sm:text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
                        Review everything above and start your campaign.
                      </div>
                    </div>
                    <button
                      onClick={saveCampaign}
                      className="w-full sm:w-auto px-4 py-2.5 bg-white rounded-lg shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-400 flex justify-center items-center gap-2 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-blue-800 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                        Start campaign
                      </span>
                      <div className="w-5 h-5 relative overflow-hidden shrink-0">
                        <Image src="/icons/campaign_blue_icon.svg" alt="Arrow right" fill className="object-contain" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
