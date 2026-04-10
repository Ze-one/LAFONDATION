"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCenter } from "./upload-center";
import { LogoutButton } from "./logout-button";
import { NotificationCenter } from "./notification-center";

export function DashboardContent({ 
  user, 
  otherDocs, 
  signedReceipt, 
  certificate 
}: { 
  user: any; 
  otherDocs: any[]; 
  signedReceipt: any; 
  certificate: any;
}) {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-dvh bg-gradient-to-b from-secondary/40 to-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t("welcome")}, {user.fullName} 👋</h1>
              <NotificationCenter
                initialStatus={user.status}
                initialNotifications={user.notifications.map((n: any) => ({
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
              <CardTitle>{t("downloadReceipt")}</CardTitle>
              <CardDescription>
                Genere un PDF avec vos informations d&apos;inscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/api/receipt" download>
                  {t("download")} (.pdf)
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Deposez vos documents</CardTitle>
              <CardDescription>
                Recu signe, certificat et autres documents demandes par l&apos;admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadCenter
                signedReceiptStatus={signedReceipt?.status ?? "PENDING"}
                certificateStatus={certificate?.status ?? "PENDING"}
                otherDocs={otherDocs.map((doc: any) => ({
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