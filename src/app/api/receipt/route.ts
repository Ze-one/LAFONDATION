import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { renderToBuffer } from "@react-pdf/renderer";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReceiptDocument } from "@/lib/pdf/receipt-document";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      documents: { where: { type: "RECEIPT" }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const transactionId =
    user.documents[0]?.fileName.match(/LAFONDATION-receipt-(.*)\.pdf/)?.[1] ?? `LAF-${user.id.slice(0, 8).toUpperCase()}`;

  const pdfBuffer = await renderToBuffer(
    ReceiptDocument({
      transactionId,
      fullName: user.fullName,
      email: user.email,
      addressLine1: user.address ?? "N/A",
      addressLine2: undefined,
      city: user.city ?? "N/A",
      postalCode: "N/A",
      country: "N/A",
      issuedAt: user.createdAt.toISOString(),
    })
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="LAFONDATION-receipt-${transactionId}.pdf"`,
    },
  });
}
