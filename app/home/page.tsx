import Image from "next/image";
import BarChart from "../../components/BarChart";
import Sidebar from "../../components/Sidebar";

export default function HomePage() {
  return (
    <div className="max-w-[1440px] mx-auto flex bg-slate-50 font-sans">
      <main className="flex w-full bg-white">
        <Sidebar />
        <section className="relative flex h-[960px] w-[1144px] flex-col items-center pb-12 gap-9">
        <div
        style={{
          position: "absolute",
          top: "-2%",
          left: 0,
          width: "65%",
          height: "42%",
          background:
            "radial-gradient(ellipse at 45% 52%, rgba(255, 195, 215, 0.42) 0%, rgba(255, 210, 225, 0.28) 35%, rgba(255, 225, 232, 0.12) 60%, transparent 78%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-2%",
          right: 0,
          width: "65%",
          height: "42%",
          background:
            "radial-gradient(ellipse at 55% 52%, rgba(175, 215, 248, 0.42) 0%, rgba(190, 222, 250, 0.28) 35%, rgba(205, 228, 250, 0.12) 60%, transparent 78%)",
          pointerEvents: "none",
        }}
      />
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-6 px-8 pt-8">
            <div className="relative h-40 w-40 rounded-full border-[4px] border-white bg-white shadow-[0px_2px_2px_-1px_#0A0D120A,0px_4px_6px_-2px_#0A0D1208] overflow-hidden">
              <Image
                src="/avatar.png"
                alt="Margot"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex max-w-[640px] flex-col gap-1 text-center">
              <h1 className="text-2xl font-semibold leading-8 text-slate-900">
                Welcome, I&apos;m Margot
              </h1>
              <p className="text-base font-normal leading-6 text-slate-600">
                How can I help you get new customers?
              </p>
            </div>
          </div>

          <div className="w-full max-w-[1280px] px-8">
            <div className="flex w-full items-center justify-between h-[60px] gap-5">
              <div className="flex flex-col flex-1 min-w-[320px] max-w-[891px] gap-1">
                <h2 className="text-[24px] leading-8 font-semibold text-[#181D27]">
                  Dashboard
                </h2>
                <p className="text-[16px] leading-6 text-slate-600">
                  Here is a summary of the customer search campaigns I am running.
                </p>
              </div>

              <button
                type="button"
                className="flex items-center h-10 rounded-[8px] bg-[#3373F5] text-white border-2 border-[#3373F5] px-[14px] gap-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
              >
                <span className="px-[2px] text-[14px] font-semibold leading-5">
                  Create campaign
                </span>
                <Image src = "/LandingPage/announcement.svg" alt="announcement" className="ml-2 inline-block w-5 h-5" width={20} height={20} aria-hidden />
              </button>
            </div>
          </div>

          <div className="w-full max-w-[1280px] px-8">
            <div className="flex w-full gap-[20px] mt-6">
              {[{src :"/LandingPage/announcement-gray-icon.svg",
              text: "All Campaigns",
              number: "10",
              percentage: "2.4%",
              key:1
              }, {src :"/LandingPage/leads-icon.svg",
                text: "Leads",
                number: "10",
                percentage: "2.4%",
                key:2
                }, {src :"/LandingPage/responses-obtained-icon.svg",
                  text: "Responses obtained",
                  number: "10",
                  percentage: "2.4%",
                  key:3
                  }].map((item) => (
                <div
                  key={item.key}
                  className="flex w-full max-w-[346px] min-w-[304px] rounded-[12px] border-2 border-[#E9EAEB] bg-white p-5 gap-4 shadow-[0px_1px_2px_0px_#1018280D]"
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-[8px] border border-[#E9EAEB] bg-white flex items-center justify-center shadow-[0px_1px_2px_0px_#1018280D,0px_-2px_0px_0px_#0A0D120A]">
                      <Image src= {item.src} alt = "icon" className="w-5 h-5" width={20} height={20} />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <span className="text-sm font-semibold text-[#535862]">{item.text}</span>

                    <div className="flex items-center justify-between">
                      <span className="text-[30px] leading-[38px] font-semibold text-[#181D27]">{item.number}</span>

                      <div className="flex items-center gap-[4px] border rounded-[6px] border-[#D5D7DA] px-2 py-1 shadow-[0px_1px_2px_0px_#1018280D]">
                        <div className = "w-[12px] h-[12px] relative">
                        <Image src = "/LandingPage/arrow-upright-icon.svg" alt = "icon" width= {20} height = {20} className="absolute top-[3.5px] left-[3.5px] w-[6px] h-[6px]" />
                        </div>
                        <span className="text-[14px] leading-[20px] font-medium font-inter text-[#414651]">{item.percentage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column container beneath the cards (padding left/right 32px, gap 24px) */}
          <div className="w-full max-w-[1280px] px-[32px] mt-6">
            <div className="flex flex-col gap-[20px]">
              {/* toggle row: Your company / Your clients / Products/Services offered */}
              <div className="self-stretch bg-neutral-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-0.5">
                <div className="flex-1 h-9 px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex justify-center items-center gap-2 overflow-hidden">
                  <div className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                    Your company
                  </div>
                </div>
                <div className="flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                  <div className="text-gray-500 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                    Your clients
                  </div>
                </div>
                <div className="flex-1 h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                  <div className="text-gray-500 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                    Products/Services offered
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4 w-full">
                <div className="flex-1 flex items-center gap-1">
                  <div className="text-[18px] leading-7 font-semibold text-[#181D27] font-['Plus_Jakarta_Sans']">
                    Business opportunities found by Margot
                  </div>
                  <div className="text-emerald-600 text-[18px] leading-7 font-semibold font-['Plus_Jakarta_Sans']">
                    +104%
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-neutral-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-center gap-0.5">
                    <div className="h-9 px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex justify-center items-center gap-2 overflow-hidden">
                      <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-5">12 meses</div>
                    </div>
                    <div className="h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                      <div className="text-gray-500 text-sm font-semibold font-['Inter'] leading-5">30 días</div>
                    </div>
                    <div className="h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                      <div className="text-gray-500 text-sm font-semibold font-['Inter'] leading-5">7 días</div>
                    </div>
                    <div className="h-9 px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden">
                      <div className="text-gray-500 text-sm font-semibold font-['Inter'] leading-5">24 horas</div>
                    </div>
                  </div>

                  <div className="px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex justify-center items-center gap-1 overflow-hidden">
                    <div className="w-5 h-5 relative overflow-hidden">
                      <div className="w-[14px] h-[10px] left-[2.5px] top-[5px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-gray-700" />
                    </div>
                    <div className="px-0.5 flex justify-center items-center">
                      <div className="text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">Filtros</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1280px] px-[32px] mt-6">
            <div className="w-full bg-white">
              <BarChart
                data={[
                  20, 14, 3, 20, 24, 12, 16, 20, 28, 36, 2, 2, 16, 6, 4, 6, 2, 44, 2, 20, 16,
                  8, 36, 14, 14, 32, 5, 24, 28, 12, 20, 28, 28, 20, 28, 32, 36, 9, 9, 36, 36, 36,
                ]}
                height={208}
                color="#3373F5"
              />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

