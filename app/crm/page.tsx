"use client";

import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export default function CRMPage() {
  return (
    <div className="max-w-[1440px] mx-auto flex bg-slate-50 font-sans">
      <main className="flex w-full bg-white">
        <Sidebar />

        <section className="relative flex min-h-screen w-full flex-col items-center pb-12 gap-0 overflow-x-hidden">
          {/* Mobile header */}
          <MobileHeader />

          {/* CRM Content */}
          <div className="self-stretch py-8 bg-white inline-flex flex-col justify-start items-center">
            <div className="w-full flex-1 max-w-[1280px] px-8 inline-flex justify-start items-start gap-8">
              
              {/* Left Panel - Prospect Details */}
              <div className="flex-1 self-stretch max-w-96 bg-white rounded-xl shadow-[0px_1px_2px_-1px_rgba(10,13,18,0.10)] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-center gap-6 overflow-hidden">
                <div className="self-stretch flex flex-col justify-start items-start">
                  {/* Header Image Placeholder */}
                  <div className="self-stretch h-28 relative overflow-hidden bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Profile Header Image</p>
                  </div>
                  
                  <div className="self-stretch px-6 flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      {/* Avatar */}
                      <div className="self-stretch inline-flex justify-start items-start gap-6">
                        <div className="w-16 h-16 relative rounded-full bg-gray-300 shadow-[0px_2px_4px_-2px_rgba(10,13,18,0.06)] shadow-[0px_4px_6px_-1px_rgba(10,13,18,0.10)] outline outline-[3px] outline-white overflow-hidden flex items-center justify-center">
                          <p className="text-gray-600 text-xs">Avatar</p>
                        </div>
                      </div>

                      {/* Name and Email */}
                      <div className="self-stretch flex flex-col justify-start items-start gap-1">
                        <h2 className="text-gray-900 text-2xl font-semibold">Lucy Wilson</h2>
                        <p className="text-gray-600 text-base">lucy@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-80 h-px bg-gray-300" />

                {/* Summary Section */}
                <div className="self-stretch px-6 flex flex-col justify-start items-start gap-6">
                  <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch inline-flex justify-between items-start">
                        <p className="text-gray-700 text-base font-medium">Summary</p>
                        <button className="p-2 bg-white rounded-lg border border-gray-300 shadow-sm flex justify-center items-center hover:bg-gray-50 transition">
                          <span className="text-gray-700 text-sm">⋯</span>
                        </button>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                        <button className="flex items-center gap-2 text-gray-600 text-sm font-semibold hover:text-blue-700 transition">
                          <span>+</span> Add tags
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 text-sm font-semibold hover:text-blue-700 transition">
                          <span>📱</span> Add phone
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 text-sm font-semibold hover:text-blue-700 transition">
                          <span>👥</span> Partners & Crew
                        </button>
                      </div>
                    </div>
                    <div className="self-stretch h-px bg-gray-300" />
                  </div>

                  {/* Details Section */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch inline-flex justify-between items-start mb-3">
                        <p className="text-gray-700 text-base font-medium">Details</p>
                        <button className="p-2 bg-white rounded-lg border border-gray-300 shadow-sm flex justify-center items-center hover:bg-gray-50 transition">
                          <span className="text-gray-700 text-sm">⋯</span>
                        </button>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch flex gap-2">
                          <span className="text-gray-500 text-sm">First Name:</span>
                          <span className="text-gray-700 text-sm">Lucy</span>
                        </div>
                        <div className="self-stretch flex gap-2">
                          <span className="text-gray-500 text-sm">Last Name:</span>
                          <span className="text-gray-700 text-sm">Wilson</span>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-px bg-gray-300" />
                  </div>

                  {/* Company Section */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch inline-flex justify-between items-start mb-3">
                        <p className="text-gray-700 text-base font-medium">Company</p>
                        <button className="p-2 bg-white rounded-lg border border-gray-300 shadow-sm flex justify-center items-center hover:bg-gray-50 transition">
                          <span className="text-gray-700 text-sm">⋯</span>
                        </button>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                        <button className="flex items-center gap-2 text-blue-800 text-base font-semibold hover:text-blue-900 transition">
                          <span>👥</span> Partners & Crew
                        </button>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                          <div className="self-stretch flex gap-2">
                            <span className="text-gray-500 text-sm">Address:</span>
                            <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet</span>
                          </div>
                          <div className="self-stretch flex gap-2 items-start flex-wrap">
                            <span className="text-gray-500 text-sm">Tags:</span>
                            <div className="flex gap-2 flex-wrap">
                              <span className="px-2 py-0.5 bg-purple-50 rounded-full text-purple-700 text-xs font-medium border border-purple-200">Label</span>
                              <span className="px-2 py-0.5 bg-amber-50 rounded-full text-amber-700 text-xs font-medium border border-amber-200">Label</span>
                              <span className="px-2 py-0.5 bg-emerald-50 rounded-full text-emerald-700 text-xs font-medium border border-emerald-200">Label</span>
                            </div>
                          </div>
                          <div className="self-stretch flex gap-2">
                            <span className="text-gray-500 text-sm">Website:</span>
                            <span className="text-gray-700 text-sm">www.partnersandcrew.com</span>
                          </div>
                          <div className="self-stretch flex gap-2">
                            <span className="text-gray-500 text-sm">Industry:</span>
                            <span className="text-gray-700 text-sm">Lorem ipsum</span>
                          </div>
                          <div className="self-stretch flex gap-2">
                            <span className="text-gray-500 text-sm">Country:</span>
                            <span className="text-gray-700 text-sm">Lorem ipsum</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Conversation */}
              <div className="flex-1 self-stretch bg-white rounded-xl shadow-[0px_1px_2px_-1px_rgba(10,13,18,0.10)] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-center overflow-hidden">
                
                {/* Conversation Header */}
                <div className="self-stretch px-6 pt-6 pb-5 bg-white border-b border-gray-200 flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch flex flex-col justify-start items-start gap-5">
                    <div className="self-stretch inline-flex justify-start items-start gap-4">
                      <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-0.5">
                        <h3 className="text-gray-900 text-lg font-semibold">Conversation with Lucy</h3>
                      </div>
                      <div className="self-stretch flex justify-start items-center gap-2">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className="px-2 py-0.5 bg-emerald-50 rounded-full text-emerald-700 text-xs font-medium border border-emerald-200">En conversación</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="self-stretch flex-1 px-6 pb-8 flex flex-col justify-end items-start gap-6 overflow-y-auto max-h-96">
                  {/* Message from Lucy */}
                  <div className="w-full flex flex-col justify-start items-start gap-4">
                    <div className="w-full inline-flex justify-start items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                        <p className="text-gray-600 text-xs">LW</p>
                      </div>
                      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                        <div className="self-stretch inline-flex justify-start items-center gap-2">
                          <span className="text-gray-700 text-sm font-medium">Lucy Wilson</span>
                          <span className="text-gray-600 text-xs">Friday 2:20pm</span>
                        </div>
                        <div className="self-stretch p-4 bg-gray-50 rounded-tr-lg rounded-bl-lg rounded-br-lg border border-gray-200 flex flex-col gap-3">
                          <div className="self-stretch flex gap-2 items-center justify-between">
                            <span className="text-gray-900 text-sm font-semibold">Re: Lorem ipsum dolor sit amet consectetur</span>
                            <button className="text-gray-500 hover:text-gray-700 transition">⋯</button>
                          </div>
                          <div className="self-stretch h-px bg-blue-300" />
                          <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message from Margot (AI) */}
                  <div className="w-full flex flex-col justify-end items-end gap-4">
                    <div className="w-full flex justify-end items-start gap-3">
                      <div className="flex-1 flex justify-end">
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <span className="text-gray-700 text-sm font-medium">Margot</span>
                            <span className="text-gray-600 text-xs">Friday 2:20pm</span>
                          </div>
                          <div className="p-4 bg-blue-600 rounded-tl-lg rounded-bl-lg rounded-br-lg border border-blue-300 flex flex-col gap-2">
                            <div className="flex gap-2 items-center justify-between">
                              <span className="text-white text-sm font-semibold">Re: Lorem ipsum dolor sit amet consectetur</span>
                              <button className="text-blue-300 hover:text-white transition">⋯</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                        <p className="text-gray-600 text-xs">MA</p>
                      </div>
                    </div>
                  </div>

                  {/* Another Message from Lucy */}
                  <div className="w-full flex flex-col justify-start items-start gap-4">
                    <div className="w-full inline-flex justify-start items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                        <p className="text-gray-600 text-xs">LW</p>
                      </div>
                      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                        <div className="self-stretch inline-flex justify-start items-center gap-2">
                          <span className="text-gray-700 text-sm font-medium">Lucy Wilson</span>
                          <span className="text-gray-600 text-xs">Friday 2:20pm</span>
                        </div>
                        <div className="self-stretch p-4 bg-gray-50 rounded-tr-lg rounded-bl-lg rounded-br-lg border border-gray-200 flex flex-col gap-3">
                          <div className="self-stretch flex gap-2 items-center justify-between">
                            <span className="text-gray-900 text-sm font-semibold">Re: Lorem ipsum dolor sit amet consectetur</span>
                            <button className="text-gray-500 hover:text-gray-700 transition">⋯</button>
                          </div>
                          <div className="self-stretch h-px bg-blue-300" />
                          <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reply Compose Area */}
                <div className="self-stretch px-6 pb-6 flex flex-col justify-start items-end gap-3">
                  <div className="self-stretch p-2.5 bg-white rounded-lg border border-gray-200 flex flex-col justify-end items-start gap-2.5">
                    <div className="self-stretch py-1 flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch flex flex-col justify-center items-start gap-1">
                        <div className="self-stretch inline-flex justify-start items-start gap-1">
                          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
                            <div className="self-stretch inline-flex justify-start items-center gap-2">
                              <span className="text-gray-900 text-sm font-semibold">Subject:</span>
                              <span className="text-gray-900 text-sm">Lorem ipsum dolor sit amet consectetur</span>
                            </div>
                          </div>
                          <span className="text-gray-400 text-sm">Draft</span>
                        </div>
                      </div>
                      <div className="self-stretch h-px bg-gray-300" />
                      <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    
                    {/* Compose Footer */}
                    <div className="self-stretch pt-1.5 border-t border-gray-200 inline-flex justify-between items-center">
                      <div className="flex justify-start items-center gap-1">
                        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded transition">📎</button>
                        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded transition">🔗</button>
                        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded transition">😊</button>
                        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded transition">⚙️</button>
                        <button className="p-2 text-gray-700 hover:bg-gray-100 rounded transition">🔒</button>
                      </div>
                      <button className="px-3 py-2 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition flex items-center gap-1">
                        Send
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}