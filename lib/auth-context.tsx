"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient, type SupabaseClient, type Session, type AuthChangeEvent } from "@supabase/supabase-js"
import type { User, UserRole } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  isAuthenticated: boolean
  supabase: SupabaseClient | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Get user profile from database
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (userData) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: userData.name || "",
              role: (userData.role || "user") as UserRole,
              createdAt: new Date(userData.created_at),
            })
          }
        }

        // Subscribe to auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
          if (event === "SIGNED_IN" && session?.user) {
            const { data: userData } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single()

            if (userData) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: userData.name || "",
                role: (userData.role || "user") as UserRole,
                createdAt: new Date(userData.created_at),
              })
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null)
          }
        })

        return () => subscription?.unsubscribe()
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Fetch user profile
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (userData) {
          setUser({
            id: data.user.id,
            email: data.user.email || "",
            name: userData.name || "",
            role: (userData.role || "user") as UserRole,
            createdAt: new Date(userData.created_at),
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email,
            name,
            role: "user",
          },
        ])

        if (profileError) throw profileError

        // User created successfully
        // They may need to verify email before login
        setUser({
          id: data.user.id,
          email,
          name,
          role: "user",
          createdAt: new Date(),
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
        supabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
