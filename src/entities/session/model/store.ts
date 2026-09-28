import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GreenApiCredentials } from '@/shared/api'

interface SessionState {
  credentials: GreenApiCredentials | null
  login: (credentials: GreenApiCredentials) => void
  logout: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      login: (credentials) => set({ credentials }),
      logout: () => set({ credentials: null }),
    }),
    { name: 'tg-chat:session' },
  ),
)
