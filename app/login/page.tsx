"use client"

import type React from "react"

import { useState } from "react"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"

export default function LoginPage() {
  const { signIn, loading } = useSupabaseAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (!email || !password) {
        setError("Please fill in all fields")
        return
      }
      await signIn(email, password)
      // Router redirect is handled by the auth context
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
            <p className="mt-2 text-foreground-secondary">Internal Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="admin@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground-secondary">
            Default admin: admin@accounting.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
