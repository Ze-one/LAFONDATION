"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 sm:gap-8 px-3 sm:px-4 py-8 sm:py-12">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 hover:scale-110 hover:rotate-2 transition-transform duration-500 z-10">
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
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("ourMission")}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            La Fondation Privada Samuel Eto&apos;o, créée en mars 2006, est une organisation à but non lucratif dédiée à la protection des enfants et des jeunes défavorisés. Nous fournissons une aide d&apos;urgence, favorisons l&apos;éducation et la santé, et soutenons l&apos;insertion sociale des plus vulnérables pour leur offrir un avenir plus prometteur.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("entrepreneurship")}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            Parce que la charité ne suffit pas à développer un continent, la fondation mise sur l&apos;autonomie. Nous offrons un programme de soutien aux porteurs de projets et start-ups locales avec capital d&apos;amorçage, mentorat par des experts, et soutien aux projets numériques innovants pour un développement économique durable.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Fundesport - Académie de Football</h2>
          <p className="text-sm sm:text-base text-slate-300">
            Déclarée d&apos;utilité publique le 1er avril 2023 par le Président de la République du Cameroun, Fundesport comprend quatre centres de formation au Cameroun (Douala, Yaoundé, Limbé, Bamenda) et un au Gabon (Libreville). Notre objectif est d&apos;offrir les meilleures opportunités aux jeunes athlètes africains en utilisant le football comme moyen de développement économique, culturel et social.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{t("objectives")}</h2>
          <ul className="text-sm sm:text-base text-slate-300 space-y-2 list-disc list-inside">
            <li>Construire des écoles, centres de santé et infrastructures sportives</li>
            <li>Offrir des bourses d&apos;études et formations professionnelles</li>
            <li>Organiser des camps de football et activités récréatives</li>
            <li>Soutenir les familles vulnérables et personnes âgées</li>
            <li>Attribuer 80 bourses annuelles aux étudiants talentueux</li>
            <li>Contribution à la distribution de matériel informatique</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Actions Humanitaires</h2>
          <p className="text-sm sm:text-base text-slate-300">
            La fondation a contribué au développement de cinq orphelinats au Cameroun et conclu un partenariat avec l&apos;USP Fundacion Alex (Barcelone) pour fournir des soins hospitaliers aux enfants camerounais. Nous utilisons également le sport comme moyen d&apos;aider à l&apos;intégration des enfants handicapés et déficients mentaux.
          </p>
        </div>

        <div className="text-center bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-xl p-4 sm:p-6 border border-blue-500/30">
          <p className="text-white font-semibold text-lg sm:text-xl mb-2">{t("togetherWeCan")}</p>
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
      </div>
    </main>
  );
}