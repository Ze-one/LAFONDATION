"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocType, DocStatus } from "@prisma/client";

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  type: DocType;
  status: DocStatus;
}

interface DocumentListProps {
  documents: Document[];
  userId: string;
}

export function DocumentList({ documents, userId }: DocumentListProps) {
  const handleDownloadAll = async () => {
    const response = await fetch(`/api/admin/users/${userId}/documents/download-all`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-${userId}-documents.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      {documents.length > 0 && (
        <Button onClick={handleDownloadAll}>Download All Documents</Button>
      )}
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between border rounded p-3">
            <div>
              <p className="font-medium">{doc.fileName}</p>
              <p className="text-sm text-muted-foreground">Type: {doc.type} | Status: <Badge variant={doc.status === "VERIFIED" ? "default" : doc.status === "REJECTED" ? "destructive" : "secondary"}>{doc.status}</Badge></p>
            </div>
            <Button variant="outline" asChild>
              <a href={doc.fileUrl} download>Download</a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}