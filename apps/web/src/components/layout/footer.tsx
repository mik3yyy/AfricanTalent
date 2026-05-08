import Link from "next/link";
import { platformConfig } from "@platform/config";
import { Zap, Twitter, Linkedin, Github, Mail } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "For Companies", href: "/companies" },
  ],
  Talent: [
    { label: "Apply Now", href: "/apply" },
    { label: "Standard Plan", href: "/apply" },
    { label: "Featured Plan", href: "/apply" },
    { label: "Success Stories", href: "/#testimonials" },
  ],
  Company: [
    { label: "Post a Job", href: "/companies" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Browse Talent", href: "/companies" },
    { label: "Contact Sales", href: `mailto:${platformConfig.supportEmail}` },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Contact Us", href: `mailto:${platformConfig.supportEmail}` },
  ],
};

const socials = [
  { icon: Twitter, href: "https://twitter.com/afritalent", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/afritalent", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/afritalent", label: "GitHub" },
  { icon: Mail, href: `mailto:${platformConfig.supportEmail}`, label: "Email" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.06]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.14] transition-all duration-200">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                {platformConfig.shortName}
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              {platformConfig.description}
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            &copy; {currentYear} {platformConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/30 text-sm">
            <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
            <span>Early access open — limited spots</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
