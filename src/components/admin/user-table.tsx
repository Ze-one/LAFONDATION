"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Status, Role } from "@prisma/client";
import { deleteUser } from "@/lib/admin-actions";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: Status;
  role: Role;
}

interface UserTableProps {
  users: User[];
}

function StatusBadge({ status }: { status: Status }) {
  const variants = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    UNDER_REVIEW: "bg-blue-500/20 text-blue-400",
    APPROVED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function DeleteModal({ user, onCancel, onConfirm }: { user: User; onCancel: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteUser(user.id);
    onConfirm();
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
              <p className="text-sm text-slate-400">Confirm deletion</p>
            </div>
          </div>
          <p className="text-slate-300 mb-2">
            Delete <span className="text-white font-medium">{user.fullName}</span>?
          </p>
          <p className="text-slate-400 text-sm mb-6">
            This will permanently remove all user data.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function UserCard({ user, onDelete }: { user: User; onDelete: (u: User) => void }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 space-y-3">
      <div>
        <p className="font-medium text-sm text-white">{user.fullName}</p>
        <p className="text-xs text-slate-400 truncate">{user.email}</p>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={user.status} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/users/${user.id}`}>Manage</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(user)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function UserTable({ users }: UserTableProps) {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const userToDelete = users.find(u => u.id === deleteUserId) || null;

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-slate-700 text-slate-400">
            <tr>
              <th className="px-3 py-2">Full Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                <td className="px-3 py-3 font-medium text-white">{user.fullName}</td>
                <td className="px-3 py-3 text-slate-300">{user.email}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/users/${user.id}`}>Manage</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteUserId(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden grid gap-3 sm:grid-cols-2">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onDelete={(u) => setDeleteUserId(u.id)} />
        ))}
        {users.length === 0 && (
          <p className="text-sm text-slate-400">No users found.</p>
        )}
      </div>
      {userToDelete && (
        <DeleteModal 
          user={userToDelete} 
          onCancel={() => setDeleteUserId(null)} 
          onConfirm={() => window.location.reload()} 
        />
      )}
    </>
  );
}