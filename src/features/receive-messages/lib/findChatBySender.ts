import type { Chat } from '@/entities/chat'
import type { SenderData } from '@/shared/api'

// Чат создаётся по номеру (7999...@c.us), а ответ из Telegram приходит с числовым chatId.
// Сначала ищем по уже известному telegramId, потом по номеру отправителя
export const findChatBySender = (chats: Chat[], sender: SenderData) => {
  const phone = sender.senderPhoneNumber ? String(sender.senderPhoneNumber) : null

  return (
    chats.find(
      (chat) =>
        chat.telegramId === sender.chatId ||
        chat.id === sender.chatId ||
        (phone !== null && chat.phone === phone),
    ) ?? null
  )
}
