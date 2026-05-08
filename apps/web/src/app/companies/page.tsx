import { platformConfig } from "@platform/config";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CheckCircle2, Users, Search, Zap, Building2 } from "lucide-react";

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#10B981]/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]">
            <Building2 className="w-3.5 h-3.5" />
            Free for companies — always
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Hire exceptional
            <br />
            <span className="text-[#10B981]">African talent</span> — directly
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Skip the $8k–15k recruiter fees. Access a curated pool of
            pre-vetted African developers, designers, PMs, and more — completely
            free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`https://${platformConfig.domain}/company`}
              className="px-8 py-4 rounded-xl font-semibold text-white bg-[#10B981] hover:bg-[#059669] transition-colors text-lg"
            >
              Get Started Free
            </Link>
            <p className="text-slate-500 text-sm">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-4 border-y border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: Search,
              title: "Pre-vetted talent",
              body: "Every profile is manually reviewed — portfolios, GitHub, experience. No resume spam.",
            },
            {
              icon: Zap,
              title: "Direct contact",
              body: "No middleman. Send a contact request and connect directly. No bidding wars.",
            },
            {
              icon: Users,
              title: "Actively seeking",
              body: "Talent pays to be here. Everyone in the pool is actively looking for opportunities.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center px-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            70% cheaper than traditional recruiting
          </h2>
        </div>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-slate-400">Method</th>
                <th className="text-right py-3 px-4 text-slate-400">Cost</th>
                <th className="text-right py-3 px-4 text-slate-400">Quality</th>
              </tr>
            </thead>
            <tbody>
              {[
                { method: "Andela / Agency", cost: "$8k–15k per hire", quality: "High" },
                { method: "LinkedIn Recruiter", cost: "$1,200/month", quality: "Variable" },
                { method: "Upwork/Fiverr", cost: "20% commission", quality: "Low" },
                { method: `${platformConfig.shortName}`, cost: "Free", quality: "High", highlight: true },
              ].map(({ method, cost, quality, highlight }) => (
                <tr
                  key={method}
                  className={`border-b border-slate-800 ${highlight ? "bg-[#10B981]/5" : ""}`}
                >
                  <td className={`py-3 px-4 ${highlight ? "text-[#10B981] font-semibold" : "text-slate-300"}`}>
                    {highlight && "✓ "}{method}
                  </td>
                  <td className={`py-3 px-4 text-right ${highlight ? "text-[#10B981] font-semibold" : "text-slate-400"}`}>
                    {cost}
                  </td>
                  <td className={`py-3 px-4 text-right ${highlight ? "text-[#10B981] font-semibold" : "text-slate-400"}`}>
                    {quality}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Free for companies</h2>
            <p className="text-slate-400">
              Browse, search, and contact talent at zero cost. Talent pays to be listed — you
              don&apos;t.
            </p>
          </div>
          <div className="rounded-2xl border border-[#10B981] bg-[#10B981]/5 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              <div>
                <div className="text-4xl font-bold text-white mb-1">
                  $0
                  <span className="text-base font-normal text-slate-400">/month</span>
                </div>
                <div className="text-lg font-semibold text-white">Full Access</div>
                <p className="text-slate-400 text-sm mt-1">Everything included, no hidden fees</p>
              </div>
              <Link
                href={`https://${platformConfig.domain}/company`}
                className="px-8 py-4 rounded-xl font-semibold text-white bg-[#10B981] hover:bg-[#059669] transition-colors text-center whitespace-nowrap"
              >
                Get Started Free
              </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Browse all approved profiles",
                "Advanced search & filters",
                "Contact talent directly",
                "Save candidates to folders",
                "Filter by skills, location, availability",
                "Filter by salary expectations",
                "Job posting (coming soon)",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
