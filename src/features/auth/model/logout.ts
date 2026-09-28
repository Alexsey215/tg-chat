import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { useSessionStore } from '@/entities/session'

export const logout = () => {
  useMessageStore.getState().reset()
  useChatStore.getState().reset()
  useSessionStore.getState().logout()
}
