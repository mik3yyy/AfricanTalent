"use client";

import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ user, onMenuClick, title }: TopbarProps) {
  const [imgError, setImgError] = useState(false);
  const displayName = user.name ?? user.email ?? "User";
  const initials = getInitials(displayName);

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 h-16 flex items-center gap-4 px-4 sm:px-6 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.06]">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      {title && (
        <h1 className="text-base font-semibold text-white hidden sm:block">
          {title}
        </h1>
      )}

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications placeholder */}
        <button className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white/60 rounded-full" />
        </button>

        {/* User avatar */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {user.avatarUrl && !imgError ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-white bg-white/10">
                {initials}
              </div>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white/80 leading-tight">
              {displayName.split(" ")[0]}
            </p>
            <p className="text-xs text-white/40 leading-tight truncate max-w-[120px]">
              {user.email}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
