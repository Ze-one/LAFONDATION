import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-background/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                LAFONDATION
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
