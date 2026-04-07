"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function approveUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const userId = formData.get("userId") as string;
  if (!userId) throw new Error("User ID required");

  await prisma.user.update({
    where: { id: userId },
    data: { status: "APPROVED" },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "Account Approved",
      message: "Your account has been approved.",
    },
  });

  revalidatePath("/admin/dashboard");
}