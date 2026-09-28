import { useActiveChat, useChatStore } from '@/entities/chat'
import { useNotificationsPolling } from '@/features/receive-messages'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow, ChatWindowEmpty } from '@/widgets/chat-window'

export const ChatPage = () => {
  const { isOnline } = useNotificationsPolling()
  const activeChat = useActiveChat()
  const selectChat = useChatStore((state) => state.selectChat)

  // На узком экране показываем либо список, либо открытый чат
  return (
    <div className="flex h-dvh overflow-hidden">
      <ChatSidebar isOnline={isOnline} className={activeChat ? 'hidden md:flex' : undefined} />
      {activeChat ? (
        <ChatWindow chat={activeChat} onBack={() => selectChat(null)} />
      ) : (
        <ChatWindowEmpty className="hidden md:flex" />
      )}
    </div>
  )
}
