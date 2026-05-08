"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { platformConfig } from "@platform/config";
import { ArrowRight, Sparkles, Globe, Shield } from "lucide-react";
import { WaitlistForm } from "@/components/ui/waitlist-form";
import { Button } from "@/components/ui/button";

const badges = [
  { icon: Globe, text: "50+ Global Companies" },
  { icon: Shield, text: "Vetted Talent Only" },
  { icon: Sparkles, text: "500 Spots Per Cohort" },
];

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Solid dark background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Very faint radial vignette to give depth without color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
        {/* Announcement badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-white/60 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-white/50" />
          Early access now open — cohort 1 launching soon
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-6"
        >
          {platformConfig.tagline.split(" ").slice(0, 2).join(" ")}{" "}
          <span className="gradient-text">
            {platformConfig.tagline.split(" ").slice(2).join(" ")}
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto mb-4 leading-relaxed animate-slide-up">
          {platformConfig.description}. No agencies, no middlemen — just world-class talent matched to the right opportunity.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-slide-up">
          {badges.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-white/60 text-xs font-medium"
            >
              <Icon className="w-3.5 h-3.5 text-white/50" />
              {text}
            </div>
          ))}
        </div>

        {/* Waitlist form */}
        <div className="max-w-lg mx-auto mb-8 animate-slide-up glass-card rounded-2xl p-6">
          <p className="text-white/60 text-sm font-medium mb-4">
            Join the waitlist — be first in line
          </p>
          <WaitlistForm defaultRole="talent" />
        </div>

        {/* Alternative CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <p className="text-white/35 text-sm">Hiring instead?</p>
          <Link href="/companies">
            <Button variant="outline" size="md">
              Learn How It Works For Companies
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Social proof numbers */}
        <div className="mt-16 pt-10 border-t border-white/[0.06] grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { value: "500", label: "Spots this cohort" },
            { value: "50+", label: "Partner companies" },
            { value: "$0", label: "Agency fees" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                {value}
              </div>
              <div className="text-white/45 text-xs sm:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </section>
  );
}
