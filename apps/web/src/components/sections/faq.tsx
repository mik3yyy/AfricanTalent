"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { platformConfig } from "@platform/config";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: `What makes ${platformConfig.shortName} different from LinkedIn or Upwork?`,
    answer: `Unlike LinkedIn (a network) or Upwork (a freelance marketplace), ${platformConfig.name} is a curated two-sided marketplace. Every talent profile is manually vetted — we accept fewer than 10% of applicants. Companies get a pre-screened shortlist in 48 hours, not hundreds of unqualified applications. And unlike Upwork, talent pays a flat subscription rather than losing a percentage of every invoice.`,
  },
  {
    question: "How does the vetting process work for talent?",
    answer:
      "Our vetting is a multi-stage process: (1) Application review — we check your CV, portfolio, and work history. (2) Technical assessment — role-specific challenges or code reviews. (3) Video interview — a 30-minute culture and communication assessment with our team. Only candidates who pass all three stages are listed on the platform. This typically takes 5–7 business days.",
  },
  {
    question: "What roles do you specialize in?",
    answer:
      "We specialize in high-demand remote roles: Software Engineers (frontend, backend, full-stack, mobile), Data Scientists & Analysts, Product Managers, UX/UI Designers, DevOps & Cloud Engineers, and Technical Project Managers. We focus on mid-to-senior level professionals with at least 3 years of relevant experience.",
  },
  {
    question: "Is it really free for companies?",
    answer:
      "Yes. Companies sign up and browse the talent pool at no cost. We may introduce optional paid job post boosts in the future, but access to the platform, profile browsing, and direct messaging will always be free for companies. We believe removing the cost barrier for companies leads to more and better opportunities for talent.",
  },
  {
    question: "What happens after I join the waitlist?",
    answer: `You'll receive a confirmation email immediately. When your cohort opens (we launch in batches of 500 talent and 50 companies), you'll get an invitation to complete your full profile or company setup. Early waitlist members get priority access and locked-in launch pricing. We'll also send occasional updates about the platform launch timeline.`,
  },
  {
    question: "Are there any placement fees or commissions?",
    answer:
      "Absolutely not. Talent keeps 100% of what they earn — we never take a cut from invoices or salaries. Talent pays a flat monthly subscription; companies access the platform for free. There are no placement fees, success fees, or hidden costs on either side.",
  },
  {
    question: "What regions does the talent come from?",
    answer:
      "We source talent from across Africa — with strong representation from Nigeria, Kenya, Ghana, South Africa, Egypt, Rwanda, Ethiopia, and more. All listed talent has strong English proficiency (written and spoken), is comfortable working in distributed/remote environments, and has demonstrated experience working with international teams or clients.",
  },
  {
    question: "Can talent work in multiple time zones?",
    answer:
      "Yes. Many of our talent explicitly choose roles that overlap with EU (UTC+0 to UTC+2) or US Eastern (UTC-5) business hours. African time zones (UTC+0 to UTC+3) offer excellent overlap with European companies and workable overlap with US East Coast teams. Each talent profile specifies their available working hours and preferred time zone overlaps.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "text-base font-medium transition-colors leading-snug",
            isOpen ? "text-white" : "text-white/60 group-hover:text-white"
          )}
        >
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 shrink-0 mt-0.5 text-white/25 transition-all duration-300",
            isOpen && "rotate-180 text-white/60"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-white/45 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-white/45 text-xs font-medium mb-4">
            Got questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-white/45">
            Everything you need to know about {platformConfig.name}. Can&apos;t find the answer?{" "}
            <a
              href={`mailto:${platformConfig.supportEmail}`}
              className="text-white/70 hover:text-white transition-colors underline underline-offset-2"
            >
              Email our team
            </a>
            .
          </p>
        </div>

        {/* FAQ list */}
        <div className="glass-card rounded-2xl px-6 sm:px-8 divide-y divide-white/0">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <p className="text-white/30 text-sm">
            Still have questions?{" "}
            <a
              href={`mailto:${platformConfig.supportEmail}`}
              className="text-white/60 hover:text-white transition-colors font-medium"
            >
              {platformConfig.supportEmail}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
