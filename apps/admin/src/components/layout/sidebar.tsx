"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { platformConfig } from "@platform/config";
import {
  LayoutDashboard, FileText, Users, Eye,
  BarChart2, Mail, Shield, LogOut, Loader2,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/applications", icon: FileText,         label: "Applications" },
  { href: "/members",      icon: Users,            label: "Members" },
  { href: "/viewers",      icon: Eye,              label: "Viewers" },
  { href: "/cohorts",      icon: Shield,           label: "Cohorts" },
  { href: "/waitlist",     icon: Mail,             label: "Waitlist" },
  { href: "/analytics",   icon: BarChart2,        label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            AT
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{platformConfig.shortName}</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@{platformConfig.domain}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {signingOut ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" /> : <LogOut className="w-4 h-4 shrink-0" />}
          Sign out
        </button>
      </div>
    </aside>
  );
}
