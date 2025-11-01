"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"
import { validators } from "@/lib/validators"
import { errorMapper } from "@/lib/error-mapper"
import { 
  ChartBarIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  SparklesIcon,
  ArrowRightIcon 
} from "@heroicons/react/24/outline"
import Link from "next/link"

export default function LoginPage() {
  const { signIn } = useSupabaseAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [showCooldownWarning, setShowCooldownWarning] = useState(false)

  // Handle cooldown countdown
  useEffect(() => {
    if (cooldownTime <= 0) return;

    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          setShowCooldownWarning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Sanitize inputs
    const sanitizedEmail = validators.sanitizeEmail(email);

    // Validate email
    if (!validators.validateEmail(sanitizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password
    const passwordValidation = validators.validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    // Check for suspicious patterns
    if (
      validators.containsSuspiciousPatterns(sanitizedEmail) ||
      validators.containsSuspiciousPatterns(password)
    ) {
      setError("Invalid input detected");
      console.warn('[Security] Suspicious input pattern detected');
      return;
    }

    setIsSubmitting(true)
    try {
      await signIn(sanitizedEmail, password)
      // Router redirect is handled by the auth context
    } catch (err: any) {
      const mapped = errorMapper.mapAuthError(err);
      setError(mapped.userMessage);
      
      // Check if rate limit error
      if (err.message?.includes("Too many login attempts")) {
        const match = err.message.match(/in (\d+) seconds/);
        const cooldown = parseInt(match?.[1] || "300", 10);
        setCooldownTime(cooldown);
        setShowCooldownWarning(true);
      }
      
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-accent/15 to-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-full blur-3xl" />
      
      <div className="relative w-full max-w-md z-10 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg shadow-primary/20">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-foreground/70 font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            Sign in to your Accounting Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
          
          {/* Card Content */}
          <div className="relative bg-card border border-border/40 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="admin@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-fade-in">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{error}</p>
                      {error.includes('Invalid login credentials') && (
                        <p className="text-xs mt-2 opacity-90">
                          💡 <strong>Tip:</strong> Make sure you've created a test account in Supabase. See <code className="bg-black/20 px-1 rounded text-xs">FIRST_LOGIN.md</code> for instructions.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Cooldown Warning */}
              {showCooldownWarning && cooldownTime > 0 && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Too many attempts</p>
                      <p className="text-xs mt-1">
                        Please try again in {cooldownTime} {cooldownTime === 1 ? "second" : "seconds"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cooldownTime > 0}
                className="relative w-full group/button"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-40 group-hover/button:opacity-60 transition duration-300 disabled:opacity-20" />
                <div className="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-black text-white font-semibold shadow-lg hover:bg-black/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRightIcon className="w-5 h-5 transition-transform transform group-hover/button:translate-x-1" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Demo Credentials */}
            {/* <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-xs font-semibold text-foreground/70 mb-2 flex items-center gap-2">
                <SparklesIcon className="w-3 h-3" />
                Demo Credentials
              </p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p><span className="font-medium">Email:</span> admin@accounting.com</p>
                <p><span className="font-medium">Password:</span> admin123</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
          >
            <ArrowRightIcon className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-foreground/50 mt-8">
          Secured by enterprise-grade encryption
        </p>
      </div>
    </div>
  )
}
