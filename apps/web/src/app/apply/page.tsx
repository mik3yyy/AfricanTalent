import type { Metadata } from "next";
import { platformConfig } from "@platform/config";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WaitlistForm } from "@/components/ui/waitlist-form";
import {
  CheckCircle,
  Star,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Apply — Join the Talent Waitlist",
  description: `Apply to join ${platformConfig.name} as a vetted remote talent professional. Limited spots available in cohort 1.`,
};

const benefits = [
  {
    icon: Globe,
    title: "Work with global companies",
    desc: "Land roles at tech companies across the US, UK, EU, and beyond.",
  },
  {
    icon: DollarSign,
    title: "Earn global-rate salaries",
    desc: "Get paid market rates for your skills — no African discount.",
  },
  {
    icon: Shield,
    title: "No hidden commissions",
    desc: "We charge a flat subscription. You keep 100% of your earnings.",
  },
  {
    icon: TrendingUp,
    title: "Career growth support",
    desc: "Access coaching, resume review, and salary negotiation support.",
  },
  {
    icon: Clock,
    title: "Fast-tracked matching",
    desc: "Get matched with relevant roles within 48 hours of listing.",
  },
  {
    icon: Star,
    title: "Featured profile option",
    desc: "Boost your visibility with a Featured listing and 3x more inquiries.",
  },
];


export default function ApplyPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* Hero section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B4FD8]/15 via-slate-950 to-transparent pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#1B4FD8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4FD8]/10 border border-[#1B4FD8]/30 text-[#818CF8] text-xs font-semibold mb-6 tracking-wide">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  COHORT 1 — SPOTS FILLING FAST
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
                  Join Africa&apos;s{" "}
                  <span className="gradient-text">top 1%</span>{" "}
                  of remote talent
                </h1>

                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  {platformConfig.name} connects exceptional African remote professionals with the world&apos;s best companies. Apply to join our vetted talent pool and access opportunities you won&apos;t find anywhere else.
                </p>

                {/* Benefits grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1B4FD8]/20 border border-[#1B4FD8]/30 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#818CF8]" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold mb-0.5">
                          {title}
                        </div>
                        <div className="text-slate-500 text-xs leading-relaxed">
                          {desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Waitlist form */}
              <div>
                <div className="glass-card rounded-2xl p-8 border border-[#1B4FD8]/20">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Reserve your spot
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Join the waitlist now. We&apos;ll invite you to complete your full profile when your cohort opens.
                    </p>
                  </div>

                  <WaitlistForm defaultRole="talent" />

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                      <p className="text-slate-500 text-xs">
                        Accepted talent is notified within 5–7 business days of completing vetting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats below form */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { value: "<10%", label: "Acceptance rate" },
                    { value: "48h", label: "Avg. match time" },
                    { value: "3x", label: "Salary increase" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="text-center p-3 rounded-xl glass-card border border-white/5"
                    >
                      <div className="text-xl font-extrabold gradient-text">{value}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing — single fee */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Simple, one-time pricing
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Pay once after you&apos;re approved. No subscriptions, no recurring fees. Active for 90 days, then reapply.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-6xl font-extrabold text-white mb-2">
                $25
              </div>
              <div className="text-slate-400 text-sm mb-6">one-time · paid after approval · active 90 days</div>
              <ul className="space-y-3 text-left max-w-xs mx-auto mb-8">
                {[
                  "Listed in curated talent directory",
                  "Visible to all verified companies",
                  "Direct contact from global companies",
                  "Active for 90 days per cohort",
                  "Reapply each cohort — no auto-renewal",
                  "Only approved talent gets listed",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 shrink-0 text-[#10B981]" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-slate-500 text-xs">
                Payment is only collected after your application is accepted.
              </p>
            </div>
          </div>
        </section>

        {/* Process section */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              What happens after you apply?
            </h2>
            <p className="text-slate-400 text-sm mb-10">
              Our vetting process is designed to be thorough but fair. Here&apos;s exactly what to expect.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Waitlist confirmation",
                  desc: "You get an immediate confirmation email. We review applications in batches every 2 weeks.",
                },
                {
                  step: "2",
                  title: "Skills assessment",
                  desc: "Accepted candidates receive a technical challenge or portfolio review relevant to their role.",
                },
                {
                  step: "3",
                  title: "Final interview",
                  desc: "A 30-minute video call to assess communication skills, remote work readiness, and culture fit.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="glass-card rounded-2xl p-5 border border-white/5 text-left">
                  <div className="w-8 h-8 rounded-full bg-[#1B4FD8]/20 border border-[#1B4FD8]/30 flex items-center justify-center text-[#818CF8] text-sm font-bold mb-3">
                    {step}
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">{title}</div>
                  <div className="text-slate-400 text-xs leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
