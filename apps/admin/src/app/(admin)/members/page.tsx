"use client";

import { useState, useEffect } from "react";
import type { TalentUser } from "@/lib/admin-db";
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

export default function MembersPage() {
  const [members, setMembers] = useState<TalentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/talent")
      .then(r => r.json())
      .then((d: { talent?: TalentUser[] }) => setMembers((d.talent ?? []).filter(t => t.applicationStatus === "approved")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const suspend = async (id: string) => {
    await fetch(`/api/talent/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "waitlist" }) });
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Members</h1>
        <p className="text-slate-500 mt-1">{loading ? "Loading…" : `${members.length} approved talent profiles`}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No approved members yet. Approve applications first.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Member</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden md:table-cell">Sectors</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden lg:table-cell">Country</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden lg:table-cell">Links</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-slate-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => {
                const initials = (m.name || m.email).slice(0,2).toUpperCase();
                return (
                  <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                          {m.profilePhotoUrl
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={m.profilePhotoUrl} alt={m.name} className="w-full h-full object-cover" />
                            : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">{initials}</span>
                          }
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{m.name || m.email}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {m.sectors.slice(0, 2).map(s => (
                          <span key={s} className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{s.replace(/_/g," ")}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-600 text-sm">{m.country || "—"}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex gap-2">
                        {m.portfolioLinks?.linkedin && <a href={m.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3.5 h-3.5 text-blue-500" /></a>}
                        {m.portfolioLinks?.github && <a href={m.portfolioLinks.github} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3.5 h-3.5 text-slate-500" /></a>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 w-fit">
                        <CheckCircle className="w-3 h-3" /> Approved
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => suspend(m.id)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 ml-auto"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Suspend
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
