"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      onClick={() => setLanguage(language === "en" ? "fr" : "en")}
    >
      {language === "en" ? "FR" : "EN"}
    </Button>
  );
}