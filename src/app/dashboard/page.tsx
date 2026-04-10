import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCenter } from "@/components/dashboard/upload-center";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { NotificationCenter } from "@/components/dashboard/notification-center";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const otherDocs = user.documents.filter((d) => d.type === "OTHER");
  const signedReceipt = user.documents.find((d) => d.type === "RECEIPT");
  const certificate = user.documents.find((d) => d.type === "CERTIFICATE");

  return (
    <DashboardContent 
      user={user} 
      otherDocs={otherDocs} 
      signedReceipt={signedReceipt} 
      certificate={certificate} 
    />
  );
}
