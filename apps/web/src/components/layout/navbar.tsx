"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { platformConfig } from "@platform/config";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Companies", href: "/companies" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-blur-[16px] bg-white/[0.04] border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label={platformConfig.name}
          >
            <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.14] transition-all duration-200">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg leading-none">
              {platformConfig.shortName}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/50 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/[0.05]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/companies">
              <Button variant="outline" size="sm">
                For Companies
              </Button>
            </Link>
            <Link href="/apply">
              <Button variant="primary" size="sm">
                Join Waitlist
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-white/50 hover:text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/[0.05]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/companies" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="md" fullWidth>
                  For Companies
                </Button>
              </Link>
              <Link href="/apply" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" fullWidth>
                  Join Waitlist
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
