import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="max-w-[1440px] mx-auto flex min-h-screen bg-slate-50 font-sans">
      <main className="w-full overflow-hidden flex flex-col lg:flex-row bg-white">
        {/* Left: Login form */}
        <div className="flex flex-col w-full lg:w-[42%] items-center justify-center px-4 py-12 sm:py-16 lg:py-0 border-b lg:border-b-0 lg:border-r border-slate-100 bg-[radial-gradient(circle_at_center,_#E6F0FF_0,_#FFFFFF_65%,_#FFFFFF_100%)]">
          <div className="w-full max-w-[360px] px-4 md:px-0">
            {/* Logo */}
            <div className="mb-6 flex items-center justify-center">
              <Image
                src="/images/logo.svg"
                alt="Ateni"
                width={28}
                height={28}
                className="w-[142px]"
                priority
              />
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Log in
              </h1>
              <p className="text-base font-normal leading-6 text-slate-500">
                Welcome back. Log in to your account.
              </p>
            </div>

            <LoginForm />
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <a href="/" className="font-medium text-[#013F9D] hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Right: hero image — hidden on mobile, shown lg+ */}
        <div className="hidden lg:flex max-w-[58%] items-center w-full bg-[#E6F0FF]">
        <div className="my-auto relative h-170 w-[1440px] overflow-hidden rounded-3xl translate-x-[5%]">
          <Image
            src="/images/signup_hero.svg"
            alt="Ateni dashboard preview"
            fill
            priority
            className="h-170 w-[1440px]"
          />
        </div>
      </div>
      </main>
    </div>
  );
}