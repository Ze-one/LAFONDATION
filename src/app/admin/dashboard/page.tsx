import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";
import { ChatWrapper } from "@/components/chat/chat-wrapper";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  description: "Tableau de bord administrateur SAMUEL ET'00 - Gestion des utilisateurs et documents.",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [totalUsers, pendingApprovals, totalDeposits, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { status: { in: ["PENDING", "UNDER_REVIEW"] } },
    }),
    prisma.financialDetail.count(),
    prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        role: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      <AdminDashboardContent 
        totalUsers={totalUsers} 
        pendingApprovals={pendingApprovals} 
        totalDeposits={totalDeposits} 
        users={users} 
      />
      <ChatWrapper userId={session.user.id} userRole={session.user.role} />
    </>
  );
}
