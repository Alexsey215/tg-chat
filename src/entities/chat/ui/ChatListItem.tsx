import { cn } from '@/shared/lib/utils'
import { ChatAvatar } from './ChatAvatar'

interface ChatListItemProps {
  title: string
  seed: string
  preview?: string
  time?: string
  active?: boolean
  onClick?: () => void
}

export const ChatListItem = ({
  title,
  seed,
  preview,
  time,
  active,
  onClick,
}: ChatListItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent',
        active && 'bg-selected hover:bg-selected',
      )}
    >
      <ChatAvatar seed={seed} label={title} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{title}</span>
          {time && <span className="shrink-0 text-xs text-muted-foreground">{time}</span>}
        </div>
        {preview && <p className="truncate text-sm text-muted-foreground">{preview}</p>}
      </div>
    </button>
  )
}
