import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  debug: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 24 * 60 * 60,
      },
    },
  },
});

export { handler as GET, handler as POST };
