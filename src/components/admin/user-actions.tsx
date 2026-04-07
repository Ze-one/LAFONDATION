"use client";

import { Button } from "@/components/ui/button";
import { approveUser, rejectUser, deleteUser } from "@/lib/admin-actions";
import { Status } from "@prisma/client";

interface UserActionsProps {
  userId: string;
  currentStatus: Status;
}

export function UserActions({ userId, currentStatus }: UserActionsProps) {
  const handleApprove = async () => {
    await approveUser(userId);
    window.location.reload();
  };

  const handleReject = async () => {
    await rejectUser(userId);
    window.location.reload();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="flex gap-2">
      {currentStatus !== "APPROVED" && (
        <Button onClick={handleApprove}>Approve</Button>
      )}
      {currentStatus !== "REJECTED" && (
        <Button variant="outline" onClick={handleReject}>Reject</Button>
      )}
      <Button variant="outline" onClick={handleDelete}>Delete</Button>
    </div>
  );
}