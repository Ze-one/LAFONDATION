"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/lib/language-context";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("welcome") },
    { href: "/login", label: t("login") },
    { href: "/register", label: t("register") },
    { href: "/dashboard", label: t("dashboard") },
    { href: "/admin/dashboard", label: t("adminPanel") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link 
            href="/" 
            className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 hover:scale-110 hover:rotate-2 transition-transform duration-500"
          >
            <Image
              src="/images/logo.png.png"
              alt="LAFONDATION"
              fill
              className="object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.slice(0, -2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                  isActive(link.href) ? "text-blue-400" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-slate-200/70 md:hidden py-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}