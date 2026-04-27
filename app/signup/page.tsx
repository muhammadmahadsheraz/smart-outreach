import Image from "next/image";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full font-sans">
      <main className="flex flex-col lg:flex-row min-h-screen">
        {/* Left: Sign up form */}
        <div className="flex flex-col w-full items-center py-8 px-4 sm:py-12 md:py-16 lg:py-20 lg:w-[42%] justify-center min-h-screen lg:min-h-0 bg-[radial-gradient(circle_at_center,_#E6F0FF_0,_#FFFFFF_65%,_#FFFFFF_100%)]">
          <div className="w-full max-w-[360px]">
            {/* Logo / brand */}
            <div className="mb-6 sm:mb-8 flex items-center gap-3 mx-auto">
              <div className="mx-auto">
                <Image
                  src="/images/logo.svg"
                  alt="Smart Outreach"
                  width={28}
                  height={28}
                  className="w-[120px] sm:w-[142px]"
                  priority
                />
              </div>
            </div>

            <div className="space-y-1 text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                Create an account
              </h1>
              <p className="text-sm sm:text-base font-normal leading-6 text-slate-500">
                Start your 30-day free trial.
              </p>
            </div>

            <SignupForm />

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
        </div>

        {/* Right: signup hero image */}
        <div className="hidden lg:flex lg:w-[58%] items-center justify-start bg-[#E6F0FF]">
          <div className="relative h-[600px] xl:h-[700px] w-full ml-10">
            <Image
              src="/images/signup_hero.svg"
              alt="Smart Outreach dashboard preview"
              fill
              priority
              className="object-contain object-right"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
