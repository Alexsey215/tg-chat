import { useMemo, useState } from 'react'
import { LogOut, MessageCircle, SquarePen } from 'lucide-react'
import { ChatListItem, getChatTitle, useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { logout } from '@/features/auth'
import { CreateChatDialog } from '@/features/create-chat'
import { formatChatTime } from '@/shared/lib/date'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

interface ChatSidebarProps {
  isOnline: boolean
  className?: string
}

export const ChatSidebar = ({ isOnline, className }: ChatSidebarProps) => {
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const selectChat = useChatStore((state) => state.selectChat)
  const messagesByChat = useMessageStore((state) => state.byChat)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Сверху чат с самой свежей активностью, как в мессенджерах
  const items = useMemo(
    () =>
      chats
        .map((chat) => {
          const lastMessage = messagesByChat[chat.id]?.at(-1)
          return { chat, lastMessage, activity: lastMessage?.timestamp ?? chat.createdAt }
        })
        .sort((a, b) => b.activity - a.activity),
    [chats, messagesByChat],
  )

  return (
    <aside
      className={cn(
        'flex h-full w-full shrink-0 flex-col border-r border-border bg-background md:w-[360px]',
        className,
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <div>
          <h1 className="text-xl font-semibold">Чаты</h1>
          {!isOnline && (
            <p className="text-xs text-muted-foreground">Нет соединения, переподключаемся…</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Новый чат"
            onClick={() => setIsCreateOpen(true)}
          >
            <SquarePen />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Выйти" onClick={logout}>
            <LogOut />
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Чатов пока нет</p>
            <p className="text-sm text-muted-foreground">Создайте чат по номеру телефона</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>Новый чат</Button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {items.map(({ chat, lastMessage, activity }) => (
            <ChatListItem
              key={chat.id}
              title={getChatTitle(chat)}
              seed={chat.phone}
              preview={lastMessage?.text}
              time={formatChatTime(activity)}
              active={chat.id === activeChatId}
              onClick={() => selectChat(chat.id)}
            />
          ))}
        </div>
      )}

      <CreateChatDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </aside>
  )
}
