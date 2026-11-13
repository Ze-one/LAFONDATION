"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react";

const programs = [
  { icon: Heart, title: "Emergency aid", copy: "Fast, dignified support for families navigating an unexpected crisis." },
  { icon: Sparkles, title: "Youth scholarships", copy: "Education and skills funding that helps young people build durable futures." },
  { icon: ShieldCheck, title: "Family resilience", copy: "Structured grants and micro-loans designed around real household needs." },
];

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#fbfbf8] text-[#171717]">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-white/15 bg-[#171717]/90 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3 text-sm font-black tracking-[0.2em]">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f6e900] text-[#171717]">L</span>
            LAFONDATION
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-medium text-white/65 md:flex">
            <a href="#mission" className="hover:text-white">Our mission</a>
            <a href="#programs" className="hover:text-white">Programs</a>
            <a href="#impact" className="hover:text-white">Impact</a>
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/register" className="rounded-full bg-[#f6e900] px-5 py-2.5 font-bold text-[#171717] transition hover:bg-white">Apply for support</Link>
          </nav>
          <Link href="/register" className="rounded-full bg-[#f6e900] px-4 py-2 text-xs font-bold text-[#171717] md:hidden">Apply</Link>
        </div>
      </header>

      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[#161616] pt-16 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-[#f6e900]">Aid that moves people forward</p>
            <h1 className="max-w-xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">A stronger future starts with support.</h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/80 sm:text-lg">LAFONDATION connects families, young entrepreneurs, and communities with transparent funding, practical programs, and a team that stays close to every journey.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#f6e900] px-6 py-3.5 text-sm font-black text-[#171717] transition hover:-translate-y-0.5 hover:bg-white">Start your application <ArrowRight size={17} /></Link>
              <a href="#mission" className="rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold transition hover:border-white hover:bg-white/10">Discover our work</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 grid w-[calc(100%-2.5rem)] max-w-6xl -translate-x-1/2 translate-y-1/2 grid-cols-1 overflow-hidden rounded-2xl bg-[#f6e900] text-[#171717] shadow-2xl sm:grid-cols-3">
          {programs.map(({ icon: Icon, title, copy }) => <div key={title} className="flex items-start gap-4 border-b border-[#171717]/10 p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-0"><Icon size={27} strokeWidth={1.8} /><div><p className="text-sm font-black uppercase">{title}</p><p className="mt-1 text-xs leading-5 text-[#171717]/65">{copy}</p></div></div>)}
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-6xl px-5 pb-20 pt-32 lg:px-10">
        <div className="text-center"><p className="text-xs font-black uppercase tracking-[0.25em] text-[#9c9200]">Our impact</p><h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">We&apos;ve reached so far</h2></div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[['2,480+', 'families supported'], ['€1.8M', 'aid allocated'], ['14', 'community programs']].map(([value, label]) => <div key={label} className="rounded-2xl border border-black/10 bg-white p-7 text-center shadow-sm"><p className="text-4xl font-black tracking-tight">{value}</p><p className="mt-2 text-sm font-semibold uppercase tracking-wider text-black/50">{label}</p></div>)}
        </div>
        <div className="mt-8 rounded-2xl bg-[#f1f0eb] p-5 sm:p-7"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider"><span>2025 community fund</span><span>78% allocated</span></div><div className="mt-4 h-4 overflow-hidden rounded-full bg-white"><div className="h-full w-[78%] rounded-full bg-[#f6e900]" /></div><div className="mt-3 flex justify-between text-xs text-black/50"><span>€0 raised</span><span>Goal: €2,300,000</span></div></div>
      </section>

      <section id="mission" className="border-y border-black/10 bg-white px-5 py-20 lg:px-10"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-[#9c9200]">Built for dignity</p><h2 className="mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl">How can you help?</h2><p className="mt-6 max-w-lg leading-7 text-black/60">Give time, open a door, or apply for support. Our programs are built to turn a single moment of help into a lasting change for people and communities.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="rounded-full bg-[#171717] px-6 py-3 text-sm font-bold text-white hover:bg-[#f6e900] hover:text-[#171717]">Join the foundation</Link><Link href="/login" className="rounded-full border border-black/15 px-6 py-3 text-sm font-bold">Member login</Link></div></div><div id="programs" className="grid gap-4 sm:grid-cols-2">{programs.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl bg-[#f6e900] p-6"><Icon size={30} /><h3 className="mt-8 text-lg font-black uppercase">{title}</h3><p className="mt-2 text-sm leading-6 text-black/65">{copy}</p></article>)}<article className="rounded-2xl bg-[#171717] p-6 text-white sm:col-span-2"><div className="flex items-center gap-3"><Users size={29} className="text-[#f6e900]" /><h3 className="text-lg font-black uppercase">A review process you can understand</h3></div><p className="mt-3 max-w-xl text-sm leading-6 text-white/65">Your application moves through consent, profile review, AAA eligibility scoring, and a clear decision from our team. Track each step from your dashboard.</p></article></div></div></section>

      <footer className="bg-[#171717] px-5 py-10 text-white lg:px-10"><div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between"><p><span className="font-black tracking-[0.2em] text-white">LAFONDATION</span> · Aid, opportunity, community.</p><div className="flex items-center gap-5"><Link href="/register" className="hover:text-white">Apply</Link><Link href="/login" className="hover:text-white">Login</Link><span className="inline-flex items-center gap-2"><WalletCards size={15} /> Secure profile review</span></div></div></footer>
    </main>
  );
}
