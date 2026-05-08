import { TrendingUp, Users, Globe2, Clock, Award, DollarSign } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500",
    suffix: "",
    label: "Spots per cohort",
    sublabel: "Limited to ensure quality",
  },
  {
    icon: Globe2,
    value: "50",
    suffix: "+",
    label: "Partner companies",
    sublabel: "Across US, UK & EU",
  },
  {
    icon: DollarSign,
    value: "0",
    suffix: "%",
    label: "Agency fees",
    sublabel: "Direct talent relationships",
  },
  {
    icon: Clock,
    value: "48",
    suffix: "h",
    label: "Average time to shortlist",
    sublabel: "Faster than any recruiter",
  },
  {
    icon: TrendingUp,
    value: "3x",
    suffix: "",
    label: "Salary increase",
    sublabel: "Average for placed talent",
  },
  {
    icon: Award,
    value: "94",
    suffix: "%",
    label: "Placement success rate",
    sublabel: "After first interview",
  },
];

export function Stats() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-white/45 text-xs font-medium mb-4">
            By the numbers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Built for{" "}
            <span className="gradient-text">real results</span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Not just a job board — a curated talent ecosystem designed to deliver measurable outcomes for everyone on the platform.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, sublabel }) => (
            <div
              key={label}
              className="glass-card rounded-2xl p-6 lg:p-8 group hover:scale-[1.02] transition-transform duration-200 hover:border-white/[0.14]"
            >
              <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center mb-4 group-hover:border-white/20 group-hover:bg-white/[0.07] transition-all duration-200">
                <Icon className="w-5 h-5 text-white/50" />
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold text-white mb-1 leading-none">
                {value}
                <span className="text-2xl lg:text-3xl">{suffix}</span>
              </div>
              <div className="text-white font-semibold text-sm mb-1">{label}</div>
              <div className="text-white/35 text-xs">{sublabel}</div>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-12 glass-card rounded-2xl p-8 text-center">
          <p className="text-white/70 text-base">
            <span className="text-white font-semibold">No placement fees. No commissions. No middlemen.</span>
            {" "}Just a flat monthly subscription that gives you access to Africa&apos;s top 1% of remote talent.
          </p>
        </div>
      </div>
    </section>
  );
}
