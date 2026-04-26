const FALLBACK_NEXTAUTH_SECRET = "MaFondationSecurisee2026!@#SuperSecret";

export const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? FALLBACK_NEXTAUTH_SECRET;
