import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { platformConfig } from "@platform/config";
import { WaitlistForm } from "@/components/ui/waitlist-form";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <Hero />

        {/* How it works */}
        <HowItWorks />

        {/* Stats */}
        <Stats />

        {/* Testimonials */}
        <Testimonials />

        {/* Pricing */}
        <Pricing />

        {/* FAQ */}
        <FAQ />

        {/* Final CTA section */}
        <section className="py-24 relative overflow-hidden">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
          {/* Top border line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-white/50 text-xs font-semibold mb-6 tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
              LIMITED EARLY ACCESS — COHORT 1
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Ready to work with{" "}
              <span className="gradient-text">the world&apos;s best</span>?
            </h2>

            <p className="text-white/45 text-lg mb-10 leading-relaxed">
              Join {platformConfig.name} today. 500 talent spots available for our founding cohort — claim yours before they&apos;re gone.
            </p>

            {/* Waitlist form */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 text-left">
              <div className="flex items-center gap-2 mb-6">
                <ArrowRight className="w-4 h-4 text-white/50" />
                <span className="text-white font-semibold text-sm">
                  Secure your spot on the waitlist
                </span>
              </div>
              <WaitlistForm />
            </div>

            <p className="mt-6 text-white/30 text-sm">
              No spam. Unsubscribe any time. We&apos;ll only email you about your waitlist status.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
