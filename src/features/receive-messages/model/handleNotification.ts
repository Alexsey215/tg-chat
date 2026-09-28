import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import type { IncomingMessageNotification, NotificationBody } from '@/shared/api'
import { findChatBySender } from '../lib/findChatBySender'

const isIncomingMessage = (body: NotificationBody): body is IncomingMessageNotification =>
  body.typeWebhook === 'incomingMessageReceived'

export const handleNotification = (body: NotificationBody) => {
  if (!isIncomingMessage(body)) return

  const { idMessage, timestamp, senderData, messageData } = body
  const text = messageData.textMessageData?.textMessage ?? messageData.extendedTextMessageData?.text
  if (!text || (senderData.chatType && senderData.chatType !== 'user')) return

  const { chats, updateChat } = useChatStore.getState()
  const chat = findChatBySender(chats, senderData)
  // Аккаунт в инстансе может быть личным: сообщения из чатов, которых нет в списке, не показываем
  if (!chat) return

  if (!chat.telegramId) {
    updateChat(chat.id, {
      telegramId: senderData.chatId,
      name: chat.name ?? (senderData.senderContactName || senderData.senderName || undefined),
    })
  }

  useMessageStore.getState().addMessage({
    id: idMessage,
    idMessage,
    chatId: chat.id,
    text,
    direction: 'in',
    timestamp: timestamp * 1000,
  })
}
