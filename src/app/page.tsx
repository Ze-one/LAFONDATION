"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 sm:gap-8 px-3 sm:px-4 py-8 sm:py-12">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 hover:scale-110 hover:rotate-2 transition-transform duration-500 z-10">
        <Image
          src="/images/logo.png.png"
          alt="LAFONDATION Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <div className="text-center z-10 px-2 max-w-2xl">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
          FECAF00T
        </p>
        <h1 className="mt-1 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          {t("welcome")} à la Fondation Privada Samuel Eto&apos;o
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-300">
          {t("tagline")}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 z-10 w-full max-w-3xl px-2">
        {/* Registration/Login Card - First */}
        <div className="text-center bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-xl p-4 sm:p-6 border border-blue-500/30 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-400/50 hover:shadow-blue-500/20 hover:shadow-2xl">
          <p className="text-white font-semibold text-lg sm:text-xl mb-2">{t("joinFoundation")}</p>
          <p className="text-slate-300 text-sm sm:text-base mb-4">
            {t("collaborate")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="sm" className="sm:size-lg w-full sm:w-auto">
              <Link href="/register">{t("startRegistration")}</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="sm:size-lg w-full sm:w-auto">
              <Link href="/login">{t("login")}</Link>
            </Button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("ourMission")}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            {t("missionDesc")}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("entrepreneurship")}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            {t("entrepreneurshipDesc")}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("fundesport")}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            {t("fundesportDesc")}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("objectives")}</h2>
          <ul className="text-sm sm:text-base text-slate-300 space-y-2 list-disc list-inside">
            <li>{t("obj1")}</li>
            <li>{t("obj2")}</li>
            <li>{t("obj3")}</li>
            <li>{t("obj4")}</li>
            <li>{t("obj5")}</li>
            <li>{t("obj6")}</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("humanitarian")}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            {t("humanitarianDesc")}
          </p>
        </div>
      </div>
    </main>
  );
}