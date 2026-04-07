import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  note: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { id } = await params;

  const updated = await prisma.document.update({
    where: { id },
    data: {
      status: parsed.data.status,
      adminNote: parsed.data.note,
    },
    include: { user: true },
  });

  if (parsed.data.status === "REJECTED") {
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: "Document rejeté",
        message: parsed.data.note?.trim()
          ? parsed.data.note
          : `Le document ${updated.fileName} a ete rejete. Merci de le corriger puis re-uploader.`,
      },
    });

    await prisma.user.update({
      where: { id: updated.userId },
      data: { status: "UNDER_REVIEW" },
    });
  }

  return NextResponse.json({ ok: true });
}
