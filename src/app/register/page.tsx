import { RegistrationForm } from "@/components/registration/registration-form";

export default function RegisterPage() {
  return (
    <main className="relative min-h-dvh px-4 sm:px-8 lg:px-16 py-6 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-[90%] sm:max-w-xl lg:max-w-xl space-y-4 sm:space-y-6 z-10">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            LAFONDATION
          </p>
          <h1 className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
            Onboarding
          </h1>
        </header>
        <RegistrationForm />
      </div>
    </main>
  );
}