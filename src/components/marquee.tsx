"use client";

export function Marquee() {
  const text = "FECAF00T";
  const repeated = Array(30).fill(text).join("      •      ");

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/95" />
      <div className="absolute inset-0 flex items-center">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-6xl md:text-8xl font-black uppercase tracking-[0.2em] text-amber-500/20">
            {repeated}
          </span>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
    </div>
  );
}