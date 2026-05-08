"use client";

import { useState, useEffect, useMemo } from "react";
import type { TalentUser, ApplicationStatus } from "@/lib/admin-db";
import { CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";

const TABS = ["all", "pending", "approved", "rejected", "waitlist"] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = { all:"All", pending:"Pending Review", approved:"Approved", rejected:"Rejected", waitlist:"Waitlisted" };
const SECTOR_LABELS: Record<string,string> = { software_engineering:"Software Eng", mobile_development:"Mobile Dev", web_development:"Web Dev", vibe_coding:"Vibe Coder", product_management:"Product", design_ux:"Design/UX", data_analytics:"Data", ai_ml:"AI/ML", devops_infrastructure:"DevOps", cybersecurity:"Cybersecurity", marketing:"Marketing" };
const STATUS_STYLE: Record<string,{icon:typeof Clock;label:string;cls:string}> = {
  pending:{icon:Clock,label:"Pending",cls:"bg-amber-100 text-amber-700"},
  approved:{icon:CheckCircle,label:"Approved",cls:"bg-green-100 text-green-700"},
  rejected:{icon:XCircle,label:"Rejected",cls:"bg-red-100 text-red-700"},
  waitlist:{icon:AlertCircle,label:"Waitlist",cls:"bg-slate-100 text-slate-600"},
};

function ApplicationRow({ app, onUpdate }:{app:TalentUser;onUpdate:(id:string,status:ApplicationStatus,notes?:string)=>Promise<void>}) {
  const [expanded,setExpanded] = useState(false);
  const [saving,setSaving] = useState(false);
  const [notes,setNotes] = useState(app.adminNotes??"");
  const s = STATUS_STYLE[app.applicationStatus]??STATUS_STYLE.pending;
  const Icon = s.icon;
  const act = async(status:ApplicationStatus)=>{setSaving(true);await onUpdate(app.id,status,notes);setSaving(false);};
  const initials = (app.name||app.email).slice(0,2).toUpperCase();
  return (
    <div className="border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer" onClick={()=>setExpanded(e=>!e)}>
        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
          {app.profilePhotoUrl
            // eslint-disable-next-line @next/next/no-img-element
            ?<img src={app.profilePhotoUrl} alt={app.name} className="w-full h-full object-cover"/>
            :<span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">{initials}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 text-sm truncate">{app.name||app.email}</p>
          <p className="text-xs text-slate-400 truncate">{app.headline||app.email}</p>
        </div>
        <div className="hidden md:flex gap-1 flex-wrap max-w-[200px]">
          {app.sectors.slice(0,2).map(s=><span key={s} className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{SECTOR_LABELS[s]??s}</span>)}
        </div>
        <p className="text-xs text-slate-400 hidden lg:block flex-shrink-0">{new Date(app.createdAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"})}</p>
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${s.cls}`}><Icon className="w-3 h-3"/>{s.label}</span>
        {expanded?<ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0"/>:<ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0"/>}
      </div>
      {expanded&&(
        <div className="px-4 pb-5 bg-slate-50 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {app.profilePhotoUrl&&(
              <div className="flex gap-3">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={app.profilePhotoUrl} alt={app.name} className="w-full h-full object-cover"/>
                </div>
                {app.coverMediaUrl&&<a href={app.coverMediaUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center gap-1 self-end">Cover<ExternalLink className="w-3 h-3"/></a>}
              </div>
            )}
            <div className="md:col-span-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Bio</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{app.bio||"—"}</p>
            </div>
            <div><p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Country</p><p className="text-sm text-slate-700">{app.country||"—"}</p></div>
            <div><p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Employment</p><p className="text-sm text-slate-700">{app.employmentType.join(", ")||"—"}</p></div>
            <div className="md:col-span-2 flex flex-wrap gap-2">
              {app.portfolioLinks?.linkedin&&<a href={app.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><ExternalLink className="w-3 h-3"/>LinkedIn</a>}
              {app.portfolioLinks?.github&&<a href={app.portfolioLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><ExternalLink className="w-3 h-3"/>GitHub</a>}
              {app.portfolioLinks?.portfolio&&<a href={app.portfolioLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><ExternalLink className="w-3 h-3"/>Website</a>}
              {app.resumeUrl&&<a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><ExternalLink className="w-3 h-3"/>Resume</a>}
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">Admin Notes</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Internal notes (not shown to talent)…" rows={2} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {app.applicationStatus!=="approved"&&<button onClick={()=>act("approved")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">{saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<CheckCircle className="w-3.5 h-3.5"/>}Approve</button>}
            {app.applicationStatus!=="waitlist"&&<button onClick={()=>act("waitlist")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50">{saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<AlertCircle className="w-3.5 h-3.5"/>}Waitlist</button>}
            {app.applicationStatus!=="rejected"&&<button onClick={()=>act("rejected")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50">{saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<XCircle className="w-3.5 h-3.5"/>}Reject</button>}
            {app.applicationStatus!=="pending"&&<button onClick={()=>act("pending")} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 disabled:opacity-50">Reset to Pending</button>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const [talent,setTalent] = useState<TalentUser[]>([]);
  const [loading,setLoading] = useState(true);
  const [tab,setTab] = useState<Tab>("all");

  useEffect(()=>{
    fetch("/api/talent").then(r=>r.json()).then((d:{talent?:TalentUser[]})=>setTalent(d.talent??[])).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const handleUpdate = async(id:string,status:ApplicationStatus,notes?:string)=>{
    await fetch(`/api/talent/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status,notes})});
    setTalent(prev=>prev.map(t=>t.id===id?{...t,applicationStatus:status,adminNotes:notes??t.adminNotes}:t));
  };

  const filtered = useMemo(()=>tab==="all"?talent:talent.filter(t=>t.applicationStatus===tab),[tab,talent]);
  const counts = useMemo(()=>{const c:Record<string,number>={all:talent.length};for(const t of talent)c[t.applicationStatus]=(c[t.applicationStatus]??0)+1;return c;},[talent]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 mt-1">{loading?"Loading…":`${talent.length} total · ${counts.pending??0} pending review`}</p>
      </div>
      <div className="flex gap-1 mb-5 border-b border-slate-200">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab===t?"text-blue-700 border-b-2 border-blue-700 bg-blue-50":"text-slate-500 hover:text-slate-700"}`}>
            {TAB_LABELS[t]}{counts[t]!=null&&<span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${tab===t?"bg-blue-200 text-blue-800":"bg-slate-100 text-slate-500"}`}>{counts[t]}</span>}
          </button>
        ))}
      </div>
      {loading?(<div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400"/></div>)
        :filtered.length===0?(<div className="text-center py-16 text-slate-400 text-sm">No {tab==="all"?"":tab} applications yet.</div>)
        :(<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">{filtered.map(app=><ApplicationRow key={app.id} app={app} onUpdate={handleUpdate}/>)}</div>)}
    </div>
  );
}
