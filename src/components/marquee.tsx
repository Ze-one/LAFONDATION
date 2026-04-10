"use client";

import Image from "next/image";

export function Marquee() {
  const text = "FECAF00T";
  const repeated = Array(20).fill(text).join("   •   ");

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <div className="absolute inset-0">
        <Image
          src="/images/background.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>
      <div className="relative overflow-hidden py-2.5 border-b border-slate-700/50">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-lg font-bold uppercase tracking-[0.3em] text-amber-400">
            {repeated}
          </span>
        </div>
      </div>
    </div>
  );
}