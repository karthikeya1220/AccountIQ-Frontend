'use client';

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase-client';
import { apiClient } from './api-client';
import { rateLimiter } from './rate-limiter';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user: User | null; session: Session | null } | void>;
  isAuthenticated: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Wrap async operation with timeout
 */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 60000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout after ${timeoutMs / 1000}s`)),
        timeoutMs
      )
    ),
  ]);
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Wire token to API client
      apiClient.setToken(session?.access_token ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Keep API client token in sync
      apiClient.setToken(session?.access_token ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string, skipLoadingReset = false) => {
    try {
      console.log('[Auth] Querying user role for ID:', userId);
      
      // Increase timeout to 15 seconds to account for Supabase latency
      const rolePromise = supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Fetch user role timeout')), 15000)
      );

      const { data, error } = await Promise.race([rolePromise, timeoutPromise]) as any;

      if (error) {
        console.warn('[Auth] Could not fetch user role from database:', error.message);
        console.warn('[Auth] User role fetch failed, role remains:', userRole);
      } else if (data?.role) {
        console.log('[Auth] User role fetched:', data.role);
        setUserRole(data.role);
      } else {
        console.warn('[Auth] No role in response from database');
      }
    } catch (error: any) {
      console.warn('[Auth] Exception in fetchUserRole:', error.message);
    } finally {
      if (!skipLoadingReset) {
        setLoading(false);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log('[Auth] Starting sign in for:', email);
    console.log('[Auth] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configured' : '✗ Missing');
    console.log('[Auth] Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing');
    
    // Check rate limiting
    if (rateLimiter.isLimited(email)) {
      const cooldown = rateLimiter.getRemainingCooldown(email);
      setLoading(false);
      throw new Error(
        `Too many login attempts. Please try again in ${cooldown} seconds.`
      );
    }
    
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }

      // Wrap with 60 second timeout (1 minute - allows for slower connections)
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        60000 // 60 seconds
      );

      if (error) {
        // Record failed attempt
        rateLimiter.recordAttempt(email);
        
        console.error('[Auth] Sign in error:', error);
        console.error('[Auth] Error code:', error.status);
        console.error('[Auth] Error details:', error.message);
        
        // Provide helpful error messages
        let userMessage = error.message;
        if (error.message === 'Invalid login credentials') {
          userMessage = 'Invalid email or password. Make sure your account exists in Supabase. See FIRST_LOGIN.md for setup instructions.';
        } else if (error.message?.includes('Email not confirmed')) {
          userMessage = 'Email not confirmed. Go to Supabase and enable "Auto Confirm User" when creating the account.';
        }
        
        setLoading(false);
        throw new Error(userMessage);
      }

      console.log('[Auth] Sign in successful, user:', data.user?.email);
      console.log('[Auth] Session received:', !!data.session);
      
      if (data.session) {
        // Clear attempts on success
        rateLimiter.reset(email);
        
        setSession(data.session);
        setUser(data.user);
        // Set API token for backend requests
        apiClient.setToken(data.session.access_token ?? null);
        
        // Fetch user role without resetting loading state
        console.log('[Auth] Fetching user role for ID:', data.user?.id);
        await fetchUserRole(data.user.id, true);
        
        // Set loading to false
        console.log('[Auth] Setting loading to false');
        setLoading(false);
        
        // Use startTransition for the router push to ensure proper state updates
        console.log('[Auth] Starting navigation transition');
        startTransition(() => {
          router.push('/dashboard');
        });
      } else {
        console.warn('[Auth] No session returned from sign in');
        setLoading(false);
        throw new Error('Sign in succeeded but no session was created');
      }
    } catch (error: any) {
      console.error('[Auth] Sign in exception:', error);
      
      // Check if it's a timeout error
      const isTimeout = error.message?.includes('timeout');
      if (isTimeout) {
        rateLimiter.recordAttempt(email);
        const friendlyError = new Error(
          'Login request timed out. Please check your internet connection and try again.'
        );
        setLoading(false);
        throw friendlyError;
      }
      
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Create user profile in public.users table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            first_name: metadata?.firstName || '',
            last_name: metadata?.lastName || '',
            role: metadata?.role || 'user',
            is_active: true,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('[Auth] Starting sign out...');
    setLoading(true);
    
    try {
      // Clear state immediately to prevent UI from showing logged-in state
      console.log('[Auth] Clearing local state...');
      setUser(null);
      setSession(null);
      setUserRole(null);
      apiClient.setToken(null);
      
      // Clear any stored tokens or auth data from localStorage
      if (typeof window !== 'undefined') {
        console.log('[Auth] Clearing localStorage...');
        localStorage.removeItem('auth_token');
        sessionStorage.clear();
      }

      // Call Supabase sign out with timeout
      console.log('[Auth] Calling Supabase sign out...');
      const signOutPromise = supabase.auth.signOut();
      
      // Add 10 second timeout for Supabase sign out
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timeout')), 10000)
      );

      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;
      
      if (error) {
        console.warn('[Auth] Supabase sign out error:', error.message);
        console.warn('[Auth] Proceeding with local logout despite error');
      } else {
        console.log('[Auth] Supabase sign out successful');
      }

      console.log('[Auth] Redirecting to login...');
      setLoading(false);
      
      // Navigate to login page
      startTransition(() => {
        router.push('/login');
      });
    } catch (error: any) {
      console.error('[Auth] Sign out exception:', error);
      
      // Even if there's an error, we've already cleared local state
      // So still redirect to login
      console.log('[Auth] Proceeding with redirect despite error');
      setLoading(false);
      
      startTransition(() => {
        router.push('/login');
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        signUp,
        isAuthenticated: !!user,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}

// Alias for compatibility
export const useAuth = useSupabaseAuth;
