import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: userId } = await params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const customRequest = await prisma.customRequest.create({
      data: {
        userId,
        name: parsed.data.name,
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: "Document Request",
        message: `A new document has been requested: ${parsed.data.name}`,
      },
    });

    return NextResponse.json({ ok: true, request: customRequest });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}