"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { useRouter, usePathname } from "next/navigation"

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/bills", label: "Bills" },
    { href: "/cards", label: "Cards" },
    { href: "/cash", label: "Cash" },
    { href: "/salary", label: "Salary" },
    { href: "/expenses", label: "Expenses" },
    { href: "/budget", label: "Budget" },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              Accounting
            </Link>
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href ? "bg-primary text-white" : "text-foreground hover:bg-background-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-background-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-secondary">{user?.name}</span>
              <span className="badge badge-success text-xs">{user?.role}</span>
            </div>

            <button onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
