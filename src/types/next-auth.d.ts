import { Role, Status } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName: string;
      status: Status;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    fullName?: string;
    status?: Status;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    fullName?: string;
    status?: Status;
    role?: Role;
  }
}
