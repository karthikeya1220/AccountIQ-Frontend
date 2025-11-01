"use client"

import { useState } from "react"
import Link from "next/link"
import { useSupabaseAuth } from "@/lib/supabase-auth-context"
import { useTheme } from "@/lib/theme-context"
import { useRouter, usePathname } from "next/navigation"
import { Moon, Sun, Menu, X } from "lucide-react"
import { LogoutConfirmation } from "@/components/common/logout-confirmation"

export function Navbar() {
  const { user, userRole, signOut, loading: authLoading } = useSupabaseAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [logoutError, setLogoutError] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogoutClick = () => {
    console.log('[Navbar] Logout button clicked, showing confirmation')
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = async () => {
    // Prevent multiple logout attempts
    if (logoutLoading) return
    
    setLogoutLoading(true)
    setLogoutError("")
    
    console.log('[Navbar] Logout confirmed, starting logout...')
    
    try {
      await signOut()
      console.log('[Navbar] Logout successful')
      setShowLogoutConfirm(false)
      // Router redirect is handled by the auth context
    } catch (error: any) {
      console.error('[Navbar] Logout error:', error)
      const errorMessage = error?.message || 'Failed to logout'
      setLogoutError(errorMessage)
      
      // Show error for 5 seconds then clear
      setTimeout(() => {
        setLogoutError("")
      }, 5000)
    } finally {
      setLogoutLoading(false)
    }
  }

  const handleCancelLogout = () => {
    console.log('[Navbar] Logout cancelled')
    setShowLogoutConfirm(false)
    setLogoutError("")
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
      <div className="px-3 sm:px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <Link href="/dashboard" className="text-lg sm:text-xl font-bold text-primary">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
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

            <div className="flex flex-col items-end gap-1">
              {logoutError && (
                <span className="text-xs text-red-600 dark:text-red-400">{logoutError}</span>
              )}
              <button 
                onClick={handleLogoutClick} 
                disabled={logoutLoading || authLoading}
                className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-background-secondary transition-colors"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-background-secondary transition-colors"
              aria-label="Toggle menu"
              title="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href ? "bg-primary text-white" : "text-foreground hover:bg-background-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-border pt-3 mt-3 space-y-2">
              {user?.email && (
                <Link 
                  href="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-background-secondary rounded-md transition-colors"
                >
                  Profile ({user.email.charAt(0).toUpperCase()})
                </Link>
              )}
              {userRole && (
                <div className="px-3 py-2 text-sm">
                  <span className="badge badge-success text-xs capitalize">{userRole}</span>
                </div>
              )}
              <button 
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogoutClick()
                }}
                disabled={logoutLoading || authLoading}
                className="w-full btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Logout
              </button>
              {logoutError && (
                <span className="block text-xs text-red-600 dark:text-red-400 px-3">{logoutError}</span>
              )}
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        <LogoutConfirmation
          isOpen={showLogoutConfirm}
          isLoading={logoutLoading}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      </div>
    </nav>
  )
}
