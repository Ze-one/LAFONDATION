"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr";

const translations = {
  en: {
    welcome: "Bienvenue",
    createAccount: "Create your account",
    login: "Login",
    logout: "Logout",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    address: "Address",
    city: "City",
    country: "Country",
    submit: "Submit",
    continue: "Continue",
    back: "Back",
    step: "Step",
    download: "Download",
    downloadReceipt: "Download receipt",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    userManagement: "User Management",
    pendingVerifications: "Pending Verifications",
    totalUsers: "Total Users",
    totalDeposits: "Total Deposits",
    submitAndDownload: "Submit & download receipt",
    submitting: "Submitting...",
    uploadDocuments: "Upload Documents",
    accountCreated: "Account created!",
    networkError: "Network error. Try again.",
    startRegistration: "Start registration",
    register: "Register",
    onboarding: "Onboarding",
    tagline: "Register, receive your receipt, and complete onboarding from your dashboard.",
    ourMission: "Our Mission",
    entrepreneurship: "Youth Entrepreneurship Funding",
    objectives: "Our Objectives",
    togetherWeCan: "Together we can make a difference",
    collaborate: "Want to collaborate or learn more about our activities?",
  },
  fr: {
    welcome: "Bienvenue",
    createAccount: "Créez votre compte",
    login: "Connexion",
    logout: "Déconnexion",
    email: "Email",
    password: "Mot de passe",
    fullName: "Nom complet",
    address: "Adresse",
    city: "Ville",
    country: "Pays",
    submit: "Soumettre",
    continue: "Continuer",
    back: "Retour",
    step: "Étape",
    download: "Télécharger",
    downloadReceipt: "Télécharger le reçu",
    dashboard: "Tableau de bord",
    adminPanel: "Panneau Admin",
    userManagement: "Gestion des utilisateurs",
    pendingVerifications: "Vérifications en attente",
    totalUsers: "Total utilisateurs",
    totalDeposits: "Total dépôts",
    submitAndDownload: "Soumettre & télécharger le reçu",
    submitting: "Soumission...",
    uploadDocuments: "Déposer les documents",
    accountCreated: "Compte créé !",
    networkError: "Erreur réseau. Réessayez.",
    startRegistration: "Commencer l'inscription",
    register: "S'inscrire",
    onboarding: "Inscription",
    tagline: "Inscrivez-vous, recevez votre reçu et complétez votre inscription depuis votre tableau de bord.",
    ourMission: "Notre Mission",
    entrepreneurship: "Financement de l'Entrepreneuriat Jeune",
    objectives: "Nos Objectifs",
    togetherWeCan: "Ensemble nous pouvons faire la différence",
    collaborate: "Vous souhaitez collaborer ou en savoir plus sur nos activités ?",
  },
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: "en" as Language, setLanguage: () => {}, t: (key: TranslationKey) => key };
  }
  return context;
}