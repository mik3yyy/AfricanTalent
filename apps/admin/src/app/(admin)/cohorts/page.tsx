"use client";

import { platformConfig } from "@platform/config";
import { useState } from "react";
import { Plus, Users, Calendar, ToggleLeft, ToggleRight } from "lucide-react";

const initialCohorts = [
  {
    id: "1", number: 1, name: "Cohort 1 — Q1 2026",
    maxSize: 500, applicants: 20, approved: 7,
    openAt: "2026-04-15", closeAt: "2026-05-31",
    isActive: true,
  },
  {
    id: "2", number: 2, name: "Cohort 2 — Q3 2026",
    maxSize: 750, applicants: 0, approved: 0,
    openAt: "2026-07-01", closeAt: "2026-08-15",
    isActive: false,
  },
];

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState(initialCohorts);

  const toggleActive = (id: string) => {
    setCohorts((c) =>
      c.map((cohort) =>
        cohort.id === id ? { ...cohort, isActive: !cohort.isActive } : cohort
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cohort Management</h1>
          <p className="text-slate-500 mt-1">Control admission windows and cohort settings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors">
          <Plus className="w-4 h-4" />
          New Cohort
        </button>
      </div>

      {/* Active cohort banner */}
      {cohorts.filter((c) => c.isActive).map((cohort) => (
        <div key={cohort.id} className="mb-6 p-5 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="font-semibold text-green-800">Currently accepting applications</p>
          </div>
          <p className="text-green-700 text-sm">
            {cohort.name} — {cohort.approved}/{cohort.maxSize} spots filled ·
            Closes {new Date(cohort.closeAt).toLocaleDateString("en", { month: "long", day: "numeric" })}
          </p>
        </div>
      ))}

      {/* Cohort cards */}
      <div className="space-y-4">
        {cohorts.map((cohort) => (
          <div key={cohort.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-lg font-bold text-slate-900">{cohort.name}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    cohort.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {cohort.isActive ? "Active" : "Upcoming"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  {[
                    { label: "Max Size", value: cohort.maxSize, icon: Users },
                    { label: "Applicants", value: cohort.applicants, icon: Users },
                    { label: "Approved", value: cohort.approved, icon: Users },
                    { label: "Opens", value: new Date(cohort.openAt).toLocaleDateString("en", { month: "short", day: "numeric" }), icon: Calendar },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                      <p className="font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Spots filled</span>
                    <span>{cohort.approved}/{cohort.maxSize}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(cohort.approved / cohort.maxSize) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleActive(cohort.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors shrink-0 ${
                  cohort.isActive
                    ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {cohort.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {cohort.isActive ? "Close" : "Open"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
