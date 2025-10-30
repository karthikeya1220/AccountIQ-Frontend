"use client"

import Link from "next/link"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"
import { useTheme } from "@/lib/theme-context"
import { useRouter, usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"

export function Navbar() {
  const { user, userRole, signOut } = useSupabaseAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
    // Router redirect is handled by the auth context
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/bills", label: "Bills" },
    { href: "/cards", label: "Cards" },
    { href: "/cash", label: "Cash" },
    { href: "/salary", label: "Salary" },
    { href: "/expenses", label: "Expenses" },
    { href: "/budget", label: "Budget" },
    { href: "/employees", label: "Employees" },
  ]

  return (
    <nav className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6">
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

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-background-secondary transition-colors"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2">
              {user?.email && (
                <Link href="/profile" className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all cursor-pointer" title="View Profile">
                  {user.email.charAt(0).toUpperCase()}
                </Link>
              )}
              <span className="badge badge-success text-xs capitalize">{userRole}</span>
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
