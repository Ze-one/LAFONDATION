import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "abdelsamad0416@gmail.com";
  const passwordHash = await bcrypt.hash("Ze.o.n.e.001", 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      fullName: "Zeone001",
      password: passwordHash,
      role: "ADMIN",
      status: "APPROVED",
    },
    create: {
      fullName: "Zeone001",
      email,
      password: passwordHash,
      role: "ADMIN",
      status: "APPROVED",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
