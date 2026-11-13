"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserTable } from "./user-table";
import { ProfileMenu } from "@/components/profile-menu";
import { Status, Role } from "@prisma/client";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: Status;
  role: Role;
  city: string | null;
  address: string | null;
  createdAt: Date;
  financials: { cardName: string; expiryDate: string; lastFour: string } | null;
  _count: { documents: number; notifications: number };
}

export function AdminDashboardContent({ 
  totalUsers, 
  pendingApprovals, 
  totalDeposits, 
  users 
}: { 
  totalUsers: number; 
  pendingApprovals: number; 
  totalDeposits: number; 
  users: User[];
}) {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh bg-[#f1f0eb] px-4 py-10 text-[#171717] sm:py-16">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-[#171717] p-4 text-white shadow-xl sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">{t("adminPanel")}</h1>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/api/admin/users/download" target="_blank">
                  {t("downloadAllUsers")}
                </Link>
              </Button>
              <ProfileMenu userName="Admin" userRole="ADMIN" />
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("totalUsers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("pendingVerifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals}</div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("totalDeposits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeposits}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-black/10 bg-[#171717] text-white shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f6e900]">Global telemetry</p><h2 className="mt-2 text-2xl font-black uppercase">We&apos;ve reached so far</h2></div>
              <p className="text-sm text-white/55">{pendingApprovals} applications awaiting review</p>
            </div>
            <div className="mt-7 h-4 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-[#f6e900]" /></div>
            <div className="mt-3 flex justify-between text-xs text-white/45"><span>€1.8M allocated</span><span>Goal: €2.3M</span></div>
          </CardContent>
        </Card>

        <Card className="border-black/10 bg-[#fbfbf8] shadow-sm">
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
