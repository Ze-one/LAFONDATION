"use client";

import Image from "next/image";

export function Marquee() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <div className="absolute inset-0 h-20">
        <Image
          src="/images/background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>
    </div>
  );
}