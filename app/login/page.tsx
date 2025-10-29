"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("user")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError("Please fill in all fields")
        return
      }
      await login(email, password, role)
      router.push("/dashboard")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="input-field w-full">
                <option value="user">User (View Only)</option>
                <option value="admin">Admin (Editor)</option>
              </select>
            </div>

            {error && <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}

            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground-secondary">
            Demo credentials: any email + any password
          </p>
        </div>
      </div>
    </div>
  )
}
