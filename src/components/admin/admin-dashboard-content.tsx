"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./user-table";

export function AdminDashboardContent({ 
  totalUsers, 
  pendingApprovals, 
  totalDeposits, 
  users 
}: { 
  totalUsers: number; 
  pendingApprovals: number; 
  totalDeposits: number; 
  users: any[];
}) {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh bg-gradient-to-b from-secondary/40 to-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border bg-card p-6">
          <h1 className="text-2xl font-bold">{t("adminPanel")}</h1>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("totalUsers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("pendingVerifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("totalDeposits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeposits}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t("userManagement")}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable users={users} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}