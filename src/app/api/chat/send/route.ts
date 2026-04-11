import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { content, userId } = body;

  if (!content) {
    return Response.json({ error: "Missing content" }, { status: 400 });
  }

  // Determine target user (receiver)
  let targetUserId = session.user.id;
  
  if (session.user.role === "USER") {
    // Users always chat with admin
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true }
    });
    if (!admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }
    targetUserId = admin.id;
  } else if (session.user.role === "ADMIN" && userId) {
    // Admin chats with specific user
    targetUserId = userId;
  }

  // Find conversation for the sender (the one who is messaging)
  let conversation = await prisma.conversation.findFirst({
    where: { userId: session.user.id },
  });

  // Create conversation if doesn't exist
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: session.user.id },
    });
  }

  try {
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.user.id,
        receiverId: targetUserId,
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

    // Create notification for receiver (if not sending to self)
    if (targetUserId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          title: "New Message",
          message: `You have a new message from ${session.user.fullName || "a user"}`,
        },
      });
    }

    return Response.json({ success: true, message });
  } catch (error) {
    console.error("Failed to send message:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}