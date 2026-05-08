"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Users, Building2, Loader2 } from "lucide-react";

interface Stats { talent: number; companies: number; approved: number; pending: number; }

const revenueData = [
  { month: "Feb", talent: 0, company: 0 },
  { month: "Mar", talent: 875, company: 99 },
  { month: "Apr", talent: 2250, company: 498 },
  { month: "May", talent: 3420, company: 1197 },
];
const maxRevenue = Math.max(...revenueData.map((d) => d.talent + d.company));

const geoData = [
  { country: "Nigeria", count: 8, pct: 40 },
  { country: "Kenya", count: 4, pct: 20 },
  { country: "Ghana", count: 3, pct: 15 },
  { country: "South Africa", count: 2, pct: 10 },
  { country: "Ethiopia", count: 2, pct: 10 },
  { country: "Other", count: 1, pct: 5 },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then((d: Stats) => setStats(d)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const currentMRR = revenueData[revenueData.length - 1];
  const totalMRR = currentMRR.talent + currentMRR.company;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-slate-900">Analytics</h1><p className="text-slate-500 mt-1">Live platform metrics</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({length:4}).map((_,i)=><div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse"><div className="h-9 w-9 bg-slate-100 rounded-xl mb-3"/><div className="h-7 w-12 bg-slate-100 rounded"/></div>)
        ) : [
          { label:"Total MRR", value:`$${totalMRR.toLocaleString()}`, icon:DollarSign, color:"text-green-600", bg:"bg-green-50" },
          { label:"Approved Members", value:stats?.approved??0, icon:Users, color:"text-blue-600", bg:"bg-blue-50" },
          { label:"Company Accounts", value:stats?.companies??0, icon:Building2, color:"text-purple-600", bg:"bg-purple-50" },
          { label:"Total Applications", value:stats?.talent??0, icon:TrendingUp, color:"text-amber-600", bg:"bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${color}`}/></div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-6">Revenue Growth (MRR)</h2>
        <div className="flex items-end gap-6 h-40">
          {revenueData.map((d) => {
            const total = d.talent + d.company;
            const talentH = maxRevenue > 0 ? (d.talent / maxRevenue) * 100 : 0;
            const companyH = maxRevenue > 0 ? (d.company / maxRevenue) * 100 : 0;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-medium text-slate-500 mb-1">${total > 0 ? total.toLocaleString() : "—"}</p>
                <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: "100px" }}>
                  <div className="w-full bg-green-400 rounded-b" style={{ height: `${companyH}px` }} title={`Company: $${d.company}`}/>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: `${talentH}px` }} title={`Talent: $${d.talent}`}/>
                </div>
                <p className="text-xs text-slate-400">{d.month}</p>
              </div>
            );
          })}
        </div>
        <div className="flex gap-5 mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded"/>Talent revenue</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-400 rounded"/>Company revenue</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5">Conversion Funnel</h2>
          {loading ? <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-slate-400"/></div> : [
            { label:"Applications received", count:stats?.talent??0, color:"bg-blue-400" },
            { label:"Approved members", count:stats?.approved??0, color:"bg-green-400" },
            { label:"Paid subscribers", count:7, color:"bg-green-600" },
          ].map(({ label, count, color }, i, arr) => {
            const base = arr[0].count || 1;
            const pct = Math.round((count / base) * 100);
            return (
              <div key={label} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-800">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full"><div className={`h-3 ${color} rounded-full`} style={{ width: `${pct}%` }}/></div>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5">Geographic Distribution</h2>
          {geoData.map(({ country, count, pct }) => (
            <div key={country} className="mb-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{country}</span><span className="font-semibold text-slate-800">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span></div>
              <div className="h-2 bg-slate-100 rounded-full"><div className="h-2 bg-green-400 rounded-full" style={{ width: `${pct}%` }}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
