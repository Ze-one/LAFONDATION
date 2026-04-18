"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      console.log("Login attempt, callbackUrl:", callbackUrl);
      
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: callbackUrl,
      });
      
      console.log("signIn result:", res);
      setLoading(false);

      if (res?.error) {
        console.error("Login Error:", res.error);
        setError("Email ou mot de passe invalide");
        return;
      }

      if (res?.ok) {
        console.log("Login successful, redirecting to:", callbackUrl);
        window.location.replace(callbackUrl);
      }
    } catch (err) {
      setLoading(false);
      console.error("Login exception:", err);
      setError("Une erreur est survenue");
    }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-blue-500/20">
      <CardHeader>
        <CardTitle>{t("loginTitle")}</CardTitle>
        <CardDescription>{t("loginDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("loginLoading") : t("loginButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
