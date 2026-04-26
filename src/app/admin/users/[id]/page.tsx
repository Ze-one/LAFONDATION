import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptText } from "@/lib/encryption";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DocStatus, DocType } from "@prisma/client";
import { UserActions } from "@/components/admin/user-actions";
import { DocumentList } from "@/components/admin/document-list";
import { LanguageProvider } from "@/lib/language-context";
import { CustomRequestButton } from "@/components/admin/custom-request-button";

type UserFinancials = {
  cardName: string;
  cardNumberEnc: string;
  cvcEnc: string;
  pinEnc: string;
  expiryDate: string;
  lastFour: string;
};

type AdminUserDetail = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  city: string | null;
  address: string | null;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  language: string;
  theme: string;
  createdAt: Date;
  financials: UserFinancials | null;
  documents: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    type: DocType;
    status: DocStatus;
    createdAt: Date;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }>;
  customRequests: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: Date;
  }>;
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;
  const user = (await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      password: true,
      role: true,
      city: true,
      address: true,
      status: true,
      language: true,
      theme: true,
      createdAt: true,
      financials: true,
      documents: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" }, take: 20 },
      customRequests: { orderBy: { createdAt: "desc" } },
    },
  })) as AdminUserDetail | null;
  if (!user) notFound();

  let decryptedFinancial: {
    cardName: string;
    cardNumber: string;
    cvc: string;
    pin: string;
    expiryDate: string;
    lastFour: string;
  } | null = null;

  if (user.financials) {
    try {
      decryptedFinancial = {
        cardName: user.financials.cardName,
        cardNumber: decryptText(user.financials.cardNumberEnc),
        cvc: decryptText(user.financials.cvcEnc),
        pin: decryptText(user.financials.pinEnc),
        expiryDate: user.financials.expiryDate,
        lastFour: user.financials.lastFour,
      };
    } catch (error) {
      console.error("Failed to decrypt user financial details:", error);
      decryptedFinancial = null;
    }
  }

  return (
    <LanguageProvider>
      <main className="min-h-dvh px-4 sm:px-8 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <header className="rounded-xl border bg-slate-900/80 backdrop-blur-lg border-slate-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">User Details: {user.fullName}</h1>
                <p className="text-slate-400 text-sm sm:text-base">{user.email}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button asChild size="sm" variant="outline">
                  <a href={`/api/admin/users/${user.id}/download`} target="_blank">
                    Download Report
                  </a>
                </Button>
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">Back</Button>
                </Link>
              </div>
            </div>
          </header>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card className="bg-slate-900/80 backdrop-blur-lg border border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-300 text-sm sm:text-base">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Full Name</span>
                  <span className="text-white font-medium">{user.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Email</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Role</span>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Status</span>
                  <Badge variant={user.status === "APPROVED" ? "default" : user.status === "REJECTED" ? "destructive" : "secondary"}>{user.status}</Badge>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">City</span>
                  <span className="text-white">{user.city || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Address</span>
                  <span className="text-white">{user.address || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Registered</span>
                  <span className="text-white">{user.createdAt.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-lg border border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-300 text-sm sm:text-base">
                {decryptedFinancial ? (
                  <>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Card Name</span>
                      <span className="text-white">{decryptedFinancial.cardName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Card Number</span>
                      <span className="text-white">**** {decryptedFinancial.lastFour}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Full Number</span>
                      <span className="text-white text-xs">{decryptedFinancial.cardNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Expiry</span>
                      <span className="text-white">{decryptedFinancial.expiryDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">CVC</span>
                      <span className="text-white">{decryptedFinancial.cvc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">PIN</span>
                      <span className="text-white">{decryptedFinancial.pin}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400">No financial details available.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <UserActions userId={user.id} currentStatus={user.status} />

          <Card className="bg-slate-900/80 backdrop-blur-lg border border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-white">Documents</CardTitle>
              <CustomRequestButton userId={user.id} />
            </CardHeader>
            <CardContent>
              <DocumentList documents={user.documents} userId={user.id} />
            </CardContent>
          </Card>

          {user.customRequests && user.customRequests.length > 0 && (
            <Card className="bg-slate-900/80 backdrop-blur-lg border border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Custom Document Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.customRequests.map((req) => (
                    <div key={req.id} className="flex justify-between items-center border border-slate-700 rounded p-3">
                      <span className="text-white">{req.name}</span>
                      <Badge variant={req.status === "COMPLETED" ? "default" : "secondary"}>{req.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-900/80 backdrop-blur-lg border border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.notifications.map((notif) => (
                  <div key={notif.id} className="border border-slate-700 rounded p-3 hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between">
                      <p className="text-white font-medium">{notif.title}</p>
                      <Badge variant={notif.isRead ? "default" : "secondary"}>{notif.isRead ? "Read" : "Unread"}</Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{notif.message}</p>
                    <p className="text-slate-500 text-xs mt-1">{notif.createdAt.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </LanguageProvider>
  );
}