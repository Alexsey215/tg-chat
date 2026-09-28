import { useMessageStore, type Message } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { greenApi } from '@/shared/api'

const deliver = async (message: Message) => {
  const { credentials } = useSessionStore.getState()
  const { updateMessage } = useMessageStore.getState()
  if (!credentials) return

  try {
    const { idMessage } = await greenApi.sendMessage(credentials, {
      chatId: message.chatId,
      message: message.text,
    })
    updateMessage(message.chatId, message.id, { status: 'sent', idMessage })
  } catch {
    updateMessage(message.chatId, message.id, { status: 'failed' })
  }
}

// Сообщение сразу попадает в ленту со статусом pending, а статус меняется по ответу API
export const sendMessage = (chatId: string, text: string) => {
  const message: Message = {
    id: crypto.randomUUID(),
    chatId,
    text,
    direction: 'out',
    timestamp: Date.now(),
    status: 'pending',
  }

  useMessageStore.getState().addMessage(message)
  return deliver(message)
}

export const resendMessage = (message: Message) => {
  useMessageStore.getState().updateMessage(message.chatId, message.id, { status: 'pending' })
  return deliver(message)
}
