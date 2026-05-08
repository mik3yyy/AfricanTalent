import Link from "next/link";
import { platformConfig } from "@platform/config";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "talent",
    name: "Talent",
    price: platformConfig.cohort.activationFee,
    billing: "one-time · paid after approval",
    description: "Get discovered by top global companies. Reviewed by hand — only the best make it in.",
    popular: true,
    cta: "Apply Now",
    href: "/apply",
    features: [
      "Listed in searchable talent pool",
      "Profile visible to all companies",
      "Direct contact from companies",
      "Active for 90 days per cohort",
      "Reapply each cohort period",
      "Skills & experience verification",
      "Community access",
    ],
  },
  {
    id: "company",
    name: "Companies",
    price: 0,
    billing: "always free",
    description: "Browse and contact pre-vetted African talent with no subscription fees.",
    popular: false,
    cta: "Get Started Free",
    href: `https://${platformConfig.domain}/company`,
    features: [
      "Browse all approved profiles",
      "Advanced search & filters",
      "Contact talent directly",
      "Save candidates to folders",
      "Job posting (coming soon)",
      "No credit card required",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-white/45 text-xs font-medium mb-4">
            Simple, transparent pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            One fee.{" "}
            <span className="gradient-text">No subscriptions.</span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Talent pays once after approval. Companies always access the pool for free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-8 flex flex-col",
                "glass-card",
                plan.popular && "border-white/[0.15] shadow-[0_0_40px_rgba(255,255,255,0.04)]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide bg-white text-black">
                  FOR TALENT
                </div>
              )}

              <div className="text-white font-bold text-lg mb-2">{plan.name}</div>
              <p className="text-white/45 text-sm mb-6 leading-relaxed">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  {plan.price > 0 && <span className="text-white/45 text-lg">$</span>}
                  <span className="text-5xl font-extrabold text-white">
                    {plan.price === 0 ? "Free" : plan.price}
                  </span>
                </div>
                <div className="text-white/30 text-xs mt-1">{plan.billing}</div>
              </div>

              <Link href={plan.href} className="block mb-8">
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  size="lg"
                  fullWidth
                >
                  {plan.cta}
                </Button>
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-white/50" />
                    <span className="text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-sm mt-8">
          Active for 90 days per cohort — reapply to stay listed after each period.
        </p>
      </div>
    </section>
  );
}
