import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const url = new URL(request.url);
  const targetUserId = url.searchParams.get("userId");

  if (session.user.role === "ADMIN" && targetUserId) {
    // Get conversation between admin and specific user
    const conversation = await prisma.conversation.findFirst({
      where: { userId: targetUserId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });
    
    const messages = conversation?.messages || [];
    return Response.json({ messages });
  }

  if (session.user.role === "ADMIN") {
    // For admin without userId, get all conversations
    const conversations = await prisma.conversation.findMany({
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return Response.json({ conversations });
  }

  // For regular users, get their messages
  const conversation = await prisma.conversation.findFirst({
    where: { userId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  const messages = conversation?.messages || [];

  const unreadCount = await prisma.message.count({
    where: {
      receiverId: session.user.id,
      isRead: false,
    },
  });

  return Response.json({ messages, unreadCount });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { messageIds } = body;

  if (messageIds && Array.isArray(messageIds)) {
    await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: session.user.id,
      },
      data: { isRead: true },
    });
  }

  return Response.json({ success: true });
}