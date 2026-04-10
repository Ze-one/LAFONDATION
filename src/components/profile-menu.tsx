"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileMenuProps {
  userName?: string;
  userRole?: string;
}

export function ProfileMenu({ userName = "User", userRole = "USER" }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full border-2 border-blue-500/50 hover:border-blue-400"
        onClick={() => setOpen(!open)}
      >
        <User className="h-5 w-5" />
      </Button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-700 bg-slate-900/95 backdrop-blur p-2 shadow-lg z-50">
          <div className="border-b border-slate-700 pb-2 mb-2 px-2">
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-slate-400">{userRole}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}