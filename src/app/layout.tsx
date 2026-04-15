import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/app/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LAFONDATION | Officiel FECAFOOT",
    template: "%s | FECAFOOT",
  },
  description: "Bienvenue à la fondation FECAFOOT - Plateforme de gestion et d'inscription",
  verification: {
    google: "gmxRo3fnXDLAGU_pQ_gjdN0g1h8NS0F6_6OCGQPeusY",
  },
  metadataBase: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL) : undefined,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lafondation.vercel.app",
    siteName: "LAFONDATION FECAFOOT",
    title: "LAFONDATION | Officiel FECAFOOT",
    description: "Bienvenue à la fondation FECAFOOT - Plateforme de gestion et d'inscription",
    images: [
      {
        url: "/images/logo-primary.png.jfif",
        width: 1200,
        height: 630,
        alt: "LAFONDATION FECAFOOT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LAFONDATION | Officiel FECAFOOT",
    description: "Bienvenue à la fondation FECAFOOT - Plateforme de gestion et d'inscription",
    images: ["/images/logo-primary.png.jfif"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh font-sans`}
      >
        <div 
          className="fixed inset-0 bg-slate-950 -z-10"
        />
        <div 
          className="fixed inset-0 bg-black/90 -z-10"
          style={{ backgroundImage: 'url(/images/background.png.jfif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.4 }}
        />
        <Providers>
          <LanguageProvider>
            <Navbar />
            {children}
          </LanguageProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
