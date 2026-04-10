"use client";

export function Marquee() {
  const text = "FECAF00T";
  const repeated = Array(20).fill(text).join("   •   ");

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] overflow-hidden bg-slate-950/95 border-b border-slate-800 py-2.5">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-lg font-bold uppercase tracking-[0.3em] text-amber-400">
          {repeated}
        </span>
      </div>
    </div>
  );
}