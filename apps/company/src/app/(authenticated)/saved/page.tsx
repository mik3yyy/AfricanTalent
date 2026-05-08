"use client";

import { useState } from "react";
import { mockTalent } from "@/lib/mock-data";
import { Folder, Trash2, ExternalLink, UserCircle } from "lucide-react";
import Link from "next/link";

type SavedFolder = { name: string; candidates: typeof mockTalent };

const initialFolders: SavedFolder[] = [
  { name: "Frontend Shortlist", candidates: [mockTalent[0], mockTalent[2]] },
  { name: "Interviewed", candidates: [mockTalent[4]] },
  { name: "Offer Pending", candidates: [] },
];

export default function SavedPage() {
  const [folders, setFolders] = useState(initialFolders);
  const [expanded, setExpanded] = useState<string | null>("Frontend Shortlist");

  const removeCandidate = (folderName: string, candidateId: string) => {
    setFolders((f) =>
      f.map((folder) =>
        folder.name === folderName
          ? { ...folder, candidates: folder.candidates.filter((c) => c.id !== candidateId) }
          : folder
      )
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Saved Candidates</h1>
        <p className="text-slate-500 mt-1">Organize candidates into folders for easy tracking</p>
      </div>

      <div className="space-y-4">
        {folders.map((folder) => (
          <div key={folder.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === folder.name ? null : folder.name)}
              className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
            >
              <Folder className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="font-semibold text-slate-800 flex-1 text-left">{folder.name}</span>
              <span className="text-sm text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {folder.candidates.length}
              </span>
              <span className="text-slate-400 text-sm">{expanded === folder.name ? "▲" : "▼"}</span>
            </button>

            {expanded === folder.name && (
              <div className="border-t border-slate-100">
                {folder.candidates.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    <UserCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No candidates in this folder
                  </div>
                ) : (
                  folder.candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {candidate.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{candidate.name}</p>
                        <p className="text-slate-500 text-xs truncate">{candidate.headline}</p>
                        <p className="text-slate-400 text-xs">{candidate.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/talent/${candidate.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => removeCandidate(folder.name, candidate.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
