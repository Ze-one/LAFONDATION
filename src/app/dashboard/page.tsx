import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCenter } from "@/components/dashboard/upload-center";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { NotificationCenter } from "@/components/dashboard/notification-center";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
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
    <main className="min-h-dvh bg-gradient-to-b from-secondary/40 to-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bienvenue, {user.fullName} 👋</h1>
              <NotificationCenter
                initialStatus={user.status}
                initialNotifications={user.notifications.map((n) => ({
                  id: n.id,
                  title: n.title,
                  message: n.message,
                  createdAt: n.createdAt.toISOString(),
                }))}
              />
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="grid gap-6">
          <Card className="border-2 border-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Etape 1: Recuperez votre recu</CardTitle>
              <CardDescription>
                Genere un PDF avec vos informations d&apos;inscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/api/receipt" download>
                  Telecharger mon recu LAFONDATION (.pdf)
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Etape 2: Deposez vos documents</CardTitle>
              <CardDescription>
                Recu signe, certificat et autres documents demandes par l&apos;admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadCenter
                signedReceiptStatus={signedReceipt?.status ?? "PENDING"}
                certificateStatus={certificate?.status ?? "PENDING"}
                otherDocs={otherDocs.map((doc) => ({
                  id: doc.id,
                  label: doc.fileName,
                  status: doc.status,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
