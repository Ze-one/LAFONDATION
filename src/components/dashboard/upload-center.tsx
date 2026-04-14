"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocStatus, DocType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

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

function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function DocumentRow({
  label,
  status,
  type,
  docId,
}: {
  label: string;
  status: DocStatus;
  type: "RECEIPT" | "CERTIFICATE" | "OTHER";
  docId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(status !== "PENDING");
  const [showMenu, setShowMenu] = useState(false);
  const { t } = useLanguage();

  async function uploadFile(file: File | null) {
    if (!file) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("label", label);
      formData.append("file", file);
      
      const res = await fetch("/api/documents/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.ok || res.ok) {
        setUploaded(true);
        toast.success(`${label} uploaded successfully`);
        router.refresh();
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteFile() {
    if (!docId) return;
    if (!confirm("Delete this document?")) return;
    
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Document deleted");
        router.refresh();
      }
    } catch (e) {
      toast.error("Delete failed");
    }
    setShowMenu(false);
  }

  const isUploaded = uploaded || status !== "PENDING";
  const statusLabel = getStatusLabel(status, t("pending"), t("verified"), t("rejected"));

  return (
    <div className="flex flex-col gap-2 rounded-md border border-slate-700 bg-slate-800/50 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-slate-400">
          {t("status")}: <span className={status === "VERIFIED" ? "text-green-400" : status === "REJECTED" ? "text-red-400" : "text-yellow-400"}>{statusLabel}</span>
        </p>
      </div>
      
      <div className="relative flex items-center gap-2">
        {isUploaded ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Uploaded
            </span>
            {docId && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-10 overflow-hidden">
                    <button
                      onClick={() => { setShowMenu(false); deleteFile(); }}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <label className="inline-flex cursor-pointer">
            <input
              className="hidden"
              type="file"
              onChange={(e) => uploadFile(e.target.files?.[0] ?? null)}
              disabled={loading}
            />
            <span className="inline-flex h-10 items-center justify-center rounded-md border border-slate-600 bg-slate-800 px-4 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Uploading...
                </>
              ) : (
                t("upload")
              )}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

export function UploadCenter({ signedReceiptStatus, certificateStatus, otherDocs }: UploadCenterProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <DocumentRow label={t("signedReceipt")} status={signedReceiptStatus} type="RECEIPT" />
      <DocumentRow label={t("certificate")} status={certificateStatus} type="CERTIFICATE" />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-white">{t("otherDocuments")}</p>
        {otherDocs.length === 0 ? (
          <p className="text-sm text-slate-400">{t("noAdditionalDocs")}</p>
        ) : (
          <div className="space-y-3">
            {otherDocs.map((doc) => (
              <DocumentRow key={doc.id} label={doc.label} status={doc.status} type="OTHER" docId={doc.id} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2">
        <p className="mb-2 text-sm text-slate-400">{t("addAnotherDoc")}</p>
        <DocumentRow label={t("otherDocument")} status="PENDING" type="OTHER" />
      </div>
    </div>
  );
}