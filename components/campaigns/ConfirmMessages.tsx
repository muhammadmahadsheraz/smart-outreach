"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ConfirmMessagesProps {
  subject: string;
  setSubject: (value: string) => void;
  messageBody: string;
  setMessageBody: (value: string) => void;
  product: string;
  targetCustomer: string;
  successStories: string;
  competitorDifference: string;
  emails: Array<{ id: string; subject: string; body: string }>;
  setEmails: (emails: Array<{ id: string; subject: string; body: string }>) => void;
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  stepTitles: { [key: number]: { title: string; description: string } };
  selectedProspects?: Array<{ id?: number; email: string; name?: string; company?: string; role?: string }>;
}

interface MargotData {
  company?: { companyName: string; website: string; description: string };
  client?: { niches: string[]; location: string; decisionMakers?: string[]; targetCompanies?: string[] };
  product?: { product: string; edge: string; successStories: string };
}

interface Email {
  id: string;
  subject: string;
  body: string;
  delay?: string;
}

const GEMINI_API_KEY = "AIzaSyDHhZcghUIeOBspIVVz7EqaJDy05c20o5c";

async function generateEmailWithGemini(
  offerData: {
    product: string;
    targetCustomer: string;
    successStories: string;
    competitorDifference: string;
  },
  emailNumber: number = 1,
  margotData?: MargotData
): Promise<{ subject: string; body: string }> {
  try {
    let prompt = "";
    
    // Build additional context from Margot training data
    let margotContext = "";
    if (margotData) {
      if (margotData.company) {
        margotContext += `\nOur Company: ${margotData.company.companyName} (${margotData.company.website})\n${margotData.company.description}`;
      }
      if (margotData.client) {
        margotContext += `\nTarget Niches: ${margotData.client.niches?.join(", ")}`;
        margotContext += `\nTarget Location: ${margotData.client.location}`;
        if (margotData.client.decisionMakers?.length) {
          margotContext += `\nDecision Maker Roles: ${margotData.client.decisionMakers.join(", ")}`;
        }
        if (margotData.client.targetCompanies?.length) {
          margotContext += `\nTarget Companies: ${margotData.client.targetCompanies.join(", ")}`;
        }
      }
    }
    
    if (emailNumber === 1) {
      // Initial email
      prompt = `You are an expert email copywriter. Write a professional sales email to a prospect.${margotContext}

IMPORTANT: Use these placeholders to personalize the email:
- {{PROSPECT_NAME}} - the prospect's name
- {{COMPANY_NAME}} - the prospect's company name
- {{PROSPECT_ROLE}} - the prospect's job role

What you are selling (the product/service):
${offerData.product}

Who should want it (ideal customer profile):
${offerData.targetCustomer}

Success/Results achieved by existing customers:
${offerData.successStories}

Why it's better than competitors:
${offerData.competitorDifference}

Create an engaging email with:
- A subject line (max 50 chars)
- 2-3 paragraphs of body text (150-250 words)
- Use the {{PLACEHOLDER}} names to personalize it for {{PROSPECT_NAME}} at {{COMPANY_NAME}}
- Focus on value and how it helps their business
- Include a clear call to action

Respond in JSON format: {"subject": "...", "body": "..."}`;
    } else if (emailNumber === 2) {
      // First follow-up email
      prompt = `You are an expert email copywriter. Write a professional FIRST FOLLOW-UP email (not repeating the first email).${margotContext}

IMPORTANT: Use these placeholders to personalize the email:
- {{PROSPECT_NAME}} - the prospect's name
- {{COMPANY_NAME}} - the prospect's company name
- {{PROSPECT_ROLE}} - the prospect's job role

What you are selling (the product/service):
${offerData.product}

Who should want it (ideal customer profile):
${offerData.targetCustomer}

Success/Results achieved by existing customers:
${offerData.successStories}

Why it's better than competitors:
${offerData.competitorDifference}

This is a FOLLOW-UP email. Create an engaging follow-up with:
- A new subject line (max 50 chars) that references previous contact
- 2-3 paragraphs of body text (150-250 words)
- Use {{PROSPECT_NAME}} and {{COMPANY_NAME}} for personalization
- Add social proof or case study relevant to {{PROSPECT_ROLE}}
- Different angle/approach from the first email
- Include a clear call to action

Respond in JSON format: {"subject": "...", "body": "..."}`;
    } else if (emailNumber === 3) {
      // Second follow-up email
      prompt = `You are an expert email copywriter. Write a professional SECOND FOLLOW-UP email (different from previous two).${margotContext}

IMPORTANT: Use these placeholders to personalize the email:
- {{PROSPECT_NAME}} - the prospect's name
- {{COMPANY_NAME}} - the prospect's company name
- {{PROSPECT_ROLE}} - the prospect's job role

What you are selling (the product/service):
${offerData.product}

Who should want it (ideal customer profile):
${offerData.targetCustomer}

Success/Results achieved by existing customers:
${offerData.successStories}

Why it's better than competitors:
${offerData.competitorDifference}

This is a FINAL FOLLOW-UP email. Create a compelling closing email with:
- A subject line (max 50 chars) that conveys this is important/timely
- 2-3 paragraphs of body text (150-250 words)
- Use {{PROSPECT_NAME}} and {{COMPANY_NAME}} for personalization
- Focus on ROI and concrete business benefits for {{PROSPECT_ROLE}}
- Show urgency but professional tone
- Strong closing call to action

Respond in JSON format: {"subject": "...", "body": "..."}`;
    }

    console.log("Calling Gemini API for email #" + emailNumber);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const responseText = await response.text();
    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating email:", error);
    throw error;
  }
}

