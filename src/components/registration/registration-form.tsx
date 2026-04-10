"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

const STEPS = ["Identity", "Location", "Bank Info"] as const;

type FormState = {
  fullName: string;
  email: string;
  password: string;
  address: string;
  cardNumber: string;
  nameOnCard: string;
  cvc: string;
  expiry: string;
  accountPin: string;
  city: string;
  postalCode: string;
  country: string;
};

const initial: FormState = {
  fullName: "",
  email: "",
  password: "",
  address: "",
  cardNumber: "",
  nameOnCard: "",
  cvc: "",
  expiry: "",
  accountPin: "",
  city: "",
  postalCode: "",
  country: "FR",
};

function downloadPdfBase64(base64: string, filename: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const progress = useMemo(
    () => Math.round(((step + 1) / STEPS.length) * 100),
    [step]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep(s: number): boolean {
    if (s === 0) {
      if (form.fullName.trim().length < 2) {
        toast.error("Please enter your full name.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        toast.error("Please enter a valid email.");
        return false;
      }
      if (form.password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return false;
      }
    }
    if (s === 1) {
      if (!form.address.trim() || !form.city.trim()) {
        toast.error("Complete your location details.");
        return false;
      }
      if (form.country.trim().length !== 2) {
        toast.error("Use a 2-letter country code (e.g. FR).");
        return false;
      }
    }
    if (s === 2) {
      if (form.cardNumber.replace(/\s/g, "").length < 12) {
        toast.error("Check the card number.");
        return false;
      }
      if (form.nameOnCard.trim().length < 2) {
        toast.error("Enter the name on card.");
        return false;
      }
      if (form.cvc.length < 3) {
        toast.error("Enter a valid CVC.");
        return false;
      }
      if (form.expiry.trim().length < 4) {
        toast.error("Enter expiry (MM/YY).");
        return false;
      }
      if (form.accountPin.length < 4) {
        toast.error("PIN must be at least 4 characters.");
        return false;
      }
    }
    return true;
  }

  async function onSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          address: form.address.trim(),
          cardNumber: form.cardNumber.replace(/\s/g, ""),
          nameOnCard: form.nameOnCard.trim(),
          cvc: form.cvc,
          expiry: form.expiry.trim(),
          accountPin: form.accountPin,
          city: form.city.trim(),
          postalCode: form.postalCode.trim() || undefined,
          country: form.country.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Registration failed");
        return;
      }
      toast.success("Account created. Your receipt is downloading.");
      if (data.pdfBase64 && data.filename) {
        downloadPdfBase64(data.pdfBase64, data.filename);
      }
      setForm(initial);
      setStep(0);
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-lg border-border/80 shadow-md">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <span className="text-xs text-muted-foreground">
            Step {step + 1} / {STEPS.length}
          </span>
        </div>
        <CardDescription>
          {STEPS[step]} — data in transit is protected with HTTPS; financial
          fields are encrypted before storage.
        </CardDescription>
        <Progress value={progress} className="h-1.5" />
        <div className="flex flex-wrap gap-1.5">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => i < step && setStep(i)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-muted text-muted-foreground hover:bg-muted/80"
                    : "bg-secondary text-secondary-foreground/70"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {submitting ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal code (optional)</Label>
                    <Input
                      id="postalCode"
                      autoComplete="postal-code"
                      value={form.postalCode}
                      onChange={(e) => update("postalCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country (ISO-2)</Label>
                  <Input
                    id="country"
                    maxLength={2}
                    autoComplete="country"
                    value={form.country}
                    onChange={(e) =>
                      update("country", e.target.value.toUpperCase())
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
                  Production systems should tokenize card data (PCI DSS). This
                  demo encrypts at rest only.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    inputMode="numeric"
                    autoComplete="off"
                    value={form.cardNumber}
                    onChange={(e) => update("cardNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Name on card</Label>
                  <Input
                    id="nameOnCard"
                    autoComplete="cc-name"
                    value={form.nameOnCard}
                    onChange={(e) => update("nameOnCard", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      value={form.expiry}
                      onChange={(e) => update("expiry", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      inputMode="numeric"
                      autoComplete="off"
                      value={form.cvc}
                      onChange={(e) => update("cvc", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountPin">Account PIN</Label>
                  <Input
                    id="accountPin"
                    type="password"
                    autoComplete="new-password"
                    value={form.accountPin}
                    onChange={(e) => update("accountPin", e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={submitting || step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              disabled={submitting}
              onClick={() => {
                if (validateStep(step)) setStep((s) => s + 1);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button type="button" disabled={submitting} onClick={onSubmit}>
              {submitting ? t("submitting") : t("submitAndDownload")}
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="underline underline-offset-4">
            Back to home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
