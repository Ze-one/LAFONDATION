import bcrypt from "bcryptjs";
import { Role, Status } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { nextAuthSecret } from "@/lib/auth-secret";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: nextAuthSecret,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password;
          
          if (!email || !password) {
            console.error("AUTH_ERROR: Missing credentials");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              fullName: true,
              status: true,
              role: true,
            },
          });
          
          if (!user) {
            console.error("AUTH_ERROR: User not found", email);
            return null;
          }

          let matches = false;
          try {
            matches = await bcrypt.compare(password, user.password);
          } catch {
            matches = false;
          }

          // Backward-compatible login: allow legacy plaintext passwords and upgrade to hash.
          if (!matches && user.password === password) {
            const upgradedHash = await bcrypt.hash(password, 12);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: upgradedHash },
            });
            matches = true;
          }

          if (!matches) {
            console.error("AUTH_ERROR: Password mismatch", email);
            return null;
          }

          console.log("AUTH_SUCCESS: User logged in", user.email);
          
          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            fullName: user.fullName,
            status: user.status,
            role: user.role,
          };
        } catch (error) {
          console.error("AUTH_ERROR: Exception in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === baseUrl) return url;
      } catch {
        return `${baseUrl}/dashboard`;
      }
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.fullName = user.fullName ?? user.name ?? "";
        token.status = user.status ?? "PENDING";
        token.role = user.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = String(token.userId ?? "");
      session.user.fullName = String(token.fullName ?? "");
      session.user.status = (token.status as Status) ?? "PENDING";
      session.user.role = (token.role as Role) ?? "USER";
      return session;
    },
  },
};