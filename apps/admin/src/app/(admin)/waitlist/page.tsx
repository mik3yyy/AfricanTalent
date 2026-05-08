"use client";

import { useState } from "react";
import { Mail, Download, Send } from "lucide-react";

const mockWaitlist = [
  { id: "1", email: "adaeze@gmail.com", firstName: "Adaeze", role: "developer", date: "2026-05-01", notified: false },
  { id: "2", email: "kwame@outlook.com", firstName: "Kwame", role: "designer", date: "2026-05-01", notified: false },
  { id: "3", email: "amira@yahoo.com", firstName: "Amira", role: "product_manager", date: "2026-05-02", notified: true },
  { id: "4", email: "bello@gmail.com", firstName: "Bello", role: "developer", date: "2026-05-02", notified: false },
  { id: "5", email: "zara@gmail.com", firstName: "Zara", role: "content_creator", date: "2026-05-03", notified: false },
  { id: "6", email: "nnamdi@hotmail.com", firstName: "Nnamdi", role: "developer", date: "2026-05-03", notified: false },
  { id: "7", email: "sarah@techflow.com", firstName: "Sarah", role: "company", date: "2026-05-03", notified: true },
  { id: "8", email: "kofi@gmail.com", firstName: "Kofi", role: "video_editor", date: "2026-05-04", notified: false },
];

export default function WaitlistPage() {
  const [list] = useState(mockWaitlist);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAnnounce = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      developer: "bg-blue-100 text-blue-700",
      designer: "bg-purple-100 text-purple-700",
      product_manager: "bg-green-100 text-green-700",
      video_editor: "bg-orange-100 text-orange-700",
      content_creator: "bg-pink-100 text-pink-700",
      company: "bg-slate-100 text-slate-700",
    };
    return map[role] ?? "bg-slate-100 text-slate-600";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Waitlist</h1>
          <p className="text-slate-500 mt-1">{list.length} signups · {list.filter((e) => !e.notified).length} not yet notified</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleAnnounce}
            disabled={sending || sent}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              sent
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Send className="w-4 h-4" />
            {sent ? "Announcement Sent!" : sending ? "Sending..." : "Send Cohort Announcement"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-slate-500 font-medium hidden md:table-cell">Name</th>
              <th className="text-left py-3 px-4 text-slate-500 font-medium">Role</th>
              <th className="text-left py-3 px-4 text-slate-500 font-medium hidden lg:table-cell">Date</th>
              <th className="text-left py-3 px-4 text-slate-500 font-medium">Notified</th>
            </tr>
          </thead>
          <tbody>
            {list.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-700">{entry.email}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 hidden md:table-cell">{entry.firstName}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge(entry.role)}`}>
                    {entry.role.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400 hidden lg:table-cell">{entry.date}</td>
                <td className="py-3 px-4">
                  {entry.notified ? (
                    <span className="text-xs text-green-600 font-medium">✓ Yes</span>
                  ) : (
                    <span className="text-xs text-slate-400">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
