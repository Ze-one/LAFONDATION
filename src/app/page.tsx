import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center gap-8 px-4" style={{ backgroundImage: 'url(/images/background.png.jfif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 hover:scale-110 hover:rotate-2 transition-transform duration-500 z-10">
        <Image
          src="/images/logo.png.png"
          alt="LAFONDATION Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
          FECAF00T
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          LAFONDATION
        </h1>
        <p className="mt-3 max-w-md text-slate-400">
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