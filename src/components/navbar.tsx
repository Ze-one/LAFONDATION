"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/lib/language-context";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  async function fetchNotifications() {
    if (!isAuthenticated) return;
    try {
      const [countRes, listRes] = await Promise.all([
        fetch("/api/notifications/count"),
        fetch("/api/notifications/list"),
      ]);
      const countData = await countRes.json();
      const listData = await listRes.json();
      setUnreadCount(countData.count || 0);
      setNotifications(listData.notifications || []);
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    }
  }

  async function markAsRead() {
    if (!isAuthenticated) return;
    try {
      await fetch("/api/notifications/read", { method: "POST" });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  }

  const showNav = !pathname.startsWith("/login") && !pathname.startsWith("/register") && !pathname.startsWith("/dashboard") && !pathname.startsWith("/admin");

  if (!showNav) {
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
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
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

          <div className="hidden md:flex items-center gap-2">
            {navLinks.slice(0, -2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                  isActive(link.href) ? "text-blue-400" : "text-slate-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAsRead(); }}
                  className="relative p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.352 2.352 0 0118 15.171V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v4.171a2.352 2.352 0 01-.405 1.424l-1.405 1.405m12.728 0a2 2 0 00-2.828-2.828l-1.414 1.414a2 2 0 01-2.828 0L8 10.586" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <span className="text-xs text-slate-400">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-slate-400 text-center">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div key={notif.id} className={`p-3 border-b border-slate-800 hover:bg-slate-800/50 ${!notif.isRead ? "bg-blue-500/5" : ""}`}>
                            <p className="text-sm font-medium text-white">{notif.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    {(pathname === "/dashboard" || pathname === "/admin/dashboard") && (
                      <Link href={pathname} onClick={() => setShowNotifications(false)} className="block p-2 text-center text-sm text-blue-400 hover:text-blue-300 border-t border-slate-700">
                        View all in dashboard
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && (
              <button
                onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAsRead(); }}
                className="relative p-2 rounded-md text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.352 2.352 0 0118 15.171V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v4.171a2.352 2.352 0 01-.405 1.424l-1.405 1.405m12.728 0a2 2 0 00-2.828-2.828l-1.414 1.414a2 2 0 01-2.828 0L8 10.586" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
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
          <div className="border-t border-slate-800 md:hidden py-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-400 hover:bg-slate-800"
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