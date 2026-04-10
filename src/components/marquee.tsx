"use client";

import Image from "next/image";

export function Marquee() {
  const text = "FECAF00T";
  const repeated = Array(30).fill(text).join("      •      ");

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Image
        src="/images/background.png.jfif"
        alt="Background"
        fill
        className="object-cover opacity-25"
        priority
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 flex items-center">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-5xl md:text-7xl font-black uppercase tracking-[0.15em] text-amber-500/15">
            {repeated}
          </span>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50" />
    </div>
  );
}