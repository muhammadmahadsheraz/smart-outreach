import Image from "next/image";
import { SignupForm } from "@/components/SignupForm";

export default function Home() {
  return (
    <div className="lg:min-h-[960px] max-w-[1440px] mx-auto flex bg-slate-50 font-sans">
      <main className="w-full overflow-hidden flex flex-row bg-white">
        {/* Left: Sign up form */}
        <div className="flex flex-col w-full items-center py-30  lg:w-[42%] justify-center border-r border-slate-100 bg-[radial-gradient(circle_at_center,_#E6F0FF_0,_#FFFFFF_65%,_#FFFFFF_100%)]">
          <div className = "max-w-[360px] mx-auto">
            {/* Logo / brand */}
            <div className="mb-6 flex items-center gap-3">
              <div className="mx-auto">
                <Image
                  src="/logo.svg"
                  alt="Ateni"
                  width={28}
                  height={28}
                  className="w-[142px]"
                  priority
                />
              </div>
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Create an account
              </h1>
              <p className="text-base font-normal leading-6 text-slate-500">
                Start your 30-day free trial.
              </p>
            </div>

            <SignupForm />
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-[#013F9D] hover:underline"
              >
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Right: signup hero image */}
        <div className="hidden lg:flex max-w-[58%] items-center w-full bg-[#E6F0FF]">
          <div className="my-auto relative h-160 w-[1440px] overflow-hidden rounded-3xl translate-x-[5%]">
            <Image
              src="/signup_hero.svg"
              alt="Ateni dashboard preview"
              fill
              priority
              className="h-full w-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
