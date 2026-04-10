"use client";

import Image from "next/image";

export function Marquee() {
  const text = "FECAF00T";
  const repeated = Array(30).fill(text).join("      •      ");

  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src="/images/background.png.jfif"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-slate-950/40" />
      <div className="absolute inset-0 flex items-center">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-5xl md:text-7xl font-black uppercase tracking-[0.15em] text-amber-500/10">
            {repeated}
          </span>
        </div>
      </div>
    </div>
  );
}