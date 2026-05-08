"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { TalentUser, ApplicationStatus } from "@/lib/admin-db";
import { ArrowLeft, Github, Linkedin, Globe, CheckCircle, XCircle, Clock, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<TalentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/talent")
      .then(r => r.json())
      .then((d: { talent?: TalentUser[] }) => {
        const found = (d.talent ?? []).find(t => t.id === id);
        if (found) { setApp(found); setNotes(found.adminNotes ?? ""); }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const act = async (status: ApplicationStatus) => {
    if (!app) return;
    setSaving(true);
    await fetch(`/api/talent/${app.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setApp(prev => prev ? { ...prev, applicationStatus: status } : prev);
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center p-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  if (!app) return (
    <div className="p-6 text-center text-slate-500">
      Application not found
      <button onClick={() => router.back()} className="block mt-2 text-blue-600 text-sm">← Back</button>
    </div>
  );

  const statusCls = { approved:"bg-green-100 text-green-700", rejected:"bg-red-100 text-red-600", waitlist:"bg-slate-100 text-slate-500", pending:"bg-amber-100 text-amber-700" }[app.applicationStatus] ?? "bg-amber-100 text-amber-700";
  const initials = (app.name || app.email).slice(0,2).toUpperCase();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to applications
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {app.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.profilePhotoUrl} alt={app.name} className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-bold">
                  {initials}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-slate-900">{app.name || app.email}</h1>
                <p className="text-slate-500">{app.headline || app.email}</p>
                <p className="text-sm text-slate-400 mt-0.5">{app.country} · Applied {new Date(app.createdAt).toLocaleDateString("en-GB")}</p>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${statusCls}`}>{app.applicationStatus}</span>
          </div>
        </div>

        <div className="p-6 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div><p className="text-xs text-slate-400 mb-0.5">Country</p><p className="text-sm text-slate-800 font-medium">{app.country || "—"}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Employment</p><p className="text-sm text-slate-800 font-medium">{app.employmentType.join(", ") || "—"}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Sectors</p><p className="text-sm text-slate-800 font-medium">{app.sectors.slice(0,2).map(s=>s.replace(/_/g," ")).join(", ") || "—"}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Experience</p><p className="text-sm text-slate-800 font-medium">{app.yearsOfExperience} yrs</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Budget</p><p className="text-sm text-slate-800 font-medium">${app.compensationMin}–${app.compensationMax}/mo</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Availability</p><p className="text-sm text-slate-800 font-medium">{app.availability}</p></div>
        </div>

        <div className="p-6 border-b border-slate-100">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Bio</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{app.bio || "—"}</p>
        </div>

        <div className="p-6 border-b border-slate-100">
          <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">Links</p>
          <div className="flex flex-wrap gap-3">
            {app.portfolioLinks?.linkedin && <a href={app.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline"><Linkedin className="w-4 h-4" />LinkedIn<ExternalLink className="w-3 h-3"/></a>}
            {app.portfolioLinks?.github && <a href={app.portfolioLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline"><Github className="w-4 h-4"/>GitHub<ExternalLink className="w-3 h-3"/></a>}
            {app.portfolioLinks?.portfolio && <a href={app.portfolioLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline"><Globe className="w-4 h-4"/>Website<ExternalLink className="w-3 h-3"/></a>}
            {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline"><ExternalLink className="w-4 h-4"/>Resume</a>}
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Admin Notes</p>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Internal notes…" rows={3} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"/>
          <div className="flex flex-wrap gap-2">
            {app.applicationStatus!=="approved"&&<button onClick={()=>act("approved")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">{saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<CheckCircle className="w-3.5 h-3.5"/>}Approve</button>}
            {app.applicationStatus!=="waitlist"&&<button onClick={()=>act("waitlist")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50">{saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<AlertCircle className="w-3.5 h-3.5"/>}Waitlist</button>}
            {app.applicationStatus!=="rejected"&&<button onClick={()=>act("rejected")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50">{saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<XCircle className="w-3.5 h-3.5"/>}Reject</button>}
            {app.applicationStatus!=="pending"&&<button onClick={()=>act("pending")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 disabled:opacity-50"><Clock className="w-3.5 h-3.5"/>Reset to Pending</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
