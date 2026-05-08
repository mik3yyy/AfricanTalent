"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "My Profile",
  "/profile/edit": "Edit Profile",
  "/settings": "Settings",
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase.auth]);

  const pageTitle = PAGE_TITLES[pathname] ?? "";

  const userMeta = {
    name: user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? null,
    email: user?.email ?? null,
    avatarUrl: user?.user_metadata?.avatar_url ?? null,
  };

  // Onboarding is a full-screen standalone experience — no sidebar or topbar
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#050505" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050505" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar
          user={userMeta}
          onMenuClick={() => setSidebarOpen(true)}
          title={pageTitle}
        />

        <main className="flex-1 pt-16 pb-20 lg:pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
