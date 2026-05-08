import { platformConfig } from "@platform/config";
import {
  UserCheck,
  Search,
  Handshake,
  Building2,
  ClipboardList,
  Rocket,
} from "lucide-react";

const talentSteps = [
  {
    step: "01",
    icon: UserCheck,
    title: "Apply & Get Vetted",
    description:
      "Submit your profile and go through our rigorous skills assessment. We verify your experience, run technical challenges, and conduct a culture-fit interview.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Build Your Profile",
    description:
      "Showcase your portfolio, skills, and availability on your profile. Choose Standard or Featured listing to control your visibility.",
  },
  {
    step: "03",
    icon: Handshake,
    title: "Get Matched & Hired",
    description:
      "Our algorithm connects you with companies that match your skills and rate expectations. Accept interviews, negotiate directly — no middlemen.",
  },
];

const companySteps = [
  {
    step: "01",
    icon: Building2,
    title: "Sign Up For Free",
    description:
      "Create a company account at no cost. Describe what you're looking for — the role, skills, timezone, and budget — and reach pre-vetted talent immediately.",
  },
  {
    step: "02",
    icon: Search,
    title: "Browse Curated Candidates",
    description:
      "Receive a shortlist of matched profiles within 48 hours. Filter by skill, experience level, availability, and rate — all talent is pre-screened.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Hire & Onboard Fast",
    description:
      "Interview, extend offers, and onboard — all within the platform. We handle compliance, contracts, and ongoing support so you can focus on building.",
  },
];

interface StepCardProps {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

function StepCard({ step, icon: Icon, title, description, index }: StepCardProps) {
  return (
    <div className="relative flex gap-4 group">
      {/* Connector line */}
      {index < 2 && (
        <div className="absolute left-6 top-14 w-0.5 h-[calc(100%+1.5rem)] bg-gradient-to-b from-white/10 to-transparent" />
      )}

      {/* Step number + icon */}
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20 group-hover:bg-white/[0.07]">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Content */}
      <div className="pb-10">
        <div className="text-xs font-bold tracking-widest mb-1 text-white/35 uppercase">
          Step {step}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-white/90 transition-colors">
          {title}
        </h3>
        <p className="text-white/45 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-white/45 text-xs font-medium mb-4">
            Simple by design
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            How{" "}
            <span className="gradient-text">{platformConfig.shortName}</span>{" "}
            works
          </h2>
          <p className="text-white/45 max-w-xl mx-auto text-base">
            A transparent, streamlined process for both sides of the marketplace — no agencies, no hidden fees.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Talent */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.06] flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-white/60" />
              </div>
              <div>
                <div className="text-xs text-white/40 font-semibold tracking-wide uppercase">For Talent</div>
                <h3 className="text-white font-bold text-lg leading-tight">Land your dream remote role</h3>
              </div>
            </div>
            <div className="space-y-0">
              {talentSteps.map((step, i) => (
                <StepCard key={step.step} {...step} index={i} />
              ))}
            </div>
          </div>

          {/* For Companies */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.06] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white/60" />
              </div>
              <div>
                <div className="text-xs text-white/40 font-semibold tracking-wide uppercase">For Companies</div>
                <h3 className="text-white font-bold text-lg leading-tight">Hire top talent in 48 hours — free</h3>
              </div>
            </div>
            <div className="space-y-0">
              {companySteps.map((step, i) => (
                <StepCard key={step.step} {...step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
