"use client";

import { platformConfig } from "@platform/config";
import { CheckCircle2, Building2, LogOut } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your company account</p>
      </div>

      {/* Company profile */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Company Profile</h2>
            <p className="text-sm text-slate-500">TechFlow Inc · San Francisco, CA</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "Company name", value: "TechFlow Inc" },
            { label: "Website", value: "techflow.com" },
            { label: "Industry", value: "SaaS / B2B" },
            { label: "Size", value: "11-50 employees" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-slate-400 text-xs mb-0.5">{label}</p>
              <p className="text-slate-800 font-medium">{value}</p>
            </div>
          ))}
        </div>
        <button className="mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium">
          Edit company details
        </button>
      </section>

      {/* Access */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-slate-900">Platform Access</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Free — Always
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Companies access {platformConfig.shortName} at no cost. Talent pays to be listed — you never do.
        </p>

        <ul className="space-y-2 mb-6">
          {[
            "Browse all approved talent profiles",
            "Advanced search & filters (skills, location, availability)",
            "Contact talent directly",
            "Save candidates to folders",
            "Job posting (coming soon)",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-400">
          Questions? Email{" "}
          <a href={`mailto:${platformConfig.supportEmail}`} className="text-blue-600 hover:underline">
            {platformConfig.supportEmail}
          </a>
        </p>
      </section>

      {/* Account */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Account</h2>
        <p className="text-sm text-slate-500 mb-1">Signed in as</p>
        <p className="text-slate-800 font-medium text-sm mb-5">sarah@techflow.com</p>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </section>
    </div>
  );
}
