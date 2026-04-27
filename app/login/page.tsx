import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen w-full font-sans">
      <main className="flex flex-col lg:flex-row min-h-screen">
        {/* Left: Login form */}
        <div className="flex flex-col w-full lg:w-[42%] items-center justify-center py-8 px-4 sm:py-12 md:py-16 lg:py-20 min-h-screen lg:min-h-0 bg-[radial-gradient(circle_at_center,_#E6F0FF_0,_#FFFFFF_65%,_#FFFFFF_100%)]">
          <div className="w-full max-w-[360px]">
            {/* Logo */}
            <div className="mb-6 sm:mb-8 flex items-center justify-center">
              <Image
                src="/images/logo.svg"
                alt="Ateni"
                width={28}
                height={28}
                className="w-[120px] sm:w-[142px]"
                priority
              />
            </div>

            <div className="space-y-1 text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                Log in
              </h1>
              <p className="text-sm sm:text-base font-normal leading-6 text-slate-500">
                Welcome back. Log in to your account.
              </p>
            </div>

            <LoginForm />

            <div className="mt-6">
              <p className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <a href="/" className="font-medium text-[#013F9D] hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right: hero image — hidden on mobile, shown lg+ */}
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