"use client";

import { useState, useEffect } from "react";
import { FileText, Users, Eye, Clock, Loader2, ToggleLeft, ToggleRight, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Stats, CohortData, TalentUser } from "@/lib/admin-db";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cohort, setCohort] = useState<CohortData | null>(null);
  const [recentApps, setRecentApps] = useState<TalentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/cohorts").then(r => r.json()),
      fetch("/api/talent").then(r => r.json()),
    ]).then(([statsData, cohortData, talentData]) => {
      setStats(statsData as Stats);
      const cohorts = (cohortData as { cohorts?: CohortData[] }).cohorts ?? [];
      setCohort(cohorts.find(c => c.isOpen) ?? cohorts[0] ?? null);
      const all = (talentData as { talent?: TalentUser[] }).talent ?? [];
      // Most recent 8 across all statuses, sorted newest first
      setRecentApps(
        [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
      );
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggleOpen = async () => {
    if (!cohort) return;
    setToggling(true);
    const res = await fetch(`/api/cohorts/${cohort.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: !cohort.isOpen }),
    });
    const { cohort: updated } = await res.json() as { cohort: CohortData };
    setCohort(updated);
    setToggling(false);
  };

  const kpis = stats ? [
    { label: "Total Applications", value: stats.talent,    icon: FileText, change: `${stats.pending} pending review`, color: "blue"   },
    { label: "Approved Members",   value: stats.approved,  icon: Users,    change: "Live on platform",               color: "green"  },
    { label: "Viewer Accounts",    value: stats.companies, icon: Eye,      change: "Free browse access",             color: "purple" },
    { label: "Pending Review",     value: stats.pending,   icon: Clock,    change: "Needs action",                   color: "amber"  },
  ] : [];

  const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   badge: "bg-blue-100 text-blue-700"   },
    green:  { bg: "bg-green-50",  icon: "text-green-600",  badge: "bg-green-100 text-green-700"  },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
    amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  badge: "bg-amber-100 text-amber-700"  },
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {cohort && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">{cohort.name}</p>
              <p className="text-xs text-slate-400">{cohort.isOpen ? "Accepting applications" : "Applications closed"}</p>
            </div>
            <button onClick={toggleOpen} disabled={toggling} className="transition-colors shrink-0">
              {toggling
                ? <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                : cohort.isOpen
                  ? <ToggleRight className="w-8 h-8 text-green-600" />
                  : <ToggleLeft className="w-8 h-8 text-slate-400" />
              }
            </button>
          </div>
        )}
      </div>

      {/* KPI cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 border border-slate-100 bg-white animate-pulse">
              <div className="h-4 w-20 bg-slate-100 rounded mb-3" />
              <div className="h-8 w-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map(({ label, value, icon: Icon, change, color }) => {
            const c = colorMap[color];
            return (
              <div key={label} className="rounded-2xl p-5 border border-slate-100 bg-white shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.bg}`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">{label}</p>
                <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{change}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Applications</h2>
          <Link href="/applications" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-slate-300" /></div>
        ) : recentApps.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">No applications yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentApps.map(app => {
              const initials = (app.name || app.email).slice(0, 2).toUpperCase();
              const statusCls: Record<string, string> = {
                pending:  "bg-amber-100 text-amber-700",
                approved: "bg-green-100 text-green-700",
                rejected: "bg-red-100 text-red-600",
                waitlist: "bg-slate-100 text-slate-500",
              };
              return (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    {app.profilePhotoUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={app.profilePhotoUrl} alt={app.name} className="w-full h-full object-cover" />
                      : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">{initials}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800 truncate">{app.name || app.email}</p>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusCls[app.applicationStatus] ?? statusCls.pending}`}>
                        {app.applicationStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-slate-400 truncate">{app.headline || app.email}</p>
                      {app.country && <p className="text-xs text-slate-400 shrink-0">{app.country}</p>}
                    </div>
                    {(app.sectors?.length > 0 || app.employmentType?.length > 0) && (
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {app.sectors.slice(0, 2).map(s => (
                          <span key={s} className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{s.replace(/_/g, " ")}</span>
                        ))}
                        {app.employmentType.slice(0, 1).map(e => (
                          <span key={e} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{e}</span>
                        ))}
                        {app.yearsOfExperience > 0 && (
                          <span className="text-xs text-slate-400">{app.yearsOfExperience}yr exp</span>
                        )}
                        {(app.compensationMin > 0 || app.compensationMax > 0) && (
                          <span className="text-xs text-slate-400">${app.compensationMin}–${app.compensationMax}/mo</span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 mt-1">
                      {app.portfolioLinks?.linkedin && <a href={app.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">LinkedIn <ExternalLink className="w-2.5 h-2.5" /></a>}
                      {app.portfolioLinks?.github && <a href={app.portfolioLinks.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-slate-400 hover:underline flex items-center gap-0.5">GitHub <ExternalLink className="w-2.5 h-2.5" /></a>}
                      {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-slate-400 hover:underline flex items-center gap-0.5">Resume <ExternalLink className="w-2.5 h-2.5" /></a>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">
                    {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-4">Platform Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-600">API</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Flask Connected
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-600">Active Cohort</span>
            <span className="text-sm font-semibold text-slate-800">
              {cohort ? cohort.name : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-600">Cohort Capacity</span>
            <span className="text-sm font-semibold text-slate-800">
              {cohort ? `${cohort.approved}/${cohort.maxSize} spots` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">Applications</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              cohort?.isOpen ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
            }`}>
              {cohort ? (cohort.isOpen ? "Open" : "Closed") : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
