import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { sendMessage } from '../model/sendMessage'

// Ограничение Telegram / GREEN-API на длину текста
const MAX_LENGTH = 4096

interface MessageComposerProps {
  chatId: string
}

export const MessageComposer = ({ chatId }: MessageComposerProps) => {
  const [text, setText] = useState('')
  const canSend = text.trim() !== ''

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSend) return

    sendMessage(chatId, text.trim())
    setText('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border bg-background p-3"
    >
      <Input
        name="message"
        autoComplete="off"
        autoFocus
        placeholder="Сообщение"
        maxLength={MAX_LENGTH}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-11 flex-1 border-none bg-input"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Отправить"
        disabled={!canSend}
        className="size-11 shrink-0 rounded-full"
      >
        <SendHorizontal />
      </Button>
    </form>
  )
}
