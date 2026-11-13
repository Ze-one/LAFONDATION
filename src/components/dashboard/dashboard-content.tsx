"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCenter } from "./upload-center";
import { NotificationCenter } from "./notification-center";
import { ProfileMenu } from "@/components/profile-menu";
import { Status, DocStatus } from "@prisma/client";

interface UserDoc {
  id: string;
  fileName: string;
  fileUrl: string;
  type: string;
  status: DocStatus;
  createdAt: Date;
}

interface UserNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  status: Status;
  role: string;
  city: string | null;
  address: string | null;
  language: string;
  theme: string;
  createdAt: Date;
  documents: UserDoc[];
  notifications: UserNotification[];
}

interface OtherDoc {
  id: string;
  label: string;
  status: DocStatus;
}

interface CustomRequest {
  id: string;
  name: string;
  status: string;
}

export function DashboardContent({ 
  user, 
  otherDocs, 
  signedReceipt, 
  certificate,
  customRequests = []
}: { 
  user: User; 
  otherDocs: OtherDoc[]; 
  signedReceipt: OtherDoc | null; 
  certificate: OtherDoc | null;
  customRequests?: CustomRequest[];
}) {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-dvh bg-[#f1f0eb] px-4 py-10 text-[#171717] sm:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-3xl bg-[#171717] p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t("welcome")}, {user.fullName} 👋</h1>
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
            <ProfileMenu userName={user.fullName} userRole={user.role} />
          </div>
        </header>

        <div className="grid gap-6">
          <Card className="border-black/10 bg-[#fbfbf8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f6e900] hover:shadow-xl">
            <CardHeader>
              <CardTitle>{t("downloadReceipt")}</CardTitle>
              <CardDescription>
                {t("generatePdfInfo")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-[#f6e900] text-[#171717] hover:bg-[#171717] hover:text-white">
                <a href="/api/receipt" download>
                  {t("download")} (.pdf)
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-black/10 bg-[#fbfbf8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f6e900] hover:shadow-xl">
            <CardHeader>
              <CardTitle>{t("uploadDocumentsTitle")}</CardTitle>
              <CardDescription>
                {t("uploadDocumentsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadCenter
                signedReceiptStatus={signedReceipt?.status ?? "PENDING"}
                certificateStatus={certificate?.status ?? "PENDING"}
                otherDocs={otherDocs.map((doc) => ({
                  id: doc.id,
                  label: doc.label,
                  status: doc.status,
                }))}
                customRequests={customRequests}
              />
            </CardContent>
          </Card>

          {customRequests.length > 0 && (
            <Card className="transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader>
                <CardTitle>Custom Document Requests</CardTitle>
                <CardDescription>
                  Additional documents requested by admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customRequests.map((req) => (
                    <div key={req.id} className="flex justify-between items-center border border-slate-700 rounded p-3">
                      <span className="text-white">{req.name}</span>
                      <span className={`text-sm ${req.status === "COMPLETED" ? "text-green-400" : "text-yellow-400"}`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
