"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 hover:scale-110 hover:rotate-2 transition-transform duration-500 z-10">
        <Image
          src="/images/logo.png.png"
          alt="LAFONDATION Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="text-center z-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
          FECAF00T
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          LAFONDATION
        </h1>
        <p className="mt-3 max-w-md text-slate-300">
          {t("tagline")}
        </p>
      </div>
      <div className="flex gap-4 z-10">
        <Button asChild size="lg">
          <Link href="/register">{t("startRegistration")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">{t("login")}</Link>
        </Button>
      </div>
    </main>
  );
}