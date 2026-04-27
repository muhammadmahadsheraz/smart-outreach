import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import MobileHeader from "../../components/MobileHeader";
import MargotTrainingFormSwitcher from "@/components/MargotTrainingForms/margottrainingformswitcher";

export default function MargotTraining() {
  return (
    <div className="flex bg-slate-50 font-sans min-h-screen">
      <main className="flex w-full bg-white">
        <Sidebar />

        <section className="relative z-0 flex min-h-screen w-full flex-col items-center pb-8 sm:pb-12 overflow-x-hidden">
          {/* Mobile header */}
          <MobileHeader />
          
          {/* Background gradients */}
          <div
            className="z-0"
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
            className="z-0"
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

          {/* Avatar + heading */}
          <div className="z-10 flex w-full max-w-[1280px] flex-col items-center px-4 sm:px-8 py-8 sm:py-10 lg:py-14 gap-4 sm:gap-5">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px] rounded-full border-[3px] border-white bg-white shadow-[0px_2px_2px_-1px_#0A0D120A,0px_4px_6px_-2px_#0A0D1208] overflow-hidden">
              <Image
                src="/avatar.png"
                alt="Margot"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex max-w-[640px] flex-col gap-1 text-center px-4">
              <div className="text-lg sm:text-xl lg:text-[24px] leading-7 sm:leading-8 lg:leading-[32px] font-semibold font-sans text-center text-gray-900">
                Hello, help me understand what product or service to sell.
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="w-full max-w-[1280px] px-4 sm:px-8 lg:px-16">
            <div className="border-b border-gray-200" />
            <MargotTrainingFormSwitcher />
          </div>
        </section>
      </main>
    </div>
  );
}