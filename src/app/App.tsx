import { useSessionStore } from '@/entities/session'
import { ChatPage } from '@/pages/chat'
import { LoginPage } from '@/pages/login'

export const App = () => {
  const isAuthorized = useSessionStore((state) => state.credentials !== null)

  return isAuthorized ? <ChatPage /> : <LoginPage />
}
