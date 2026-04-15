import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ notifications: [] });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return Response.json({
      notifications: notifications.map(n => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch {
    return Response.json({ notifications: [] });
  }
}