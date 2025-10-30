import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SupabaseAuthProvider } from "@/lib/supabase-auth-context"
import { ThemeProvider } from "@/lib/theme-context"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Accounting Dashboard",
  description: "Internal accounting application for IT consulting",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${geistMono.className} min-h-screen bg-background text-foreground antialiased`}>        
        <ThemeProvider>
          <SupabaseAuthProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
              Skip to content
            </a>
            {children}
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
