import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import archiver from "archiver";
import { Readable } from "stream";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const documents = await prisma.document.findMany({
    where: { userId: id },
  });

  if (documents.length === 0) {
    return NextResponse.json({ error: "No documents found" }, { status: 404 });
  }

  const archive = archiver("zip", { zlib: { level: 9 } });

  for (const doc of documents) {
    // Assuming fileUrl is a local path or URL
    // For demo, just add a placeholder
    archive.append(`Placeholder content for ${doc.fileName}`, { name: doc.fileName });
  }

  const webStream = Readable.toWeb(archive as Readable);
  // @ts-expect-error - webStream type mismatch
  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="user-${id}-documents.zip"`,
    },
  });
}