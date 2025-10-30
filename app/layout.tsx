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
      <body className={`${geistSans.className} ${geistMono.className}`}>
        <ThemeProvider>
          <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
