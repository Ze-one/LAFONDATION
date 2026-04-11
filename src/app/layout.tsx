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
      >
        <div 
          className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10"
        />
        <div 
          className="fixed inset-0 bg-black/75 -z-10 hidden sm:block"
          style={{ backgroundImage: 'url(/images/background.png.jfif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
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
