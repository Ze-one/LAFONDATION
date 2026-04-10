"use client";

import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
      onClick={() => setLanguage(language === "en" ? "fr" : "en")}
    >
      {language === "en" ? "FR" : "EN"}
    </Button>
  );
}