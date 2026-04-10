import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "@/components/admin/user-table";
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";

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
    <AdminDashboardContent 
      totalUsers={totalUsers} 
      pendingApprovals={pendingApprovals} 
      totalDeposits={totalDeposits} 
      users={users} 
    />
  );
}
