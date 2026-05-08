"use client";

import { useState, useEffect } from "react";
import type { CompanyUser } from "@/lib/admin-db";
import { Loader2, Building2 } from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then(r => r.json())
      .then((d: { companies?: CompanyUser[] }) => setCompanies(d.companies ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
        <p className="text-slate-500 mt-1">{loading ? "Loading…" : `${companies.length} company accounts`}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No company accounts yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Account</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden md:table-cell">Role / Type</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium hidden lg:table-cell">Location</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{c.companyName || c.contactName || c.email}</p>
                        <p className="text-xs text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
                      {c.jobTitle || "viewer"}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell text-slate-600 text-sm">
                    {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    {new Date(c.joinedDate).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
