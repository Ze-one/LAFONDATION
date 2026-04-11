import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-dvh px-3 sm:px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-sm sm:max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}