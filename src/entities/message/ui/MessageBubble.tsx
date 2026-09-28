import { AlertCircle, Check, Clock } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { MessageStatus } from '../model/types'

interface MessageBubbleProps {
  text: string
  time: string
  direction: 'in' | 'out'
  status?: MessageStatus
  onRetry?: () => void
}

const StatusIcon = ({ status, onRetry }: { status: MessageStatus; onRetry?: () => void }) => {
  if (status === 'pending') return <Clock className="size-3" />
  if (status === 'sent') return <Check className="size-3" />

  return (
    <button
      type="button"
      onClick={onRetry}
      title="Не отправлено. Нажмите, чтобы повторить"
      aria-label="Повторить отправку"
      className="text-destructive"
    >
      <AlertCircle className="size-3" />
    </button>
  )
}

export const MessageBubble = ({ text, time, direction, status, onRetry }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        'max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm',
        direction === 'in' ? 'self-start bg-bubble-in' : 'self-end bg-bubble-out',
      )}
    >
      <span className="break-words whitespace-pre-wrap">{text}</span>
      <span className="float-right mt-1 ml-2 inline-flex translate-y-1 items-center gap-1 text-[11px] text-muted-foreground">
        {time}
        {status && <StatusIcon status={status} onRetry={onRetry} />}
      </span>
    </div>
  )
}
