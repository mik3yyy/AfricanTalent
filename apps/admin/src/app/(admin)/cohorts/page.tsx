"use client";

import { useState, useEffect } from "react";
import type { CohortData } from "@/lib/admin-db";
import { Plus, Users, ToggleLeft, ToggleRight, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMax, setNewMax] = useState(500);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editMax, setEditMax] = useState(500);

  useEffect(() => {
    fetch("/api/cohorts")
      .then(r => r.json())
      .then((d: { cohorts?: CohortData[] }) => setCohorts(d.cohorts ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleOpen = async (cohort: CohortData) => {
    const res = await fetch(`/api/cohorts/${cohort.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: !cohort.isOpen }),
    });
    const { cohort: updated } = await res.json() as { cohort: CohortData };
    setCohorts(prev => prev.map(c => c.id === cohort.id ? updated : c));
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const res = await fetch("/api/cohorts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), isOpen: false, maxSize: newMax }),
    });
    const { cohort } = await res.json() as { cohort: CohortData };
    setCohorts(prev => [cohort, ...prev]);
    setNewName(""); setNewMax(500); setCreating(false); setSaving(false);
  };

  const startEdit = (c: CohortData) => {
    setEditingId(c.id); setEditName(c.name); setEditMax(c.maxSize);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const res = await fetch(`/api/cohorts/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim(), maxSize: editMax }),
    });
    const { cohort: updated } = await res.json() as { cohort: CohortData };
    setCohorts(prev => prev.map(c => c.id === editingId ? updated : c));
    setEditingId(null); setSaving(false);
  };

  const deleteCohort = async (id: number) => {
    if (!confirm("Delete this cohort? This cannot be undone.")) return;
    await fetch(`/api/cohorts/${id}`, { method: "DELETE" });
    setCohorts(prev => prev.filter(c => c.id !== id));
  };

  const openCohorts = cohorts.filter(c => c.isOpen);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cohorts</h1>
          <p className="text-slate-500 mt-1">Name, open, and close admission windows</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> New Cohort
        </button>
      </div>

      {/* Active banner */}
      {openCohorts.length > 0 && (
        <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="font-semibold text-green-800">Currently accepting applications</p>
          </div>
          {openCohorts.map(c => (
            <p key={c.id} className="text-green-700 text-sm">
              {c.name} — {c.approved}/{c.maxSize} spots filled
            </p>
          ))}
        </div>
      )}

      {/* New cohort form */}
      {creating && (
        <div className="mb-4 bg-white rounded-2xl border border-blue-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-3">New Cohort</p>
          <div className="flex gap-3 flex-wrap">
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              placeholder="e.g. The Trailblazers · Q3 2026"
              className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 whitespace-nowrap">Max size</label>
              <input
                type="number"
                value={newMax}
                onChange={e => setNewMax(Number(e.target.value))}
                className="w-20 px-2 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={saving || !newName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Create
            </button>
            <button onClick={() => setCreating(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : cohorts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No cohorts yet. Create your first one.</div>
      ) : (
        <div className="space-y-4">
          {cohorts.map(cohort => (
            <div key={cohort.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {editingId === cohort.id ? (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <input
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500">Max</label>
                        <input
                          type="number"
                          value={editMax}
                          onChange={e => setEditMax(Number(e.target.value))}
                          className="w-20 px-2 py-1.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-lg font-bold text-slate-900">{cohort.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        cohort.isOpen ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {cohort.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Max Size</p>
                      <p className="font-semibold text-slate-800">{cohort.maxSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Approved</p>
                      <p className="font-semibold text-slate-800">{cohort.approved}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Pending</p>
                      <p className="font-semibold text-slate-800">{cohort.pending}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Spots filled</span>
                      <span>{cohort.approved}/{cohort.maxSize}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.min((cohort.approved / cohort.maxSize) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => toggleOpen(cohort)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      cohort.isOpen
                        ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {cohort.isOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {cohort.isOpen ? "Close" : "Open"}
                  </button>
                  <button
                    onClick={() => startEdit(cohort)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Rename
                  </button>
                  <button
                    onClick={() => deleteCohort(cohort.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
