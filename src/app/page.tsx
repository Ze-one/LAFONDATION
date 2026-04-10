import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/background.png.jfif"
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background" />
      </div>
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        <Image
          src="/images/logo.png.png"
          alt="LAFONDATION Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          FECAF00T
        </p>
        <p className="mt-3 max-w-md text-muted-foreground">
          Register, receive your receipt, and complete onboarding from your
          dashboard.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/register">Start registration</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </main>
  );
}
