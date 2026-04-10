"use client";

import Image from "next/image";

export function Marquee() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-16">
      <Image
        src="/images/background.png"
        alt="Background"
        fill
        className="object-cover opacity-60"
        priority
      />
    </div>
  );
}