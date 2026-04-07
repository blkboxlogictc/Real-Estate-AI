import { Link } from "wouter";
import { useState } from "react";
import {
  Bot, Shield, Zap, BarChart, Phone, Calendar, ArrowRight,
  CheckCircle2, ChevronDown, ChevronUp, Star, Users, TrendingUp, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Set up your AI profile",
    description:
      "Complete the onboarding wizard in under 15 minutes. Enter your listings, FAQs, scheduling preferences, and define your assistant's personality — professional, warm, or direct.",
    detail: "No technical setup. Just answer questions about how you run your business. Your assistant learns your inventory, service areas, and escalation rules instantly.",
  },
  {
    step: "02",
    title: "Get your dedicated phone number",
    description:
      "Choose a local phone number from any area code. Your AI assistant answers every call with your custom greeting, 24 hours a day, 7 days a week — including nights and weekends.",
    detail: "Forward your existing number or use the new one directly. Callers experience a natural, professional conversation — not a robotic phone tree.",
  },
  {
    step: "03",
    title: "Assistant qualifies and books leads",
    description:
      "The AI collects the caller's name, intent, budget, and timeline. It books appointments directly into your calendar and creates a lead record automatically.",
    detail: "Configured escalation rules ensure hot leads — callers ready to make an offer, or those who ask for a human — are transferred to you instantly.",
  },
  {
    step: "04",
    title: "Review your command center",
    description:
      "Every call is summarized and transcribed. Leads are tracked through your pipeline. Appointments sync with Google Calendar. Analytics show what's working.",
    detail: "Nothing slips through the cracks. You start every morning knowing exactly who called, what they want, and what's on your schedule.",
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$79",
    period: "/month",
    description: "Perfect for solo agents getting started with AI reception.",
    badge: null,
    features: [
      "200 AI-handled calls per month",
      "1 dedicated phone number",
      "Lead capture and CRM",
      "Appointment scheduling",
      "Call summaries and transcripts",
      "Email support",
    ],
    cta: "Start Free Trial",
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$179",
    period: "/month",
    description: "For top producers who never want to miss a lead.",
    badge: "Most Popular",
    features: [
      "Unlimited AI-handled calls",
      "2 dedicated phone numbers",
      "Advanced lead qualification",
      "Google Calendar integration",
      "Custom voice and personality",
      "Vapi AI voice assistant",
      "Priority support",
      "Call analytics dashboard",
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
  },
  {
    name: "Team",
    price: "$399",
    period: "/month",
    description: "For brokerages and teams scaling their operations.",
    badge: null,
    features: [
      "Everything in Professional",
      "Up to 5 agent seats",
      "Team dashboard and reporting",
      "MLS / IDX data integration",
      "Custom AI training per agent",
      "Dedicated account manager",
      "API access for integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

const FAQS = [
  {
    q: "Does it sound like a robot?",
    a: "No. The AI uses natural language and your custom greeting. Most callers don't realize they're speaking with an AI — and those that do report the experience feels helpful and professional.",
  },
  {
    q: "What happens when someone wants to make an offer?",
    a: "Your escalation rules handle this. The assistant will tell the caller you'll be with them shortly and can transfer the call to your cell immediately, or take a detailed message for an urgent callback.",
  },
  {
    q: "Does it work with my existing phone number?",
    a: "Yes. You can forward your existing number to your REAA number, or use the new one directly. Both work — the transition is seamless for your clients.",
  },
  {
    q: "How long does setup take?",
    a: "Most agents are live within 20 minutes of signing up. The onboarding wizard guides you through each step — no technical knowledge required.",
  },
  {
    q: "What if I already have a CRM?",
    a: "REAA captures leads automatically. API access on Team plans allows you to push leads directly into your existing CRM. Individual integrations with Follow Up Boss, LionDesk, and kvCORE are on the roadmap.",
  },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">

      {/* ── NAVBAR ── */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">Real Estate AI Assistant</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary mb-8 font-medium">
            <Zap className="h-3.5 w-3.5" />
            Now with real-time lead qualification
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            The Command Center for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Modern Real Estate
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop losing leads to missed calls. Deploy an intelligent voice assistant that answers 24/7, qualifies prospects, and books appointments directly to your calendar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto group" data-testid="cta-hero-signup">
                Deploy Your Agent
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto bg-background/50 backdrop-blur-sm border-border">
                See How it Works
              </Button>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
            {[
              { icon: Clock, text: "Setup in 20 minutes" },
              { icon: Users, text: "Trusted by 500+ agents" },
              { icon: TrendingUp, text: "Average 3.2x more leads captured" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Purpose-built tools for top-producing agents and teams — not generic software adapted for real estate.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Phone, title: "24/7 Voice Reception", desc: "Never miss a lead. Your AI answers inbound calls with your custom greeting and personality — nights, weekends, holidays." },
              { icon: Shield, title: "Intelligent Qualification", desc: "Extracts intent, budget, timeline, and urgency automatically from natural conversations. Every lead is scored before it hits your CRM." },
              { icon: Calendar, title: "Direct Booking", desc: "Seamlessly integrates with Google Calendar to schedule showings and listing appointments without back-and-forth." },
              { icon: BarChart, title: "Deep Analytics", desc: "Track call outcomes, conversion rates, lead sources, and pipeline velocity in a high-density real-time dashboard." },
              { icon: Zap, title: "Instant Hot-Lead Handoff", desc: "High-intent callers are transferred to your cell in real time based on your custom routing rules. Never lose a ready buyer." },
              { icon: Bot, title: "Custom AI Knowledge", desc: "Train your agent on your active listings, neighborhood FAQs, and office policies. Updates take effect in minutes." },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 group">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From sign-up to your first AI-handled call in under 20 minutes — no technical setup required.
            </p>
          </div>
          <div className="space-y-8">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex gap-6 md:gap-10 p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-200 group"
                data-testid={`how-it-works-step-${i}`}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <span className="text-xl font-black text-primary">{step.step}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed border-l-2 border-primary/30 pl-4">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof strip */}
          <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-lg font-medium text-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              "I used to miss 40% of my inbound calls. Since deploying REAA, every call is answered, every lead is logged, and my calendar books itself. It paid for itself in the first week."
            </blockquote>
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold text-foreground">Jennifer M.</span> — Top Producer, Compass, San Francisco Bay Area
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-card/30 border-y border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No setup fees. No per-minute charges. Cancel anytime. Every plan includes a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PRICING_PLANS.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 border transition-all duration-200 ${
                  plan.badge
                    ? "border-primary bg-card shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-border bg-card hover:border-primary/40"
                }`}
                data-testid={`pricing-plan-${plan.name.toLowerCase()}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow-sm">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </div>

                <Link href={plan.cta === "Contact Sales" ? "/signup" : "/signup"}>
                  <Button
                    variant={plan.variant}
                    className="w-full mb-8"
                    size="lg"
                    data-testid={`pricing-cta-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            All plans include a 14-day free trial. No credit card required.
            Questions? <a href="mailto:hello@reaa.io" className="text-primary hover:underline">Contact our team</a>.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know before you deploy your first agent.
            </p>
          </div>
          <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {FAQS.map((faq, i) => (
              <div key={i} data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/30 transition-colors"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-sm md:text-base pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed bg-muted/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 bg-primary/5 border-t border-primary/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold mb-6">
            Your next lead is calling right now.
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Every missed call is a missed commission. Deploy your AI assistant today and start capturing every opportunity — 24 hours a day.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-14 px-12 text-lg group" data-testid="cta-bottom-signup">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">No credit card required. Live in 20 minutes.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold">Real Estate AI Assistant</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-foreground transition-colors">Log in</Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Real Estate AI Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
