import { RegistrationForm } from "@/components/registration/registration-form";
import { Marquee } from "@/components/marquee";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10 sm:py-16">
      <Marquee />
      <div className="mx-auto max-w-xl space-y-6 z-10">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            LAFONDATION
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Onboarding
          </h1>
        </header>
        <RegistrationForm />
      </div>
    </main>
  );
}
