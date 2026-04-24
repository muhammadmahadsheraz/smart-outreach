"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

interface InboxEmail {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  date: string;
  tag?: {
    name: string;
    color: string;
    icon: string;
  };
  isRead: boolean;
}

interface EmailDetail extends InboxEmail {
  body: string;
  from: string;
  to: string;
  timestamp: string;
}

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<"primary" | "others">("primary");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{ name: string; color: string; icon: string } | null>(null);
  const [emailList, setEmailList] = useState<EmailDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Reset reply state when email selection changes
  useEffect(() => {
    setIsReplying(false);
    setReplyText("");
  }, [selectedEmailId]);

  const tagOptions = [
    { name: "Lead", color: "emerald", icon: "/icons/green_zap.svg" },
    { name: "Meeting booked", color: "sky", icon: "/icons/blue_zap.svg" },
    { name: "Possible", color: "amber", icon: "/icons/yellow_zap.svg" },
    { name: "Not interested", color: "rose", icon: "/icons/red_zap.svg" },
    { name: "Wrong person", color: "slate", icon: "/icons/black_zap.svg" },
  ];

  const mapBackendTag = (tag: string) => {
    switch (tag) {
      case "lead": return tagOptions[0];
      case "meeting_booked": return tagOptions[1];
      case "possible": return tagOptions[2];
      case "not_interested": return tagOptions[3];
      case "wrong_person": return tagOptions[4];
      default: return undefined;
    }
  };

  // Check Gmail connection status + fetch emails on load
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // Check Gmail status
        const statusRes = await fetch("/api/gmail/status");
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.ok && statusData.connected) {
            setGmailConnected(true);
            setGmailEmail(statusData.email);
          }
        }

        // Fetch emails
        const response = await fetch("/api/inbox");
        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.messages) {
            const mappedMessages = data.messages.map((m: any) => ({
              ...m,
              tag: m.tag ? mapBackendTag(m.tag) : undefined
            }));
            setEmailList(mappedMessages);
            if (mappedMessages.length > 0 && window.innerWidth >= 640) {
              setSelectedEmailId(mappedMessages[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing inbox:", error);
      } finally {
        setLoading(false);
      }
    };

    // Handle OAuth callback redirect params
    const params = new URLSearchParams(window.location.search);
    if (params.get("gmail") === "connected") {
      setGmailConnected(true);
      // Clean URL
      window.history.replaceState({}, "", "/inbox");
    }

    init();
  }, []);

  // Update selectedTag when email selection changes
  useEffect(() => {
    if (selectedEmailId) {
      const email = emailList.find((e) => e.id === selectedEmailId);
      if (email?.tag) {
        setSelectedTag(email.tag);
      } else {
        setSelectedTag(null);
      }
    }
  }, [selectedEmailId, emailList]);

  // Connect Gmail via OAuth2
  const handleConnectGmail = async () => {
    try {
      setConnecting(true);
      const response = await fetch("/api/gmail/auth-url");
      if (!response.ok) {
        console.error("Failed to get auth URL");
        return;
      }

      const data = await response.json();
      if (data.ok && data.url) {
        // Redirect to Google consent screen
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error connecting Gmail:", error);
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect Gmail
  const handleDisconnectGmail = async () => {
    try {
      const response = await fetch("/api/gmail/disconnect", { method: "DELETE" });
      if (response.ok) {
        setGmailConnected(false);
        setGmailEmail(null);
      }
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
    }
  };

  // Sync emails via Gmail API
  const handleSyncMail = async () => {
    if (!gmailConnected) {
      handleConnectGmail();
      return;
    }

    try {
      setSyncing(true);

      const response = await fetch("/api/gmail/sync");
      const data = await response.json();

      if (!response.ok) {
        console.error("Sync failed:", data.error);
        // If Gmail auth expired, reset connection state
        if (data.error?.includes("reconnect") || data.error?.includes("expired")) {
          setGmailConnected(false);
          setGmailEmail(null);
        }
        return;
      }

      console.log(`✅ Synced ${data.synced} new messages`);

      // Re-fetch emails after syncing
      const inboxResponse = await fetch("/api/inbox");
      if (inboxResponse.ok) {
        const inboxData = await inboxResponse.json();
        if (inboxData.ok && inboxData.messages) {
          const mappedMessages = inboxData.messages.map((m: any) => ({
            ...m,
            tag: m.tag ? mapBackendTag(m.tag) : undefined
          }));
          setEmailList(mappedMessages);
        }
      }
    } catch (error) {
      console.error("Error syncing mail:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedEmailId || !replyText.trim()) return;

    try {
      setSendingReply(true);
      const response = await fetch(`/api/inbox/${selectedEmailId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: replyText }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Reply sent successfully! ✅");
        setIsReplying(false);
        setReplyText("");
      } else {
        alert(`Failed to send reply: ${data.error} ❌`);
      }
    } catch (error: any) {
      console.error("Error sending reply:", error);
      alert("An error occurred while sending the reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const selectedEmail = emailList.find((e) => e.id === selectedEmailId) as EmailDetail | undefined;

  return (
    <div className="h-screen overflow-hidden flex bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        <section className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Mobile header */}
          <MobileHeader />

          <div className="flex flex-1 overflow-hidden relative">
            {/* Inbox List Sidebar */}
            <div className={`w-full sm:w-[350px] lg:w-[400px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden ${selectedEmailId ? 'hidden sm:flex' : 'flex'}`}>
              <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="w-full bg-white border-b border-gray-100 flex-shrink-0">
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        <h1 className="text-gray-900 text-lg font-semibold truncate shrink-0">
                          Inbox
                        </h1>
                        {gmailConnected && gmailEmail && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-200 min-w-0 overflow-hidden">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                            <span className="text-[10px] text-emerald-700 font-medium truncate">{gmailEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      {gmailConnected ? (
                        <>
                          <button
                            onClick={handleSyncMail}
                            disabled={syncing}
                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                          >
                            {syncing ? "Syncing..." : "Sync Mail"}
                          </button>
                          <button
                            onClick={handleDisconnectGmail}
                            className="px-2 py-1.5 bg-white text-gray-600 rounded-lg font-medium text-xs border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
                            title="Disconnect Gmail"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleConnectGmail}
                          disabled={connecting}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="whitespace-nowrap">{connecting ? "Connecting..." : "Connect Gmail"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="w-full px-4 pb-3 flex flex-col shrink-0">
                  <div className="w-full bg-neutral-50 rounded-lg border border-gray-200 flex p-0.5">
                    <button
                      onClick={() => setActiveTab("primary")}
                      className={`flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden font-semibold text-sm leading-5 transition-colors ${
                        activeTab === "primary"
                          ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-700"
                          : "text-gray-500 hover:text-gray-600"
                      }`}
                    >
                      Primary
                    </button>
                    <button
                      onClick={() => setActiveTab("others")}
                      className={`flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden font-semibold text-sm leading-5 transition-colors ${
                        activeTab === "others"
                          ? "bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-700"
                          : "text-gray-500 hover:text-gray-600"
                      }`}
                    >
                      Others
                    </button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="w-full px-4 pb-3 flex items-center gap-2 shrink-0">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSearchQuery(searchInput);
                        }
                      }}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 shadow-sm text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => setSearchQuery(searchInput)}
                    className="p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 flex justify-center items-center shrink-0 transition-colors active:bg-gray-100"
                  >
                    <img src="/icons/filter_icon.svg" alt="Filter" className="w-5 h-5" />
                  </button>
                </div>

                {/* Email List */}
                <div className="flex-1 flex flex-col justify-start items-start overflow-y-auto min-h-0">
                  {loading ? (
                    <div className="self-stretch p-4 text-center text-gray-500">Loading emails...</div>
                  ) : emailList.length === 0 ? (
                    <div className="self-stretch p-4 text-center text-gray-500">No emails yet. Click "Sync Mail" to import from Gmail.</div>
                  ) : emailList.filter(e => e.senderName.toLowerCase().startsWith(searchQuery.toLowerCase())).length === 0 ? (
                    <div className="self-stretch p-4 text-center text-gray-500">No matches found for "{searchQuery}"</div>
                  ) : (
                    emailList
                      .filter(e => e.senderName.toLowerCase().startsWith(searchQuery.toLowerCase()))
                      .map((email) => (
                      <button
                        key={email.id}
                        onClick={() => setSelectedEmailId(email.id)}
                        className={`self-stretch pl-3 pr-4 py-4 border-b border-gray-200 flex flex-col justify-start items-start gap-1 transition-colors hover:bg-gray-50 ${
                          selectedEmailId === email.id ? "bg-neutral-100" : ""
                        }`}
                      >
                        <div className="w-full flex justify-between items-start gap-3">
                          <div className="flex-1 flex items-center gap-2 min-w-0">
                            <div
                              className={`w-2 h-2 shrink-0 ${
                                email.isRead ? "opacity-0" : ""
                              } bg-blue-600 rounded-full`}
                            />
                            <div className="text-zinc-950 text-sm font-bold truncate">
                              {email.senderName}
                            </div>
                          </div>
                          <div className="shrink-0 text-gray-500 text-xs font-medium whitespace-nowrap pt-0.5">
                            {email.date}
                          </div>
                        </div>
                        <div className="self-stretch pl-5 flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                            <div className="justify-start text-gray-600 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-5">
                              {email.subject}
                            </div>
                            {email.tag && (
                              <div
                                className="h-6 px-2 py-0.5 rounded-full flex items-center gap-1.5 border"
                                style={{
                                  backgroundColor: 
                                    email.tag.color === "emerald" ? "rgba(236, 253, 245, 1)" :
                                    email.tag.color === "sky" ? "rgba(240, 249, 255, 1)" :
                                    email.tag.color === "amber" ? "rgba(255, 251, 235, 1)" :
                                    email.tag.color === "rose" ? "rgba(255, 241, 242, 1)" :
                                    "rgba(248, 250, 252, 1)",
                                  borderColor:
                                    email.tag.color === "emerald" ? "rgba(167, 243, 208, 0.5)" :
                                    email.tag.color === "sky" ? "rgba(186, 230, 253, 0.5)" :
                                    email.tag.color === "amber" ? "rgba(253, 230, 138, 0.5)" :
                                    email.tag.color === "rose" ? "rgba(254, 205, 211, 0.5)" :
                                    "rgba(226, 232, 240, 0.5)"
                                }}
                              >
                                <span 
                                  className="text-xs font-semibold"
                                  style={{
                                    color:
                                      email.tag.color === "emerald" ? "#065f46" :
                                      email.tag.color === "sky" ? "#075985" :
                                      email.tag.color === "amber" ? "#92400e" :
                                      email.tag.color === "rose" ? "#9f1239" :
                                      "#334155"
                                  }}
                                >
                                  {email.tag.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            {selectedEmail ? (
              <div className={`flex-1 flex flex-col min-w-0 bg-white overflow-hidden ${selectedEmailId ? 'flex' : 'hidden sm:flex'}`}>
                {/* Mobile Back Button */}
                <div className="sm:hidden px-4 py-2 bg-slate-50 border-b border-gray-200 flex items-center">
                  <button 
                    onClick={() => setSelectedEmailId(null)}
                    className="flex items-center gap-2 text-gray-600 font-medium text-sm"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Inbox
                  </button>
                </div>

                {/* Email Header */}
                <div className="flex-shrink-0 self-stretch bg-white border-b border-gray-200 flex flex-col justify-start items-start gap-5">
                  <div className="self-stretch px-6 pt-5 inline-flex justify-start items-start gap-4">
                    <div className="flex-1 flex justify-start items-center gap-3">
                      <div className="w-14 h-14 relative bg-neutral-100 rounded-[200px]">
                        <div className="w-14 h-14 left-0 top-0 absolute opacity-10 rounded-[200px] border-[0.75px] border-black" />
                        <div className="w-12 left-[4px] top-[14px] absolute text-center justify-start text-gray-600 text-lg font-semibold font-['Inter'] leading-7">
                          {selectedEmail.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="flex-1 inline-flex flex-col justify-start items-start">
                        <div className="self-stretch inline-flex justify-start items-center gap-2">
                          <div className="justify-start text-gray-900 text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                            {selectedEmail.senderEmail}
                          </div>
                        </div>
                        <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5 line-clamp-1">
                          {selectedEmail.senderName}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start items-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="w-48 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-300 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {selectedTag ? (
                              <>
                                <img src={selectedTag.icon} alt="" className="w-5 h-5 shrink-0" />
                                <span className="text-gray-900 text-sm font-semibold truncate">{selectedTag.name}</span>
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm">Select Status</span>
                            )}
                          </div>
                          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                              <path d="M1 1L5 5L9 1" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                          <div className="absolute top-full right-0 w-48 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                            {tagOptions.map((tag) => (
                              <button
                                key={tag.name}
                                onClick={async () => {
                                  if (!selectedEmailId) return;
                                  setDropdownOpen(false);
                                  
                                  // Map frontend name to backend enum
                                  const backendTag = tag.name.toLowerCase().replace(" ", "_");
                                  
                                  try {
                                    const res = await fetch(`/api/inbox/${selectedEmailId}/tag`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ tag: backendTag }),
                                    });
                                    
                                    if (res.ok) {
                                      // Update local list state
                                      setEmailList(prev => prev.map(e => 
                                        e.id === selectedEmailId 
                                          ? { ...e, tag: { name: tag.name, color: tag.color, icon: tag.icon } } 
                                          : e
                                      ));
                                      setSelectedTag(tag);
                                    }
                                  } catch (error) {
                                    console.error("Error updating tag:", error);
                                  }
                                }}
                                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                              >
                                <img src={tag.icon} alt="" className="w-5 h-5 shrink-0" />
                                <span className={`${selectedTag?.name === tag.name ? 'text-blue-700 font-semibold' : 'text-gray-700'} text-sm`}>
                                  {tag.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex justify-center items-center gap-1 overflow-hidden hover:bg-gray-50 transition-colors">
                        <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Archive
                        </div>
                      </button>
                      <button className="p-2 bg-white rounded-lg border border-gray-300 flex justify-center items-center hover:bg-gray-50 transition-colors">
                        <img src="/icons/dots_icon.svg" alt="More" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="self-stretch h-px bg-gray-200" />
                </div>
                {/* Email Body */}
                <div className="self-stretch flex-1 p-4 bg-sky-100 flex flex-col justify-start items-start gap-2.5 overflow-y-auto">
                  {isReplying ? (
                    <div className="self-stretch flex-1 px-6 pt-6 pb-3 bg-white rounded-xl flex flex-col justify-between items-start overflow-hidden">
                      <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch flex flex-col justify-start items-start gap-4">
                          <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-zinc-950 text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                              Reply
                            </div>
                            <button
                              onClick={() => setIsReplying(false)}
                              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-center items-center hover:bg-gray-50 transition-colors"
                            >
                              <div className="w-5 h-5 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M9 3L3 9M3 3L9 9" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </button>
                          </div>
                          
                          <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                            <div className="self-stretch inline-flex justify-start items-center gap-2">
                              <div className="justify-start text-zinc-950 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">From:</div>
                              <div className="pl-2 pr-2 py-0.5 bg-sky-50 rounded-2xl border border-blue-200 flex justify-start items-center gap-0.5">
                                <div className="text-blue-800 text-xs font-medium font-['Inter'] leading-4">{gmailEmail || "you@gmail.com"}</div>
                              </div>
                            </div>
                            <div className="self-stretch h-px bg-gray-200" />
                            <div className="self-stretch inline-flex justify-start items-center gap-2">
                              <div className="justify-start text-zinc-950 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">To:</div>
                              <div className="text-gray-600 text-sm">{selectedEmail.senderEmail}</div>
                            </div>
                            <div className="self-stretch h-px bg-gray-200" />
                            <div className="self-stretch inline-flex justify-start items-center gap-2">
                              <div className="justify-start text-zinc-950 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">Subject:</div>
                              <div className="justify-start text-zinc-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                                {selectedEmail.subject.toLowerCase().startsWith("re:") 
                                  ? selectedEmail.subject 
                                  : `Re: ${selectedEmail.subject}`}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="self-stretch h-px bg-blue-300" />
                        
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply here..."
                          className="self-stretch flex-1 text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5 outline-none resize-none placeholder:text-gray-300"
                        />
                      </div>
                      
                      <div className="self-stretch pt-3 border-t border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          {/* Formatting Tools (simplified) */}
                          {["B", "I", "U", "S"].map(tool => (
                            <button key={tool} className="w-8 h-8 rounded flex justify-center items-center text-gray-400 hover:bg-gray-50">
                              {tool}
                            </button>
                          ))}
                          <button className="p-2">
                            <img src="/icons/expand_icon.svg" alt="" className="w-4 h-4 opacity-50" />
                          </button>
                        </div>
                        <button 
                          onClick={handleSendReply}
                          disabled={sendingReply || !replyText.trim()}
                          className={`px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors ${
                            (sendingReply || !replyText.trim()) ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {sendingReply ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="self-stretch flex-1 p-6 bg-white rounded-xl flex flex-col justify-start items-start gap-6 overflow-hidden">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch inline-flex justify-between items-center">
                          <div className="justify-start text-zinc-950 text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                            {selectedEmail.subject.toLowerCase().startsWith("re:") 
                              ? selectedEmail.subject 
                              : `Re: ${selectedEmail.subject}`}
                          </div>
                          <div className="justify-center text-gray-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
                            {selectedEmail.timestamp}
                          </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div className="justify-start text-zinc-950 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                              From:
                            </div>
                            <div className="justify-center text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                              {selectedEmail.from}
                            </div>
                          </div>
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div className="justify-start text-zinc-950 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                              To:
                            </div>
                            <div className="justify-center text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                              {selectedEmail.to}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch h-px bg-blue-300" />
                      <div className="self-stretch justify-center text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5 whitespace-pre-wrap">
                        {selectedEmail.body}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Section Footer (only show when not replying) */}
                {!isReplying && (
                  <div className="flex-shrink-0 self-stretch p-6 bg-white border-t border-gray-200 flex flex-col justify-start items-end gap-3">
                    <div className="inline-flex justify-start items-start gap-3">
                      <button className="px-3 py-2 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <img src="/icons/forward_icon.svg" alt="Forward" className="w-5 h-5" />
                        <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Forward
                        </div>
                      </button>
                      <button 
                        onClick={() => setIsReplying(true)}
                        className="px-3 py-2 bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 hover:bg-blue-800 transition-colors"
                      >
                        <div className="justify-start text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Reply
                        </div>
                        <img src="/icons/reply_icon.svg" alt="Reply" className="w-5 h-5 brightness-0 invert" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="self-stretch flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-semibold">No email selected</p>
                  <p className="text-sm">Select an email to view its content</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
