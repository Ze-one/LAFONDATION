"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language-context";

const programs = [
  { icon: Heart, title: "Emergency aid", copy: "Fast, dignified support for families navigating an unexpected crisis." },
  { icon: Sparkles, title: "Youth scholarships", copy: "Education and skills funding that helps young people build durable futures." },
  { icon: ShieldCheck, title: "Family resilience", copy: "Structured grants and micro-loans designed around real household needs." },
];

export default function Home() {
  const { language } = useLanguage();
  const [counts, setCounts] = useState({ families: 0, funds: 0, programs: 0 });
  const copy = language === "fr" ? {
    mission: "Notre mission", programs: "Programmes", impact: "Impact", login: "Connexion", apply: "Demander une aide",
    eyebrow: "Un soutien qui fait avancer", title: "Un avenir plus fort commence par le soutien.", description: "LAFONDATION relie les familles, les jeunes entrepreneurs et les communautés à des financements transparents et des programmes concrets.", start: "Commencer ma demande", discover: "Découvrir notre action", impactTitle: "Nous avons déjà accompli", help: "Comment pouvez-vous aider ?"
  } : {
    mission: "Our mission", programs: "Programs", impact: "Impact", login: "Login", apply: "Apply for support",
    eyebrow: "Aid that moves people forward", title: "A stronger future starts with support.", description: "LAFONDATION connects families, young entrepreneurs, and communities with transparent funding and practical programs.", start: "Start your application", discover: "Discover our work", impactTitle: "We've reached so far", help: "How can you help?"
  };

  useEffect(() => {
    const startedAt = performance.now();
    const duration = 1500;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts({ families: Math.round(2480 * eased), funds: Number((1.8 * eased).toFixed(1)), programs: Math.round(14 * eased) });
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <main className="min-h-dvh bg-[#fbfbf8] text-[#171717]">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-white/15 bg-[#171717]/90 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3 text-sm font-black tracking-[0.2em]">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f6e900] text-[#171717]">L</span>
            LAFONDATION
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-medium text-white/65 md:flex">
            <a href="#mission" className="hover:text-white">{copy.mission}</a>
            <a href="#programs" className="hover:text-white">{copy.programs}</a>
            <a href="#impact" className="hover:text-white">{copy.impact}</a>
            <Link href="/login" className="hover:text-white">{copy.login}</Link>
            <LanguageToggle />
            <Link href="/register" className="rounded-full bg-[#f6e900] px-5 py-2.5 font-bold text-[#171717] transition hover:bg-white">{copy.apply}</Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden"><LanguageToggle /><Link href="/register" className="rounded-full bg-[#f6e900] px-4 py-2 text-xs font-bold text-[#171717]">{copy.apply}</Link></div>
        </div>
      </header>

      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[#161616] pt-16 text-white">
        <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: "easeOut" }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-[#f6e900]">{copy.eyebrow}</p>
            <h1 className="max-w-xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">{copy.title}</h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/80 sm:text-lg">{copy.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#f6e900] px-6 py-3.5 text-sm font-black text-[#171717] transition hover:-translate-y-0.5 hover:bg-white">{copy.start} <ArrowRight size={17} /></Link>
              <a href="#mission" className="rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold transition hover:border-white hover:bg-white/10">{copy.discover}</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 grid w-[calc(100%-2.5rem)] max-w-6xl -translate-x-1/2 translate-y-1/2 grid-cols-1 overflow-hidden rounded-2xl bg-[#f6e900] text-[#171717] shadow-2xl sm:grid-cols-3">
          {programs.map(({ icon: Icon, title, copy }) => <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 260 }} key={title} className="group flex items-start gap-4 border-b border-[#171717]/10 p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-0"><Icon size={27} strokeWidth={1.8} className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" /><div><p className="text-sm font-black uppercase">{title}</p><p className="mt-1 text-xs leading-5 text-[#171717]/65">{copy}</p></div></motion.div>)}
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-6xl px-5 pb-20 pt-32 lg:px-10">
        <div className="text-center"><p className="text-xs font-black uppercase tracking-[0.25em] text-[#9c9200]">{copy.impact}</p><h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">{copy.impactTitle}</h2></div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[[`${counts.families.toLocaleString()}+`, 'families supported'], [`€${counts.funds.toFixed(1)}M`, 'aid allocated'], [`${counts.programs}`, 'community programs']].map(([value, label], index) => <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -7, scale: 1.02 }} key={label} className="group rounded-2xl border border-black/10 bg-white p-7 text-center shadow-sm transition-shadow hover:border-[#f6e900] hover:shadow-xl"><p className="text-4xl font-black tracking-tight transition-colors group-hover:text-[#9c9200]">{value}</p><p className="mt-2 text-sm font-semibold uppercase tracking-wider text-black/50">{label}</p></motion.div>)}
        </div>
        <div className="mt-8 rounded-2xl bg-[#f1f0eb] p-5 sm:p-7"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider"><span>2025 community fund</span><span>78% allocated</span></div><div className="mt-4 h-4 overflow-hidden rounded-full bg-white"><div className="h-full w-[78%] rounded-full bg-[#f6e900]" /></div><div className="mt-3 flex justify-between text-xs text-black/50"><span>€0 raised</span><span>Goal: €2,300,000</span></div></div>
      </section>

      <section id="mission" className="border-y border-black/10 bg-white px-5 py-20 lg:px-10"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-[#9c9200]">Built for dignity</p><h2 className="mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl">How can you help?</h2><p className="mt-6 max-w-lg leading-7 text-black/60">Give time, open a door, or apply for support. Our programs are built to turn a single moment of help into a lasting change for people and communities.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="rounded-full bg-[#171717] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#f6e900] hover:text-[#171717]">Join the foundation</Link><Link href="/login" className="rounded-full border border-black/15 px-6 py-3 text-sm font-bold transition hover:-translate-y-1 hover:border-black">Member login</Link></div></div><div id="programs" className="grid gap-4 sm:grid-cols-2">{programs.map(({ icon: Icon, title, copy }) => <motion.article whileHover={{ y: -7, rotate: 0.5 }} transition={{ type: "spring", stiffness: 240 }} key={title} className="group rounded-2xl bg-[#f6e900] p-6 shadow-sm transition-shadow hover:shadow-xl"><Icon size={30} className="transition-transform duration-300 group-hover:scale-110" /><h3 className="mt-8 text-lg font-black uppercase">{title}</h3><p className="mt-2 text-sm leading-6 text-black/65">{copy}</p></motion.article>)}<article className="rounded-2xl bg-[#171717] p-6 text-white transition hover:-translate-y-1 hover:shadow-xl sm:col-span-2"><div className="flex items-center gap-3"><Users size={29} className="text-[#f6e900]" /><h3 className="text-lg font-black uppercase">A review process you can understand</h3></div><p className="mt-3 max-w-xl text-sm leading-6 text-white/65">Your application moves through consent, profile review, AAA eligibility scoring, and a clear decision from our team. Track each step from your dashboard.</p></article></div></div></section>

      <footer className="bg-[#171717] px-5 py-10 text-white lg:px-10"><div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between"><p><span className="font-black tracking-[0.2em] text-white">LAFONDATION</span> · Aid, opportunity, community.</p><div className="flex items-center gap-5"><Link href="/register" className="hover:text-white">Apply</Link><Link href="/login" className="hover:text-white">Login</Link><span className="inline-flex items-center gap-2"><WalletCards size={15} /> Secure profile review</span></div></div></footer>
    </main>
  );
}
