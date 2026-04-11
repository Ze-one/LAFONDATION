import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
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
  title: "LAFONDATION | FECAF00T",
  description: "Document management and user onboarding",
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
        style={{ backgroundImage: 'url(/images/background.png.jfif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="fixed inset-0 bg-black/60 -z-10" />
        <Providers>
          <LanguageProvider>
            <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-background/95 backdrop-blur-sm">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
                <Link href="/" className="relative w-8 h-8 hover:scale-110 hover:rotate-2 transition-transform duration-500">
                  <Image
                    src="/images/logo.png.png"
                    alt="LAFONDATION"
                    fill
                    className="object-contain"
                  />
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </div>
            {children}
          </LanguageProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
