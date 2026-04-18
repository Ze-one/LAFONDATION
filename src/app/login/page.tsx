import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte SAMUEL ET'00 pour gérer vos documents et inscriptions.",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh px-4 sm:px-8 lg:px-16 py-8 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-[90%] sm:max-w-md lg:max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}