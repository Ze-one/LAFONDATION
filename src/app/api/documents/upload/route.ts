import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const typeSchema = z.enum(["RECEIPT", "CERTIFICATE", "OTHER"]);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const typeRaw = formData.get("type");
  const labelRaw = formData.get("label");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const parsedType = typeSchema.safeParse(typeRaw);
  if (!parsedType.success) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  const label = typeof labelRaw === "string" && labelRaw.trim() ? labelRaw.trim() : file.name;
  const fileUrl = `uploaded://${Date.now()}-${file.name}`;

  await prisma.document.create({
    data: {
      userId: session.user.id,
      fileName: label,
      fileUrl,
      type: parsedType.data,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true });
}
