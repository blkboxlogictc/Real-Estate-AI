import { Link } from "wouter";
import { Bot, Shield, Zap, BarChart, Phone, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Navbar */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
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

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            The Command Center for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Modern Real Estate</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop losing leads to missed calls. Deploy an intelligent voice assistant that answers 24/7, qualifies prospects, and books appointments directly to your calendar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto group">
                Deploy Your Agent
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto bg-background/50 backdrop-blur-sm border-border">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Purpose-built tools for top-producing agents and teams.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Phone, title: "24/7 Voice Reception", desc: "Never miss a lead. Our AI answers inbound calls with your custom greeting and personality." },
              { icon: Shield, title: "Intelligent Qualification", desc: "Extracts intent, budget, and timeline automatically from natural conversations." },
              { icon: Calendar, title: "Direct Booking", desc: "Seamlessly integrates with your calendar to schedule showings and listing appointments." },
              { icon: BarChart, title: "Deep Analytics", desc: "Track call outcomes, conversion rates, and lead sources in a high-density dashboard." },
              { icon: Zap, title: "Instant Handoff", desc: "Hot leads are transferred to your cell instantly based on your custom routing rules." },
              { icon: Bot, title: "Custom Knowledge", desc: "Train your agent on your active listings, FAQs, and office policies in minutes." }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
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

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">Real Estate AI Assistant</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Real Estate AI Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
