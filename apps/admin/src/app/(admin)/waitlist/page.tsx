"use client";

import { useState, useEffect } from "react";
import type { TalentUser } from "@/lib/admin-db";
import { Mail, Loader2, ExternalLink } from "lucide-react";

export default function WaitlistPage() {
  const [waitlist, setWaitlist] = useState<TalentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/talent")
      .then(r => r.json())
      .then((d: { talent?: TalentUser[] }) =>
        setWaitlist((d.talent ?? []).filter(t => t.applicationStatus === "waitlist"))
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const promote = async (id: string) => {
    await fetch(`/api/talent/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    setWaitlist(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Waitlist</h1>
        <p className="text-slate-500 mt-1">
          {loading ? "Loading…" : `${waitlist.length} talent profiles on the waitlist`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : waitlist.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No profiles on the waitlist.</p>
          <p className="text-xs mt-1">Profiles moved to waitlist from Applications will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Talent</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden md:table-cell">Sectors</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden lg:table-cell">Country</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden lg:table-cell">Applied</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Links</th>
                <th className="text-right py-3 px-4 text-slate-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map(t => {
                const initials = (t.name || t.email).slice(0, 2).toUpperCase();
                return (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                          {t.profilePhotoUrl
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={t.profilePhotoUrl} alt={t.name} className="w-full h-full object-cover" />
                            : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">{initials}</span>
                          }
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{t.name || t.email}</p>
                          <p className="text-xs text-slate-400">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {t.sectors.slice(0, 2).map(s => (
                          <span key={s} className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{s.replace(/_/g, " ")}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-600 text-sm">{t.country || "—"}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-400 text-xs">
                      {new Date(t.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {t.portfolioLinks?.linkedin && (
                          <a href={t.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                          </a>
                        )}
                        {t.portfolioLinks?.github && (
                          <a href={t.portfolioLinks.github} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => promote(t.id)}
                        className="text-xs font-semibold text-green-600 hover:text-green-800 px-3 py-1 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        Approve
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
