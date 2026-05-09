"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bookmark, Settings, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { label: "Browse", href: "/search" },
  { label: "AI", href: "/ai" },
  { label: "Saved", href: "/saved" },
];

export function Topbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const registered = useRef(false);

  // Silently register this viewer in Flask on first load (idempotent upsert)
  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user?.email) return;
      const meta = user.user_metadata as Record<string, unknown> | undefined;
      const vp = (meta?.viewer_profile ?? {}) as Record<string, string>;
      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          contactName: (meta?.full_name as string) ?? "",
          jobTitle: vp.who ?? "",
          companyName: vp.companyName ?? "",
          city: vp.city ?? "",
          country: vp.country ?? "",
        }),
      }).catch(() => {});
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 h-14"
      style={{
        background: "linear-gradient(to bottom, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.60) 80%, transparent 100%)",
      }}
    >
      {/* Logo */}
      <Link href="/search" className="flex items-center gap-2 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs border"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.20)" }}
        >
          AT
        </div>
        <span className="font-bold text-white text-base tracking-tight hidden sm:block">AfriTalent</span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {NAV.map(({ label, href }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: active ? "#ffffff" : "rgba(255,255,255,0.50)",
                backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/search"
          className="p-2 rounded-lg transition-colors"
          style={{ color: "rgba(255,255,255,0.50)" }}
        >
          <Search className="w-4 h-4" />
        </Link>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-lg overflow-hidden border flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.20)" }}
          >
            ME
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-10 z-20 rounded-xl border overflow-hidden min-w-40"
                style={{ backgroundColor: "#141414", borderColor: "rgba(255,255,255,0.12)" }}
              >
                <Link
                  href="/saved"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Bookmark className="w-4 h-4" /> Saved
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
