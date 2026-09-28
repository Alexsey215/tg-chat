import { useLayoutEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ChatAvatar, getChatTitle, type Chat } from '@/entities/chat'
import { MessageBubble, useChatMessages } from '@/entities/message'
import { MessageComposer, resendMessage } from '@/features/send-message'
import { formatMessageTime } from '@/shared/lib/date'
import { formatPhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui/button'

interface ChatWindowProps {
  chat: Chat
  onBack: () => void
}

export const ChatWindow = ({ chat, onBack }: ChatWindowProps) => {
  const messages = useChatMessages(chat.id)
  const listRef = useRef<HTMLDivElement>(null)
  const title = getChatTitle(chat)

  // layout-эффект, чтобы прокрутка случилась до отрисовки и лента не «прыгала»
  useLayoutEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [chat.id, messages.length])

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="К списку чатов"
          onClick={onBack}
          className="-ml-2 md:hidden"
        >
          <ArrowLeft />
        </Button>
        <ChatAvatar seed={chat.phone} label={title} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium">{title}</p>
          <p className="truncate text-sm text-muted-foreground">
            {chat.name ? formatPhone(chat.phone) : 'Telegram'}
          </p>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex flex-1 flex-col overflow-y-auto bg-linear-to-br from-chat-from to-chat-to p-4"
      >
        {/* mt-auto вместо justify-end: с justify-end верх переполненной ленты не прокручивается */}
        <div className="mt-auto flex flex-col gap-2">
          {messages.length === 0 && (
            <p className="self-center rounded-full bg-background/70 px-4 py-1.5 text-sm backdrop-blur-sm">
              Сообщений пока нет, напишите первым
            </p>
          )}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              text={message.text}
              time={formatMessageTime(message.timestamp)}
              direction={message.direction}
              status={message.status}
              onRetry={() => resendMessage(message)}
            />
          ))}
        </div>
      </div>

      {/* key сбрасывает черновик при переключении чата */}
      <MessageComposer key={chat.id} chatId={chat.id} />
    </div>
  )
}
