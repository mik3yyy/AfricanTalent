"use client";

import { useState, useEffect } from "react";
import { FileText, Users, Eye, Clock, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import type { Stats, CohortData } from "@/lib/admin-db";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cohort, setCohort] = useState<CohortData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/cohorts").then(r => r.json()),
    ]).then(([statsData, cohortData]) => {
      setStats(statsData as Stats);
      const cohorts = (cohortData as { cohorts?: CohortData[] }).cohorts ?? [];
      setCohort(cohorts.find(c => c.isOpen) ?? cohorts[0] ?? null);
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
