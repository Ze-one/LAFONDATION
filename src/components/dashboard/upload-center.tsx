"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

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

function getStatusLabel(status: DocStatus, pendingLabel: string, verifiedLabel: string, rejectedLabel: string) {
  switch (status) {
    case "PENDING":
      return pendingLabel;
    case "VERIFIED":
      return verifiedLabel;
    case "REJECTED":
      return rejectedLabel;
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
  const { t } = useLanguage();

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
        <p className="text-sm text-muted-foreground">{t("status")}: {getStatusLabel(status, t("pending"), t("verified"), t("rejected"))}</p>
      </div>
      <label className="inline-flex cursor-pointer">
        <input
          className="hidden"
          type="file"
          onChange={(e) => uploadFile(e.target.files?.[0] ?? null)}
          disabled={loading}
        />
        <span className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium">
          {loading ? t("uploading") : t("upload")}
        </span>
      </label>
    </div>
  );
}

export function UploadCenter({ signedReceiptStatus, certificateStatus, otherDocs }: UploadCenterProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <DocumentRow label={t("signedReceipt")} status={signedReceiptStatus} type="RECEIPT" />
      <DocumentRow
        label={t("certificate")}
        status={certificateStatus}
        type="CERTIFICATE"
      />

      <div className="space-y-2">
        <p className="text-sm font-semibold">{t("otherDocuments")}</p>
        {otherDocs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("noAdditionalDocs")}
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
        <p className="mb-2 text-sm text-muted-foreground">{t("addAnotherDoc")}</p>
        <DocumentRow label={t("otherDocument")} status="PENDING" type="OTHER" />
      </div>
      <Button variant="ghost" className="w-full" disabled>
        {t("cloudStorageNote")}
      </Button>
    </div>
  );
}