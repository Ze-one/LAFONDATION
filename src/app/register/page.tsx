import { RegistrationForm } from "@/components/registration/registration-form";
import { useLanguage } from "@/lib/language-context";

export default function RegisterPage() {
  const { t } = useLanguage();
  
  return (
    <main className="relative min-h-dvh px-3 sm:px-4 py-6 sm:py-16">
      <div className="mx-auto max-w-sm sm:max-w-xl space-y-4 sm:space-y-6 z-10">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            LAFONDATION
          </p>
          <h1 className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
            {t("onboarding")}
          </h1>
        </header>
        <RegistrationForm />
      </div>
    </main>
  );
}