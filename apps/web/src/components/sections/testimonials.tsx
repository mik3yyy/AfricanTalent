import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amara Osei",
    role: "Senior Frontend Engineer",
    location: "Accra, Ghana",
    company: "Now at Vercel",
    avatar: "AO",
    rating: 5,
    quote:
      "I went from freelancing on Upwork at $25/hour to a full-time role at $95/hour through AfriTalent. The vetting process was rigorous — exactly what gives companies confidence to hire through the platform.",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Data Scientist",
    location: "Lagos, Nigeria",
    company: "Now at Shopify",
    avatar: "FA",
    rating: 5,
    quote:
      "AfriTalent didn't just help me find a job — they helped me negotiate a salary I didn't think was possible from Lagos. The Featured plan was worth every penny for the career coaching alone.",
  },
  {
    name: "David Chen",
    role: "Head of Engineering",
    location: "San Francisco, CA",
    company: "Startup (Series A)",
    avatar: "DC",
    rating: 5,
    quote:
      "We hired 4 engineers through AfriTalent in 3 months. The quality is incredible — these are developers who've been battle-tested. We cut our hiring cost by 60% vs. US-based talent without any quality drop.",
  },
  {
    name: "Chioma Eze",
    role: "Product Manager",
    location: "Nairobi, Kenya",
    company: "Now at Stripe",
    avatar: "CE",
    rating: 5,
    quote:
      "The platform matched me with a role that aligned perfectly with my background in fintech. Three rounds of interviews, an offer in hand in two weeks. The process was smoother than any recruiter I'd worked with before.",
  },
  {
    name: "Marcus Williams",
    role: "CTO",
    location: "London, UK",
    company: "FinTech startup",
    avatar: "MW",
    rating: 5,
    quote:
      "AfriTalent is the best-kept secret in remote hiring. Every candidate they sent us was genuinely strong. We've now built 40% of our engineering team through the platform.",
  },
  {
    name: "Kwame Asante",
    role: "Full-Stack Engineer",
    location: "Accra, Ghana",
    company: "Now at Linear",
    avatar: "KA",
    rating: 5,
    quote:
      "Being on AfriTalent changed my perspective on what remote work from Africa could look like. The support, the community, the coaching — it felt like someone was genuinely invested in my success.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-white/50 fill-white/50" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-white/45 text-xs font-medium mb-4">
            Real stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Trusted by talent{" "}
            <span className="gradient-text">&amp; companies</span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Hear from the talent who&apos;ve leveled up their careers and the companies who&apos;ve built world-class distributed teams.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:border-white/[0.14] transition-all duration-300 group hover:scale-[1.01]"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-white/15 group-hover:text-white/25 transition-colors" />

              {/* Rating */}
              <StarRating count={t.rating} />

              {/* Quote text */}
              <blockquote className="text-white/60 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/70 text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{t.name}</div>
                  <div className="text-white/35 text-xs truncate">
                    {t.role} · {t.location}
                  </div>
                  <div className="text-white/50 text-xs font-medium">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-14 glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <div className="flex -space-x-3">
              {["AO", "FA", "DC", "CE", "MW"].map((initials, i) => (
                <div
                  key={initials}
                  className="w-10 h-10 rounded-full border-2 border-[#050505] bg-white/10 flex items-center justify-center text-white/70 text-xs font-bold"
                  style={{ zIndex: 5 - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">
                Join 500+ professionals already on the waitlist
              </div>
              <div className="text-white/35 text-xs mt-0.5">
                From 30+ African countries · Working with companies in 15+ nations
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating count={5} />
              <span className="text-white font-bold text-sm">4.9/5</span>
              <span className="text-white/35 text-xs">avg rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
