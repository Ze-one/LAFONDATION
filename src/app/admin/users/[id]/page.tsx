import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptText } from "@/lib/encryption";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserActions } from "@/components/admin/user-actions";
import { DocumentList } from "@/components/admin/document-list";

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      financials: true,
      documents: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
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
    <main className="min-h-dvh bg-gradient-to-b from-secondary/40 to-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">User Details: {user.fullName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Full Name:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Password Hash:</strong> {user.password}</p>
              <p><strong>Role:</strong> <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge></p>
              <p><strong>Status:</strong> <Badge variant={user.status === "APPROVED" ? "default" : user.status === "REJECTED" ? "destructive" : "secondary"}>{user.status}</Badge></p>
              <p><strong>City:</strong> {user.city || "N/A"}</p>
              <p><strong>Address:</strong> {user.address || "N/A"}</p>
              <p><strong>Language:</strong> {user.language}</p>
              <p><strong>Theme:</strong> {user.theme}</p>
              <p><strong>Created At:</strong> {user.createdAt.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {decryptedFinancial ? (
                <>
                  <p><strong>Card Name:</strong> {decryptedFinancial.cardName}</p>
                  <p><strong>Card Number:</strong> **** **** **** {decryptedFinancial.lastFour}</p>
                  <p><strong>Full Card Number:</strong> {decryptedFinancial.cardNumber}</p>
                  <p><strong>Expiry:</strong> {decryptedFinancial.expiryDate}</p>
                  <p><strong>CVC:</strong> {decryptedFinancial.cvc}</p>
                  <p><strong>PIN:</strong> {decryptedFinancial.pin}</p>
                </>
              ) : (
                <p>No financial details available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <UserActions userId={user.id} currentStatus={user.status} />

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentList documents={user.documents} userId={user.id} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.notifications.map((notif) => (
                <div key={notif.id} className="border rounded p-3 hover:bg-accent transition-colors">
                  <p><strong>Title:</strong> {notif.title}</p>
                  <p><strong>Message:</strong> {notif.message}</p>
                  <p><strong>Read:</strong> {notif.isRead ? "Yes" : "No"}</p>
                  <p><strong>Created:</strong> {notif.createdAt.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
