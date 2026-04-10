import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { Marquee } from "@/components/marquee";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-dvh px-4 py-10 sm:py-16">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/background.png.jfif"
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
      </div>
      <Marquee />
      <div className="mx-auto max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
