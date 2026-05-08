import { platformConfig } from "@platform/config";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Globe, Users, Zap, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#050505" }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
        style={{
          backgroundColor: "rgba(5,5,5,0.80)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm border"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.20)",
            }}
          >
            AT
          </div>
          <span className="font-semibold text-white">
            {platformConfig.shortName}
          </span>
        </div>
        <SignInButton variant="outline" size="sm" />
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
        {/* Background radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          {/* Cohort badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs font-medium rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.40)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.60)" }}
            />
            Cohort {platformConfig.cohort.currentNumber} — Now accepting applications
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
            {platformConfig.tagline}
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
            Join{" "}
            <span className="text-white font-medium">{platformConfig.name}</span> — the
            exclusive directory connecting Africa&apos;s top professionals with
            world-class global teams. Limited to{" "}
            {platformConfig.cohort.maxSize.toLocaleString()} professionals per cohort.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignInButton variant="primary" size="lg" />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              One-time activation fee: ${platformConfig.cohort.activationFee} · Paid after approval
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why {platformConfig.shortName}?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
              We&apos;re not a job board. We&apos;re a curated network of
              Africa&apos;s finest talent, vetted and ready for global
              opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: "Global Reach",
                description:
                  "Connect with companies across North America, Europe, and Asia looking for African talent.",
              },
              {
                icon: Users,
                title: "Curated Network",
                description:
                  "Every professional is vetted. Companies trust our quality standards.",
              },
              {
                icon: Zap,
                title: "Fast Matches",
                description:
                  "Our smart matching surfaces your profile to the right companies automatically.",
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                description:
                  "Access to premium opportunities that accelerate your career trajectory.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{ color: "rgba(255,255,255,0.60)" }}
                  />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-16 px-4 border-y"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "500", label: "Max cohort size" },
              { value: "40+", label: "African countries" },
              { value: "200+", label: "Partner companies" },
              { value: "$25", label: "Application fee" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold mb-1 text-white">
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to join the network?
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
            Create your profile and get discovered by global companies looking
            for exceptional African talent.
          </p>
          <SignInButton variant="primary" size="lg" />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs border"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.20)",
              }}
            >
              AT
            </div>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              {platformConfig.name}
            </span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} {platformConfig.name}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
