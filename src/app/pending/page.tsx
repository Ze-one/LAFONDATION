"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function PendingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (!session?.user?.id) {
    router.push("/login");
    return null;
  }

  if (session.user.status === "APPROVED") {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold">Account Pending Approval</h1>
        <p className="text-slate-400">
          Your account is currently under review. You will receive a notification once your account has been approved.
        </p>
        <p className="text-sm text-slate-500">
          Current status: <span className="font-semibold">{session.user.status}</span>
        </p>
        <Button 
          variant="outline" 
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </main>
  );
}