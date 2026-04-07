import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.id;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          FECAF00T
        </p>
        <h1
          suppressHydrationWarning
          className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          LAFONDATION
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Register, receive your receipt, and complete onboarding from your
          dashboard.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/register">Start registration</Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
          {isLoggedIn ? "Go to Dashboard" : "Login"}
        </Link>
      </Button>
    </main>
  );
}
