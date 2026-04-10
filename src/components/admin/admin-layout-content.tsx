"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh bg-gradient-to-b from-secondary/40 to-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-card p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t("adminPanel")}
          </p>
          <nav className="space-y-2 text-sm">
            <Link className="block rounded-md px-3 py-2 hover:bg-accent" href="/admin/dashboard">
              {t("dashboard")}
            </Link>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}