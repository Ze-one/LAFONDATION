import bcrypt from "bcryptjs";
import { Role, Status } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const nextAuthUrl =
  process.env.NEXTAUTH_URL ??
  process.env.URL ??
  process.env.DEPLOY_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://laf0ndation.netlify.app");

const nextAuthSecret =
  process.env.NEXTAUTH_SECRET ??
  "MaFondationSecurisee2026!@#SuperSecret";

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = nextAuthUrl;
}

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = nextAuthSecret;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
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
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

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
        if (!user) return null;

        const matches = await bcrypt.compare(password, user.password);
        if (!matches) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          fullName: user.fullName,
          status: user.status,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.fullName = (user as { fullName?: string }).fullName ?? user.name ?? "";
        token.status = ((user as { status?: Status }).status as Status | undefined) ?? "PENDING";
        token.role = ((user as { role?: Role }).role as Role | undefined) ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = String(token.userId ?? "");
      session.user.fullName = String(token.fullName ?? session.user.name ?? "");
      session.user.status = (token.status as Status | undefined) ?? "PENDING";
      session.user.role = (token.role as Role | undefined) ?? "USER";
      return session;
    },
    async redirect({ url, baseUrl, user }) {
      if (user?.role === "ADMIN") {
        return `${baseUrl}/admin/dashboard`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};
