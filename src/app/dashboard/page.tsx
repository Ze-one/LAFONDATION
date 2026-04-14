import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { ChatWrapper } from "@/components/chat/chat-wrapper";
import { DocType } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Gérez vos documents, inscriptions et activités FECAFOOT.",
};

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

  const otherDocs = user.documents.filter((d) => d.type === DocType.OTHER).map((d) => ({
    id: d.id,
    label: d.fileName,
    status: d.status,
  }));
  const signedReceipt = user.documents.find((d) => d.type === DocType.RECEIPT);
  const certificate = user.documents.find((d) => d.type === DocType.CERTIFICATE);

  return (
    <>
      <DashboardContent 
        user={user} 
        otherDocs={otherDocs} 
        signedReceipt={signedReceipt ? { id: signedReceipt.id, label: signedReceipt.fileName, status: signedReceipt.status } : null} 
        certificate={certificate ? { id: certificate.id, label: certificate.fileName, status: certificate.status } : null} 
      />
      <ChatWrapper userId={user.id} userRole={user.role} />
    </>
  );
}
