import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { receiverId, content, userId } = body;

  if (!content) {
    return Response.json({ error: "Missing content" }, { status: 400 });
  }

  // If user is sending to admin, find the admin
  let targetUserId = receiverId;
  if (session.user.role === "USER" && !receiverId) {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true }
    });
    if (!admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }
    targetUserId = admin.id;
  }

  // If admin is sending to user, use the provided userId
  if (session.user.role === "ADMIN" && userId) {
    targetUserId = userId;
  }

  // Find or create conversation for this user
  let conversation = await prisma.conversation.findFirst({
    where: { userId: session.user.id },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: session.user.id },
    });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      receiverId: targetUserId || session.user.id,
      content,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      lastMessage: content.slice(0, 100),
      updatedAt: new Date(),
    },
  });

  // Create notification for receiver
  if (targetUserId && targetUserId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        title: "New Message",
        message: `You have a new message from ${session.user.fullName || "a user"}`,
      },
    });
  }

  return Response.json({ success: true, message });
}