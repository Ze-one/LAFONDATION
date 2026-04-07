import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <main className="min-h-dvh bg-gradient-to-b from-secondary/40 to-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-card p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Admin Panel
          </p>
          <nav className="space-y-2 text-sm">
            <Link className="block rounded-md px-3 py-2 hover:bg-accent" href="/admin/dashboard">
              Dashboard
            </Link>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
