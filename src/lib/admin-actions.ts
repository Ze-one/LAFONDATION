"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function approveUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

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

  revalidatePath(`/admin/users/${userId}`);
}

export async function rejectUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status: "REJECTED" },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "Account Rejected",
      message: "Your account has been rejected.",
    },
  });

  revalidatePath(`/admin/users/${userId}`);
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/dashboard");
}