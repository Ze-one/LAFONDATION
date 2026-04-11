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
    joinFoundation: "Join Our Foundation",
    fundesport: "Fundesport - Football Academy",
    fundesportDesc: "Declared of public utility on April 1, 2023 by the President of the Republic of Cameroon, Fundesport includes four training centers in Cameroon (Douala, Yaoundé, Limbé, Bamenda) and one in Gabon (Libreville). Our goal is to offer the best opportunities to young African athletes using football as a means of economic, cultural and social development.",
    humanitarian: "Humanitarian Actions",
    humanitarianDesc: "The foundation has contributed to the development of five orphanages in Cameroon and partnered with USP Fundacion Alex (Barcelona) to provide hospital care to Cameroonian children. We also use sports as a means to help integrate disabled and mentally challenged children.",
    missionDesc: "The Samuel Eto'o Private Foundation, created in March 2006, is a non-profit organization dedicated to protecting children and disadvantaged youth. We provide emergency aid, promote education and health, and support the social integration of the most vulnerable to offer them a more promising future.",
    entrepreneurshipDesc: "Because charity is not enough to develop a continent, the foundation focuses on autonomy. We offer a support program for local project holders and startups with seed capital, mentoring by experts, and support for innovative digital projects for sustainable economic development.",
    obj1: "Build schools, health centers and sports facilities",
    obj2: "Offer scholarships and vocational training",
    obj3: "Organize football camps and recreational activities",
    obj4: "Support vulnerable families and the elderly",
    obj5: "Award 80 annual scholarships to talented students",
    obj6: "Contribute to distribution of computer equipment",
    stepIdentity: "Identity",
    stepLocation: "Location",
    stepBankInfo: "Bank Info",
    dataInTransitProtected: "data in transit is protected with HTTPS; financial fields are encrypted before storage.",
    errorFullName: "Please enter your full name.",
    errorEmail: "Please enter a valid email.",
    errorPassword: "Password must be at least 8 characters.",
    errorCompleteAddress: "Complete your location details.",
    errorCountryCode: "Use a 2-letter country code (e.g. FR).",
    errorCardNumber: "Check the card number.",
    errorNameOnCard: "Enter the name on card.",
    errorCVC: "Enter a valid CVC.",
    errorExpiry: "Enter expiry (MM/YY).",
    errorPIN: "PIN must be at least 4 characters.",
    pciWarning: "Production systems should tokenize card data (PCI DSS). This demo encrypts at rest only.",
    postalCode: "Postal code (optional)",
    loginTitle: "Login",
    loginDesc: "Login to access your dashboard.",
    invalidCredentials: "Email or password invalid.",
    loginButton: "Login",
    loginLoading: "Logging in...",
    backToHome: "Back to home",
    generatePdfInfo: "Generate a PDF with your registration information.",
    uploadDocumentsTitle: "Upload your documents",
    uploadDocumentsDesc: "Signed receipt, certificate and other documents requested by admin.",
    status: "Status",
    pending: "Pending",
    verified: "Verified",
    rejected: "Rejected",
    upload: "Upload",
    uploading: "Uploading...",
    signedReceipt: "Signed LAFONDATION receipt",
    certificate: "Registration certificate",
    otherDocuments: "Other documents (Admin)",
    additionalDocsRequested: "Additional documents requested by admin",
    noAdditionalDocs: "No additional documents requested for the moment.",
    addAnotherDoc: "Add another document",
    otherDocument: "Other document",
    cloudStorageNote: "Cloud storage can be connected later (S3/Uploadthing).",
    cardNumber: "Card number",
    nameOnCard: "Name on card",
    cvc: "CVC",
    expiry: "Expiry",
    accountPin: "Account PIN",
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
    joinFoundation: "Rejoindre Notre Fondation",
    fundesport: "Fundesport - Académie de Football",
    fundesportDesc: "Déclarée d'utilité publique le 1er avril 2023 par le Président de la République du Cameroun, Fundesport comprend quatre centres de formation au Cameroun (Douala, Yaoundé, Limbé, Bamenda) et un au Gabon (Libreville). Notre objectif est d'offrir les meilleures opportunités aux jeunes athlètes africains en utilisant le football comme moyen de développement économique, culturel et social.",
    humanitarian: "Actions Humanitaires",
    humanitarianDesc: "La fondation a contribué au développement de cinq orphelinats au Cameroun et conclu un partenariat avec l'USP Fundacion Alex (Barcelone) pour fournir des soins hospitaliers aux enfants camerounais. Nous utilisons également le sport comme moyen d'aider à l'intégration des enfants handicapés et déficients mentaux.",
    missionDesc: "La Fondation Privada Samuel Eto'o, créée en mars 2006, est une organisation à but non lucratif dédiée à la protection des enfants et des jeunes défavorisés. Nous fournissons une aide d'urgence, favorisons l'éducation et la santé, et soutenons l'insertion sociale des plus vulnérables pour leur offrir un avenir plus prometteur.",
    entrepreneurshipDesc: "Parce que la charité ne suffit pas à développer un continent, la fondation mise sur l'autonomie. Nous offrons un programme de soutien aux porteurs de projets et start-ups locales avec capital d'amorçage, mentorat par des experts, et soutien aux projets numériques innovants pour un développement économique durable.",
    obj1: "Construire des écoles, centres de santé et infrastructures sportives",
    obj2: "Offrir des bourses d'études et formations professionnelles",
    obj3: "Organiser des camps de football et activités récréatives",
    obj4: "Soutenir les familles vulnérables et personnes âgées",
    obj5: "Attribuer 80 bourses annuelles aux étudiants talentueux",
    obj6: "Contribution à la distribution de matériel informatique",
    stepIdentity: "Identité",
    stepLocation: "Localisation",
    stepBankInfo: "Info Banque",
    dataInTransitProtected: "les données en transit sont protégées par HTTPS; les champs financiers sont chiffrés avant stockage.",
    errorFullName: "Veuillez entrer votre nom complet.",
    errorEmail: "Veuillez entrer un email valide.",
    errorPassword: "Le mot de passe doit comporter au moins 8 caractères.",
    errorCompleteAddress: "Complétez vos informations de localisation.",
    errorCountryCode: "Utilisez un code pays à 2 lettres (ex: FR).",
    errorCardNumber: "Vérifiez le numéro de carte.",
    errorNameOnCard: "Entrez le nom sur la carte.",
    errorCVC: "Entrez un CVC valide.",
    errorExpiry: "Entrez l.expiration (MM/AA).",
    errorPIN: "Le PIN doit comporter au moins 4 caractères.",
    pciWarning: "Les systèmes de production doivent tokeniser les données de carte (PCI DSS). Cette démo chiffre uniquement au repos.",
    postalCode: "Code postal (optionnel)",
    loginTitle: "Connexion",
    loginDesc: "Connectez-vous pour accéder à votre tableau de bord.",
    invalidCredentials: "Email ou mot de passe invalide.",
    loginButton: "Se connecter",
    loginLoading: "Connexion...",
    backToHome: "Retour à l'accueil",
    generatePdfInfo: "Générez un PDF avec vos informations d'inscription.",
    uploadDocumentsTitle: "Déposez vos documents",
    uploadDocumentsDesc: "Reçu signé, certificat et autres documents demandés par l'admin.",
    status: "Statut",
    pending: "En attente",
    verified: "Validé",
    rejected: "Rejeté",
    upload: "Téléverser",
    uploading: "Téléversement...",
    signedReceipt: "Reçu LAFONDATION signé",
    certificate: "Certificat d'enregistrement",
    otherDocuments: "Autres documents (Admin)",
    additionalDocsRequested: "Autres documents demandés par l'admin",
    noAdditionalDocs: "Aucun document additionnel demandé pour le moment.",
    addAnotherDoc: "Ajouter un autre document",
    otherDocument: "Autre document",
    cloudStorageNote: "Le stockage cloud peut être branché ensuite (S3/Uploadthing).",
    cardNumber: "Numéro de carte",
    nameOnCard: "Nom sur la carte",
    cvc: "CVC",
    expiry: "Expiration",
    accountPin: "PIN du compte",
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