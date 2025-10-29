'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' }
  )
);

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark) => set({ isDark }),
    }),
    { name: 'theme-store' }
  )
);

interface UiState {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  selectedItem: any | null;
  setSelectedItem: (item: any) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      modalOpen: false,
      setModalOpen: (open) => set({ modalOpen: open }),
      selectedItem: null,
      setSelectedItem: (item) => set({ selectedItem: item }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
