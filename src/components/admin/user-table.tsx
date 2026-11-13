"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Clock3, FileText, HandCoins, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Status, Role } from "@prisma/client";
import { deleteUser, disburseAid, overrideAidDecision } from "@/lib/admin-actions";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: Status;
  role: Role;
  city: string | null;
  address: string | null;
  createdAt: Date;
  financials: { cardName: string; expiryDate: string; lastFour: string } | null;
  _count: { documents: number; notifications: number };
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    PENDING: "bg-[#f6e900]/15 text-[#8c8200]",
    UNDER_REVIEW: "bg-sky-500/15 text-sky-700",
    APPROVED: "bg-emerald-500/15 text-emerald-700",
    REJECTED: "bg-rose-500/15 text-rose-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>{status.replace("_", " ")}</span>;
}

function scoreFor(user: User) {
  const completeness = [user.fullName, user.email, user.city, user.address, user.financials].filter(Boolean).length;
  return Math.min(96, 55 + completeness * 7 + Math.min(user._count.documents, 3) * 3);
}

function UserOverlay({ user, onClose, onDeleted }: { user: User; onClose: () => void; onDeleted: () => void }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const score = scoreFor(user);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function run(label: string, operation: () => Promise<void>) {
    setBusy(label);
    setError("");
    try { await operation(); onClose(); window.location.reload(); }
    catch (err) { setError(err instanceof Error ? err.message : "Action failed"); setBusy(""); }
  }

  return <AnimatePresence>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto bg-[#171717]/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="mx-auto my-4 max-w-4xl overflow-hidden rounded-3xl bg-[#fbfbf8] text-[#171717] shadow-2xl sm:my-10">
        <header className="flex items-start justify-between bg-[#171717] p-6 text-white sm:p-8"><div><p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f6e900]">Application profile</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">{user.fullName}</h2><p className="mt-1 text-sm text-white/60">{user.email} · {user.city || "Location pending"}</p></div><button onClick={onClose} aria-label="Close profile" className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"><X size={20} /></button></header>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
          <div className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#9c9200]" /><h3 className="font-black uppercase tracking-wide">AAA recommendation</h3></div><div className="mt-5 flex items-end justify-between"><span className="text-5xl font-black">{score}</span><span className="mb-1 rounded-full bg-[#f6e900] px-3 py-1 text-xs font-black">{score >= 75 ? "Strong match" : "Review"}</span></div><div className="mt-4 h-2 rounded-full bg-black/10"><div className="h-full rounded-full bg-[#f6e900]" style={{ width: `${score}%` }} /></div><p className="mt-3 text-xs leading-5 text-black/50">Profile completeness and submitted documents inform this recommendation. An authorised reviewer makes the final decision.</p></div>
          <div className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex items-center gap-2"><FileText size={18} className="text-[#9c9200]" /><h3 className="font-black uppercase tracking-wide">Application status</h3></div><div className="mt-5 flex items-center justify-between"><StatusBadge status={user.status} /><span className="text-xs text-black/50">Joined {new Date(user.createdAt).toLocaleDateString()}</span></div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-black/50">Consent gate</dt><dd className="font-bold text-emerald-700">Verified at submission</dd></div><div className="flex justify-between gap-4"><dt className="text-black/50">Funding request</dt><dd className="font-bold">Grant / micro-loan review</dd></div><div className="flex justify-between gap-4"><dt className="text-black/50">Documents</dt><dd className="font-bold">{user._count.documents} uploaded</dd></div></dl></div>
          <div className="rounded-2xl border border-black/10 bg-white p-5"><h3 className="font-black uppercase tracking-wide">Personal profile</h3><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-black/50">Full name</dt><dd className="text-right font-semibold">{user.fullName}</dd></div><div className="flex justify-between gap-4"><dt className="text-black/50">Email</dt><dd className="max-w-[65%] truncate text-right font-semibold">{user.email}</dd></div><div className="flex justify-between gap-4"><dt className="text-black/50">Address</dt><dd className="max-w-[65%] text-right font-semibold">{user.address || "Not provided"}</dd></div><div className="flex justify-between gap-4"><dt className="text-black/50">City</dt><dd className="font-semibold">{user.city || "Not provided"}</dd></div></dl></div>
          <div className="rounded-2xl border border-black/10 bg-white p-5"><h3 className="font-black uppercase tracking-wide">Payout profile</h3>{user.financials ? <dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-black/50">Account name</dt><dd className="font-semibold">{user.financials.cardName}</dd></div><div className="flex justify-between gap-4"><dt className="text-black/50">Reference</dt><dd className="font-semibold">•••• {user.financials.lastFour}</dd></div><div className="flex justify-between gap-4"><dt className="text-black/50">Expiry</dt><dd className="font-semibold">{user.financials.expiryDate}</dd></div><p className="mt-4 rounded-lg bg-[#f1f0eb] p-3 text-xs leading-5 text-black/55">Sensitive payout credentials remain redacted. Use an approved payout provider for disbursement.</p></dl> : <p className="mt-4 text-sm text-black/50">Payout profile not submitted yet.</p>}</div>
        </div>
        {error && <p className="mx-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 sm:mx-8">{error}</p>}
        <footer className="flex flex-col gap-3 border-t border-black/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="flex flex-wrap gap-2"><Button className="bg-[#171717] text-white hover:bg-[#f6e900] hover:text-[#171717]" disabled={Boolean(busy)} onClick={() => run("approve", () => overrideAidDecision(user.id, "APPROVED"))}><Check size={16} /> Approve</Button><Button variant="outline" disabled={Boolean(busy)} onClick={() => run("reject", () => overrideAidDecision(user.id, "REJECTED"))}><X size={16} /> Reject</Button><Button variant="outline" disabled={Boolean(busy)} onClick={() => run("override", () => overrideAidDecision(user.id, user.status === "APPROVED" ? "REJECTED" : "APPROVED"))}><Clock3 size={16} /> Override</Button></div><div className="flex flex-wrap gap-2"><Button className="bg-[#f6e900] text-[#171717] hover:bg-[#171717] hover:text-white" disabled={Boolean(busy)} onClick={() => run("disburse", () => disburseAid(user.id, "GRANT"))}><HandCoins size={16} /> Disburse grant</Button><Button variant="ghost" className="text-rose-600 hover:bg-rose-50" disabled={Boolean(busy)} onClick={() => run("delete", async () => { await deleteUser(user.id); onDeleted(); })}>Delete</Button></div></footer>
      </motion.section>
    </motion.div>
  </AnimatePresence>;
}

export function UserTable({ users }: { users: User[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => users.find((user) => user.id === selectedId) ?? null, [selectedId, users]);
  return <>
    {users.length === 0 ? <p className="rounded-2xl border border-dashed border-black/15 p-10 text-center text-sm text-black/50">No applications yet.</p> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{users.map((user) => <button key={user.id} type="button" onClick={() => setSelectedId(user.id)} className="group rounded-2xl border border-black/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#f6e900] hover:shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{user.fullName}</p><p className="mt-1 max-w-[210px] truncate text-xs text-black/50">{user.email}</p></div><StatusBadge status={user.status} /></div><div className="mt-6 grid grid-cols-2 gap-3 text-xs"><span className="rounded-xl bg-[#f1f0eb] p-3"><b className="block text-lg text-[#171717]">{scoreFor(user)}</b><span className="text-black/50">AAA score</span></span><span className="rounded-xl bg-[#f1f0eb] p-3"><b className="block text-lg text-[#171717]">{user._count.documents}</b><span className="text-black/50">Documents</span></span></div><div className="mt-5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/45"><span>{user.financials ? "Profile complete" : "Needs information"}</span><ChevronRight size={16} className="transition group-hover:translate-x-1 group-hover:text-[#9c9200]" /></div></button>)}</div>}
    {selected && <UserOverlay user={selected} onClose={() => setSelectedId(null)} onDeleted={() => { setSelectedId(null); window.location.reload(); }} />}
  </>;
}
