import Image from "next/image";

export default function HomePage() {
  return (
    <div className="max-w-[1440px] mx-auto flex bg-slate-50 font-sans">
      <main className="flex w-full bg-white">
        <section className="flex h-[960px] w-[296px] flex-col border-r border-slate-200">
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
              { label: "Home", icon: "home" },
              { label: "Margot training", icon: "margot_training" },
              { label: "Campaigns", icon: "campaigns" },
              { label: "Inbox", icon: "inbox" },
              { label: "Reports", icon: "reports" },
            ].map((item, index) => (
              <button
                key={item.label}
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
                  { color: "#3A88FD", label: "Lorem ipsum" },
                  { color: "#7A5AF8", label: "Lorem ipsum" },
                  { color: "#EE46BC", label: "Lorem ipsum" },
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

        <section className="flex h-[960px] w-[1144px] flex-col items-center pb-12 gap-9">
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-6 px-8 pt-8">
            <div className="relative h-40 w-40 rounded-full border-[4px] border-white bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] overflow-hidden">
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

          <div className="flex-1 w-full max-w-[1280px] rounded-3xl bg-slate-50" />
        </section>
      </main>
    </div>
  );
}

