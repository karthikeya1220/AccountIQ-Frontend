"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  ChartPieIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or system preference
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const features = [
    {
      icon: DocumentTextIcon,
      title: "Bills Management",
      description: "Upload, track, and manage bills with image/PDF proof and automated workflows.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: CreditCardIcon,
      title: "Card Management",
      description: "Track company credit/debit cards with real-time balance monitoring and limits.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Cash Transactions",
      description: "Log and export cash payments with category-based organization.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: ChartBarIcon,
      title: "Budget Control",
      description: "Set limits by category with real-time alerts and visual indicators.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: UserGroupIcon,
      title: "Salary Management",
      description: "Track monthly salary distribution with allowances and deductions.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: BellAlertIcon,
      title: "Smart Reminders",
      description: "Never miss a payment with configurable email and in-app notifications.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: ChartPieIcon,
      title: "Analytics Dashboard",
      description: "Interactive charts, KPIs, and insights with real-time data visualization.",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with role-based access and audit trails.",
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  const stats = [
    { label: "Transactions Tracked", value: "10,000+", icon: DocumentTextIcon },
    { label: "Active Users", value: "500+", icon: UserGroupIcon },
    { label: "Reports Generated", value: "2,500+", icon: ChartBarIcon },
    { label: "Uptime", value: "99.9%", icon: CheckCircleIcon },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <ChartBarIcon className="w-4 sm:w-6 h-4 sm:h-6 text-primary-foreground" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">
                Accounting
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-lg hover:bg-muted/50 transition-all duration-300 group"
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {mounted && (
                  <div className="relative w-5 h-5">
                    <SunIcon 
                      className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                        theme === "dark" 
                          ? "rotate-0 scale-100 opacity-100" 
                          : "rotate-90 scale-0 opacity-0"
                      }`}
                    />
                    <MoonIcon 
                      className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                        theme === "light" 
                          ? "rotate-0 scale-100 opacity-100" 
                          : "-rotate-90 scale-0 opacity-0"
                      }`}
                    />
                  </div>
                )}
              </button>
              <Link
                href="/login"
                className="hidden sm:block text-xs sm:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="btn-primary inline-flex items-center space-x-1 sm:space-x-2 group text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 lg:pt-32 pb-16 sm:pb-24 md:pb-32 px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20">
              <SparklesIcon className="w-3 sm:w-4 h-3 sm:h-4 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-primary truncate">
                Full-Stack TypeScript Solution
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-foreground">
                Modern Financial
              </span>
              <br />
              <span className="text-foreground">
                Management Platform
              </span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed font-medium px-2 sm:px-0">
              Comprehensive accounting solution for IT consulting startups. Track expenses, manage budgets, 
              and gain insights with real-time analytics—all in one beautiful interface.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 pt-2 sm:pt-4 px-2 sm:px-0">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto btn-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg inline-flex items-center justify-center space-x-2 group"
              >
                <span>Launch Dashboard</span>
                <ArrowRightIcon className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg inline-flex items-center justify-center space-x-2"
              >
                <LightBulbIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>View Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-card/50 backdrop-blur-sm border-y border-border/40 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-1 sm:space-y-2 p-3 sm:p-4 md:p-6 rounded-xl bg-background/50 border border-border/40 hover:border-primary/40 transition-all hover:shadow-lg"
              >
                <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-primary" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-foreground/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need to Manage Finances
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto font-medium px-2 sm:px-0">
              Powerful features designed to streamline your accounting workflows and provide actionable insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-4 sm:p-5 md:p-6 rounded-2xl bg-card border border-border/40 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  mounted ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative space-y-3 sm:space-y-4">
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-muted/20 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Built with Modern Technology
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto font-medium px-2 sm:px-0">
              Powered by TypeScript throughout the entire stack for type safety and developer experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/40 space-y-3 sm:space-y-4">
              <div className="text-2xl sm:text-3xl">⚡</div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Next.js 14 Frontend</h3>
              <p className="text-sm sm:text-base text-foreground/70 font-medium">
                React 18, Tailwind CSS, Zustand state management, and beautiful UI components.
              </p>
            </div>
            
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/40 space-y-3 sm:space-y-4">
              <div className="text-2xl sm:text-3xl">🚀</div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Express.js Backend</h3>
              <p className="text-sm sm:text-base text-foreground/70 font-medium">
                TypeScript APIs, JWT authentication, and comprehensive validation with Zod.
              </p>
            </div>
            
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/40 space-y-3 sm:space-y-4">
              <div className="text-2xl sm:text-3xl">🗄️</div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">PostgreSQL Database</h3>
              <p className="text-sm sm:text-base text-foreground/70 font-medium">
                Supabase integration with real-time features and secure file storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-6 sm:p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            <div className="relative text-center space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Ready to Transform Your Accounting?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-medium px-2 sm:px-0">
                Join hundreds of teams already using our platform to streamline their financial operations.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4 pt-2 sm:pt-4 px-2 sm:px-0">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-base md:text-lg font-medium rounded-lg bg-white text-primary hover:bg-white/90 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRightIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-base md:text-lg font-medium rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 border-t border-border/40 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <ChartBarIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-foreground truncate">Accounting Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-foreground/70 font-medium">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Login
              </Link>
              <a href="https://github.com/karthikeya1220/Accounting-Dashboard" className="hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
            
            <div className="text-xs sm:text-sm text-foreground/70 font-medium">
              © 2025 Accounting Dashboard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
