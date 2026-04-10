"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { ProfileMenu } from "@/components/profile-menu";

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-white/5 backdrop-blur-lg border-white/10 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t("adminPanel")}
          </p>
          <nav className="space-y-2 text-sm">
            <Link className="block rounded-md px-3 py-2 hover:bg-white/10 text-slate-300" href="/admin/dashboard">
              {t("dashboard")}
            </Link>
          </nav>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <ProfileMenu userName="Admin" userRole="ADMIN" />
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}