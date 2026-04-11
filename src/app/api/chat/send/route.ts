import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { receiverId, content } = body;

  if (!receiverId || !content) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  let conversation = await prisma.conversation.findFirst({
    where: { userId: receiverId },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: receiverId },
    });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      receiverId,
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

  await prisma.notification.create({
    data: {
      userId: receiverId,
      title: "New Message",
      message: `You have a new message from ${session.user.fullName || "a user"}`,
    },
  });

  return Response.json({ success: true, message });
}