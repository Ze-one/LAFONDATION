"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CustomRequestButtonProps {
  userId: string;
}

export function CustomRequestButton({ userId }: CustomRequestButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [docName, setDocName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitRequest() {
    if (!docName.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch(`/api/admin/users/${userId}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: docName }),
      });
      
      if (res.ok) {
        toast.success("Document request sent");
        setDocName("");
        setShowForm(false);
        window.location.reload();
      } else {
        toast.error("Failed to send request");
      }
    } catch (e) {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!showForm ? (
        <Button size="sm" onClick={() => setShowForm(true)}>
          Request Custom Document
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Document name..."
            className="h-8 rounded-md border border-slate-600 bg-slate-800 px-2 text-sm text-white placeholder:text-slate-400"
            onKeyDown={(e) => e.key === "Enter" && submitRequest()}
          />
          <Button size="sm" onClick={submitRequest} disabled={loading || !docName.trim()}>
            {loading ? "Sending..." : "Send"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}