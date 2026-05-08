import { mockTalent } from "@/lib/mock-data";
import { Mail, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const mockContacts = [
  { id: "1", talentId: "1", message: "We're looking for a React developer with your skills.", status: "pending", date: "2 hours ago" },
  { id: "2", talentId: "3", message: "Interested in a UX design contract role.", status: "accepted", date: "1 day ago" },
  { id: "3", talentId: "5", message: "We have an exciting PM opportunity.", status: "declined", date: "3 days ago" },
  { id: "4", talentId: "2", message: "Looking for a Node.js backend engineer.", status: "pending", date: "5 days ago" },
  { id: "5", talentId: "7", message: "Content creator role available.", status: "expired", date: "8 days ago" },
];

const statusConfig = {
  pending: { icon: Clock, label: "Pending", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  accepted: { icon: CheckCircle, label: "Accepted", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  declined: { icon: XCircle, label: "Declined", color: "text-red-500", bg: "bg-red-50 border-red-200" },
  expired: { icon: AlertCircle, label: "Expired", color: "text-slate-400", bg: "bg-slate-50 border-slate-200" },
};

export default function ContactsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Contact Requests</h1>
        <p className="text-slate-500 mt-1">Track your outreach history</p>
      </div>

      <div className="space-y-3">
        {mockContacts.map((contact) => {
          const talent = mockTalent.find((t) => t.id === contact.talentId);
          if (!talent) return null;
          const { icon: Icon, label, color, bg } = statusConfig[contact.status as keyof typeof statusConfig];
          const initials = talent.name.split(" ").map((n: string) => n[0]).join("").toUpperCase();

          return (
            <div key={contact.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/talent/${talent.id}`}
                        className="font-semibold text-slate-800 hover:text-blue-600 text-sm"
                      >
                        {talent.name}
                      </Link>
                      <p className="text-slate-500 text-xs">{talent.headline} · {talent.location}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium shrink-0 ${bg} ${color}`}>
                      <Icon className="w-3 h-3" />
                      {label}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2">"{contact.message}"</p>
                  <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {contact.date}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
        <strong>Contact limit:</strong> 10/10 contacts used this month (Scout plan).{" "}
        <Link href="/settings" className="underline">Upgrade to Recruiter</Link> for unlimited contacts.
      </div>
    </div>
  );
}
