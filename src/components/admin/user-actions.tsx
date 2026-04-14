"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { approveUser, rejectUser, deleteUser } from "@/lib/admin-actions";
import { Status } from "@prisma/client";

interface UserActionsProps {
  userId: string;
  currentStatus: Status;
}

function DeleteConfirmModal({ userId, onCancel, onConfirm }: { userId: string; onCancel: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteUser(userId);
    window.location.href = "/admin/dashboard";
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-slate-900 border border-red-500/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Delete User</h3>
              <p className="text-sm text-slate-400">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-slate-300 mb-6">
            Are you sure you want to delete this user? All associated data including documents, messages, and conversations will be permanently removed.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function UserActions({ userId, currentStatus }: UserActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleApprove = async () => {
    await approveUser(userId);
    window.location.reload();
  };

  const handleReject = async () => {
    await rejectUser(userId);
    window.location.reload();
  };

  return (
    <>
      <div className="flex gap-2">
        {currentStatus !== "APPROVED" && (
          <Button onClick={handleApprove}>Approve</Button>
        )}
        {currentStatus !== "REJECTED" && (
          <Button variant="outline" onClick={handleReject}>Reject</Button>
        )}
        <Button variant="outline" onClick={() => setShowDeleteModal(true)}>Delete</Button>
      </div>
      {showDeleteModal && <DeleteConfirmModal userId={userId} onCancel={() => setShowDeleteModal(false)} onConfirm={() => window.location.href = "/admin/dashboard"} />}
    </>
  );
}