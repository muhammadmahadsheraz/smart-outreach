"use client";
import Image from "next/image";
import { useState } from "react";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="lg:hidden w-full flex items-center justify-between bg-white border-b border-slate-200 px-4 py-4 gap-3">
      <Image
        src="/images/logo.svg"
        alt="Ateni"
        width={142}
        height={28}
        priority
      />
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5D7DA] p-2 hover:bg-slate-50 transition-colors"
      >
        <Image
          src="/images/chevron-left-double.svg"
          alt="Toggle menu"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
