"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";

type OtherDoc = {
  id: string;
  label: string;
  status: DocStatus;
};

type UploadCenterProps = {
  signedReceiptStatus: DocStatus;
  certificateStatus: DocStatus;
  otherDocs: OtherDoc[];
};

function statusLabel(status: DocStatus) {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "VERIFIED":
      return "Valide";
    case "REJECTED":
      return "Rejete";
    default:
      return status;
  }
}

function DocumentRow({
  label,
  status,
  type,
}: {
  label: string;
  status: DocStatus;
  type: "RECEIPT" | "CERTIFICATE" | "OTHER";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function uploadFile(file: File | null) {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("type", type);
    formData.append("label", label);
    formData.append("file", file);
    await fetch("/api/documents/upload", { method: "POST", body: formData });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">Statut: {statusLabel(status)}</p>
      </div>
      <label className="inline-flex cursor-pointer">
        <input
          className="hidden"
          type="file"
          onChange={(e) => uploadFile(e.target.files?.[0] ?? null)}
          disabled={loading}
        />
        <span className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium">
          {loading ? "Upload..." : "Upload"}
        </span>
      </label>
    </div>
  );
}

export function UploadCenter({ signedReceiptStatus, certificateStatus, otherDocs }: UploadCenterProps) {
  return (
    <div className="space-y-4">
      <DocumentRow label="Recu LAFONDATION signe" status={signedReceiptStatus} type="RECEIPT" />
      <DocumentRow
        label="Certificat d'enregistrement"
        status={certificateStatus}
        type="CERTIFICATE"
      />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Autres documents (Admin)</p>
        {otherDocs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun document additionnel demande pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {otherDocs.map((doc) => (
              <DocumentRow key={doc.id} label={doc.label} status={doc.status} type="OTHER" />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2">
        <p className="mb-2 text-sm text-muted-foreground">Ajouter un autre document</p>
        <DocumentRow label="Autre document" status="PENDING" type="OTHER" />
      </div>
      <Button variant="ghost" className="w-full" disabled>
        Le stockage cloud peut etre branche ensuite (S3/Uploadthing).
      </Button>
    </div>
  );
}
