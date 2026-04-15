import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte FECAFOOT pour gérer vos documents et inscriptions.",
};

export default async function LoginPage() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      redirect("/dashboard");
    }
  } catch {
    // Continue to login page
  }

  return (
    <main className="relative min-h-dvh px-4 sm:px-8 lg:px-16 py-8 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-[90%] sm:max-w-md lg:max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}