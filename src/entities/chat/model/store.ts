import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chat } from './types'

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  createChat: (phone: string) => string
  selectChat: (id: string | null) => void
  updateChat: (id: string, patch: Partial<Omit<Chat, 'id'>>) => void
  reset: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,

      createChat: (phone) => {
        const id = `${phone}@c.us`

        if (!get().chats.some((chat) => chat.id === id)) {
          set((state) => ({ chats: [{ id, phone, createdAt: Date.now() }, ...state.chats] }))
        }
        set({ activeChatId: id })
        return id
      },

      selectChat: (id) => set({ activeChatId: id }),

      updateChat: (id, patch) =>
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === id ? { ...chat, ...patch } : chat)),
        })),

      reset: () => set({ chats: [], activeChatId: null }),
    }),
    { name: 'tg-chat:chats' },
  ),
)

export const useActiveChat = () =>
  useChatStore((state) => state.chats.find((chat) => chat.id === state.activeChatId) ?? null)