export default function ConfirmMessages({
  subject,
  setSubject,
  messageBody,
  setMessageBody,
  product,
  targetCustomer,
  successStories,
  competitorDifference,
  emails,
  setEmails,
  currentStep,
  onPrevious,
  onNext,
  stepTitles,
  selectedProspects,
}: ConfirmMessagesProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [openPanel, setOpenPanel] = useState<"sequence" | "editor">("sequence");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingEmailNumber, setGeneratingEmailNumber] = useState(1);
  const [margotData, setMargotData] = useState<MargotData | null>(null);

  // Fetch Margot training data on mount
  useEffect(() => {
    const fetchMargotData = async () => {
      try {
        const [companyRes, clientRes, productRes] = await Promise.all([
          fetch("/api/margot/company"),
          fetch("/api/margot/client"),
          fetch("/api/margot/product"),
        ]);

        const companyData = companyRes.ok ? await companyRes.json() : null;
        const clientData = clientRes.ok ? await clientRes.json() : null;
        const productData = productRes.ok ? await productRes.json() : null;

        setMargotData({
          company: companyData?.ok ? companyData.data : undefined,
          client: clientData?.ok ? clientData.data : undefined,
          product: productData?.ok ? productData.data : undefined,
        });
      } catch (err) {
        console.error("Failed to fetch Margot data:", err);
      }
    };

    if (currentStep === 2) {
      fetchMargotData();
    }
  }, [currentStep]);

  const isAutomate = currentStep === 3;
  const maxEmails = 3;
  const hasMaxEmails = emails.length >= maxEmails;

  // Generate initial email when component mounts or offer data changes (only when on step 2)
  useEffect(() => {
    if (currentStep === 2 && product && emails.length === 0) {
      generateEmailForNumber(1);
    }
  }, [product, targetCustomer, successStories, competitorDifference, currentStep]);

  const generateEmailForNumber = async (emailNum: number) => {
    if (!product) {
      setError("Please fill in the offer details first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const generated = await generateEmailWithGemini(
        {
          product,
          targetCustomer,
          successStories,
          competitorDifference,
        },
        emailNum,
        margotData || undefined
      );

      setSubject(generated.subject);
      setMessageBody(generated.body);
      setGeneratingEmailNumber(emailNum);
    } catch (err) {
      setError("Failed to generate email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!subject.trim() || !messageBody.trim()) {
      alert("Please fill in subject and body");
      return;
    }

    // Save current email
    const newEmail = {
      id: String(emails.length + 1),
      subject: subject,
      body: messageBody,
    };
    const updatedEmails = [...emails, newEmail];
    setEmails(updatedEmails);

    // Clear form
    setSubject("");
    setMessageBody("");

    // If we haven't reached max emails, generate the next one
    if (updatedEmails.length < maxEmails) {
      setTimeout(() => {
        generateEmailForNumber(updatedEmails.length + 1);
      }, 500);
    } else {
      // Max emails reached - clear the display to indicate no more emails
      setLoading(false);
    }
  };

  const currentEmail = emails[pageIndex];
  const totalPages = emails.length;

  // Personalize email with first prospect details
  const personalizeEmail = (text: string): string => {
    if (!selectedProspects || selectedProspects.length === 0) return text;
    
    const prospect = selectedProspects[0];
    return text
      .replace(/\{\{PROSPECT_NAME\}\}/g, prospect.name || "there")
      .replace(/\{\{COMPANY_NAME\}\}/g, prospect.company || "your company")
      .replace(/\{\{PROSPECT_ROLE\}\}/g, prospect.role || "leader");
  };

  return (
    <div className="w-full flex flex-col gap-8 lg:px-8">
      {/* Divider */}
      <div className="w-full">
        <div className="h-px bg-blue-200 w-full" />
      </div>

      {/* Mobile tab switcher — only shown when editor panel is available */}
      {!isAutomate && (
        <div className="flex lg:hidden bg-neutral-50 rounded-lg border border-gray-200 p-1 gap-1">
          {(["sequence", "editor"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setOpenPanel(tab)}
              className={`flex-1 py-2 rounded-md text-sm font-semibold font-['Plus_Jakarta_Sans'] transition-colors capitalize ${
                openPanel === tab
                  ? "bg-white shadow-sm border border-zinc-300 text-gray-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "sequence" ? "Sequence" : "Editor"}
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium font-['Plus_Jakarta_Sans']">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium font-['Plus_Jakarta_Sans'] text-center">
          Generating email with AI...
        </div>
      )}

      {/* Main content */}
      <div className="w-full">
        {/* Header with navigation (shown when on final stage) */}
        {isAutomate && (
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <h2 className="text-gray-900 text-xl sm:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
              {stepTitles[currentStep]?.title}
            </h2>
            <button
              onClick={onPrevious}
              className="px-3 py-2 bg-blue-700 rounded-lg text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-colors shadow-sm"
            >
              Edit
              <Image src="/icons/edit_icon.svg" alt="Edit" height={16} width={16} className="w-[15px] h-[15px]" />
            </button>
          </div>
        )}

        <div className={`flex flex-col ${isAutomate ? "" : "lg:flex-row"} gap-8`}>

          {/* ── LEFT: Email sequence ── */}
          <div
            className={`
              flex flex-col gap-6 min-w-0
              ${isAutomate ? "w-full" : "flex-1 lg:border-r lg:border-gray-200 lg:pr-10"}
              ${!isAutomate && openPanel !== "sequence" ? "hidden lg:flex" : "flex"}
            `}
          >
            {/* Section header */}
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-900 text-xl sm:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                Sequence
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-['Plus_Jakarta_Sans'] leading-6">
                {emails.length === 0 ? "Generate your first email to get started" : "Review the email sequence that will be sent to prospects."}
              </p>
            </div>

            {/* Email cards */}
            {emails.length > 0 && currentEmail ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <div className="w-full px-4 pt-4 pb-5 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
                    {/* Card header */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 text-base sm:text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                        Email {pageIndex + 1}
                      </span>
                      <button className="flex items-center justify-center px-3 py-1.5 gap-1.5 bg-white rounded-lg border border-zinc-300 shadow-sm text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-gray-50 transition-colors">
                        <div>Open</div>
                        <Image className="w-[20px] h-[20px]" src="/icons/expand_icon.svg" height={12} width={12} alt="" />
                      </button>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex flex-col gap-1.5">
                      <p className="text-gray-900 text-base font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                        {currentEmail.subject}
                      </p>
                      <p className="text-gray-600 text-sm font-['Plus_Jakarta_Sans'] leading-5 line-clamp-2">
                        {currentEmail.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full px-4 py-8 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500 text-sm font-['Plus_Jakarta_Sans']">
                {loading ? "Generating email..." : "No email generated yet"}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-700 text-sm font-medium font-['Plus_Jakarta_Sans']">
                  Page {pageIndex + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                    className="px-3 py-2 rounded-lg text-sm font-semibold font-['Plus_Jakarta_Sans'] bg-white border border-gray-200 disabled:text-zinc-300 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPageIndex(Math.min(totalPages - 1, pageIndex + 1))}
                    disabled={pageIndex === totalPages - 1}
                    className="px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-gray-50 disabled:text-zinc-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Message editor ── */}
          {!isAutomate && (
            <div
              className={`
                flex-1 flex flex-col gap-6 min-w-0
                ${openPanel !== "editor" ? "hidden lg:flex" : "flex"}
              `}
            >
              {/* Show message when max emails reached */}
              {hasMaxEmails ? (
                <div className="w-full px-6 py-12 bg-blue-50 rounded-xl border border-blue-200 flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0254CF" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-gray-900 text-lg font-semibold font-['Plus_Jakarta_Sans']">
                      Email sequence complete!
                    </h3>
                    <p className="text-gray-600 text-sm font-['Plus_Jakarta_Sans']">
                      You've created the maximum of 3 emails (1 initial + 2 follow-ups) for this campaign.
                    </p>
                  </div>
                  <div className="text-blue-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                    <span>📧 Ready to send</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Editor header */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h2 className="text-gray-900 text-xl sm:text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
                      {stepTitles[currentStep]?.title}
                    </h2>
                    {!hasMaxEmails && (
                      <div className="flex items-center gap-3">
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
                      </div>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <label className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] sm:w-24 shrink-0">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject…"
                      className="flex-1 px-3 py-2 bg-white rounded-lg border border-zinc-300 shadow-sm text-gray-700 text-sm font-['Plus_Jakarta_Sans'] placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300 transition"
                    />
                  </div>

                  {/* Message body */}
                  <div className="flex flex-col gap-3 flex-1">
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder="Message body…"
                      rows={10}
                      className="w-full px-3.5 py-3 bg-white rounded-lg border border-zinc-300 shadow-sm text-gray-700 text-sm font-['Plus_Jakarta_Sans'] placeholder-gray-400 resize-y outline-none focus:ring-2 focus:ring-blue-300 transition min-h-[200px]"
                    />

                    {/* Toolbar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Bold */}
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Bold">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z" />
                        </svg>
                      </button>
                      {/* Italic */}
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Italic">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 4h-9M14 20H5M15 4L9 20" />
                        </svg>
                      </button>
                      {/* Link */}
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Insert link">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </button>
                      {/* Variable */}
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Insert variable">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </button>

                      <button 
                        onClick={handleSaveEmail}
                        disabled={loading}
                        className={`ml-auto px-4 py-2 rounded-lg text-sm font-semibold font-['Plus_Jakarta_Sans'] transition-colors shadow-sm ${
                          loading
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-700 text-white hover:bg-blue-800"
                        }`}>
                        {loading ? `Generating Email ${emails.length + 1}...` : `Save Email ${emails.length + 1}`}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}