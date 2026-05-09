"use client";

import { useEffect, useState } from "react";
import { Users, Eye, FileText, Clock, Loader2 } from "lucide-react";
import type { Stats } from "@/lib/admin-db";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [geoData, setGeoData] = useState<{ country: string; count: number; pct: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/talent").then(r => r.json()),
    ]).then(([statsData, talentData]) => {
      setStats(statsData as Stats);
      const talent = (talentData as { talent?: { country?: string }[] }).talent ?? [];
      const counts: Record<string, number> = {};
      for (const t of talent) {
        const c = t.country || "Unknown";
        counts[c] = (counts[c] ?? 0) + 1;
      }
      const total = talent.length || 1;
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([country, count]) => ({ country, count, pct: Math.round((count / total) * 100) }));
      setGeoData(sorted);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Approved Members",   value: stats.approved,  icon: Users,     color: "text-green-600",  bg: "bg-green-50"  },
    { label: "Viewer Accounts",    value: stats.companies, icon: Eye,       color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Applications", value: stats.talent,    icon: FileText,  color: "text-blue-600",   bg: "bg-blue-50"   },
    { label: "Pending Review",     value: stats.pending,   icon: Clock,     color: "text-amber-600",  bg: "bg-amber-50"  },
  ] : [];

  const base = stats?.talent || 1;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Live platform metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse">
              <div className="h-9 w-9 bg-slate-100 rounded-xl mb-3" />
              <div className="h-7 w-12 bg-slate-100 rounded" />
            </div>
          ))
        ) : cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5">Application Funnel</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
          ) : [
            { label: "Applications received", count: stats?.talent ?? 0,   color: "bg-blue-400"  },
            { label: "Pending review",         count: stats?.pending ?? 0,  color: "bg-amber-400" },
            { label: "Approved members",       count: stats?.approved ?? 0, color: "bg-green-500" },
            { label: "Rejected",               count: stats?.rejected ?? 0, color: "bg-red-400"   },
          ].map(({ label, count, color }) => {
            const pct = Math.round((count / base) * 100);
            return (
              <div key={label} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-800">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full">
                  <div className={`h-3 ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5">Geographic Distribution</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
          ) : geoData.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No data yet.</p>
          ) : geoData.map(({ country, count, pct }) => (
            <div key={country} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{country}</span>
                <span className="font-semibold text-slate-800">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className="h-2 bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
