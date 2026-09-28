import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from './types'

interface MessageState {
  byChat: Record<string, Message[]>
  addMessage: (message: Message) => void
  updateMessage: (
    chatId: string,
    id: string,
    patch: Partial<Omit<Message, 'id' | 'chatId'>>,
  ) => void
  reset: () => void
}

// Один и тот же массив для пустых чатов: новый [] на каждый вызов селектора
// zustand считает изменением стейта и уходит в бесконечный ререндер
const EMPTY: Message[] = []

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      byChat: {},

      addMessage: (message) =>
        set((state) => {
          const list = state.byChat[message.chatId] ?? EMPTY
          const isDuplicate =
            message.idMessage && list.some((item) => item.idMessage === message.idMessage)

          if (isDuplicate) return state
          return { byChat: { ...state.byChat, [message.chatId]: [...list, message] } }
        }),

      updateMessage: (chatId, id, patch) =>
        set((state) => ({
          byChat: {
            ...state.byChat,
            [chatId]: (state.byChat[chatId] ?? EMPTY).map((message) =>
              message.id === id ? { ...message, ...patch } : message,
            ),
          },
        })),

      reset: () => set({ byChat: {} }),
    }),
    {
      name: 'tg-chat:messages',
      // после перезагрузки «отправляется» уже никогда не завершится
      merge: (persisted, current) => {
        const byChat = (persisted as Pick<MessageState, 'byChat'> | undefined)?.byChat ?? {}
        const fixed = Object.fromEntries(
          Object.entries(byChat).map(([chatId, list]) => [
            chatId,
            list.map((m) => (m.status === 'pending' ? { ...m, status: 'failed' as const } : m)),
          ]),
        )
        return { ...current, byChat: fixed }
      },
    },
  ),
)

export const useChatMessages = (chatId: string | null) =>
  useMessageStore((state) => (chatId ? (state.byChat[chatId] ?? EMPTY) : EMPTY))
