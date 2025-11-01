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
    { href: "/reminders", label: "Reminders" },
    { href: "/employees", label: "Employees" },
  ]

  return (
    <nav className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <span className="font-black">A</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-base sm:text-lg font-bold text-foreground">
                  Accounting
                </span>
                <span className="text-xs text-foreground/60 font-medium">Dashboard</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-0.5 ml-6 pl-6 border-l border-border/40">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === item.href 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-foreground/70 hover:text-foreground hover:bg-background-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-background-secondary transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-border/40"></div>

            {/* Profile & Role */}
            <div className="flex items-center gap-2">
              {user?.email && (
                <Link 
                  href="/profile" 
                  className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold hover:shadow-lg hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all cursor-pointer" 
                  title="View Profile"
                >
                  {user.email.charAt(0).toUpperCase()}
                </Link>
              )}
              {userRole && (
                <span className="hidden sm:inline badge badge-success text-xs capitalize px-2 py-1">{userRole}</span>
              )}
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogoutClick} 
              disabled={logoutLoading || authLoading}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout from your account"
            >
              Logout
            </button>
            {logoutError && (
              <span className="text-xs text-red-600 dark:text-red-400 px-2">{logoutError}</span>
            )}
          </div>

          {/* Mobile/Tablet Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-background-secondary transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-background-secondary transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Toggle menu"
              title="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/50 backdrop-blur py-3 sm:py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 px-2">
              {/* Navigation Links */}
              <div className="space-y-1 pb-3 sm:pb-4 border-b border-border/40">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pathname === item.href 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-foreground/70 hover:text-foreground hover:bg-background-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* User Section */}
              <div className="space-y-2 pt-3 sm:pt-4">
                {user?.email && (
                  <Link 
                    href="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile</p>
                      <p className="text-xs text-foreground/60">{user.email}</p>
                    </div>
                  </Link>
                )}
                
                {userRole && (
                  <div className="px-3 py-2">
                    <span className="badge badge-success text-xs capitalize px-2 py-1">{userRole}</span>
                  </div>
                )}
                
                {/* Logout Button */}
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogoutClick()
                  }}
                  disabled={logoutLoading || authLoading}
                  className="w-full px-3 py-2.5 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
                
                {logoutError && (
                  <span className="block text-xs text-red-600 dark:text-red-400 px-3 py-2 bg-red-50/50 dark:bg-red-900/10 rounded-lg">{logoutError}</span>
                )}
              </div>
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
