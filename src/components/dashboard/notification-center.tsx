"use client";

import { useEffect, useState } from "react";
import { Status } from "@prisma/client";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

type Props = {
  initialStatus: Status;
  initialNotifications: NotificationItem[];
};

function statusLabel(status: Status): string {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "UNDER_REVIEW":
      return "En cours d'examen";
    case "APPROVED":
      return "Valide";
    case "REJECTED":
      return "Rejete";
    default:
      return status;
  }
}

export function NotificationCenter({ initialStatus, initialNotifications }: Props) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/me/summary", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { status: Status; notifications: NotificationItem[] };
        setStatus(data.status);
        setNotifications(data.notifications);
      } catch {
        // Best-effort polling; keep existing UI state on transient failures.
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <p className="mt-1 text-sm text-muted-foreground">
        Statut de votre compte:{" "}
        <span className="rounded-full border px-2 py-0.5 text-xs font-semibold">
          {statusLabel(status)}
        </span>
      </p>

      <div className="mt-6 rounded-xl border bg-card p-6">
        <h2 className="mb-3 font-semibold">Notification Center</h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune notification pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li key={notification.id} className="rounded-lg border p-3">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
