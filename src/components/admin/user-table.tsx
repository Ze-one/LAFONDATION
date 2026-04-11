"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Status, Role } from "@prisma/client";

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
    PENDING: "bg-yellow-100 text-yellow-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div>
        <p className="font-medium text-sm">{user.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={user.status} />
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/users/${user.id}`}>Manage</Link>
        </Button>
      </div>
    </div>
  );
}

export function UserTable({ users }: UserTableProps) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Full Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-3 py-3 font-medium">{user.fullName}</td>
                <td className="px-3 py-3">{user.email}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-3 py-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}`}>Manage</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden grid gap-3 sm:grid-cols-2">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground">No users found.</p>
        )}
      </div>
    </>
  );
}