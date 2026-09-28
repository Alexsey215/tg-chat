import { cn } from '@/shared/lib/utils'

export const ChatWindowEmpty = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'flex h-full flex-1 items-center justify-center bg-linear-to-br from-chat-from to-chat-to',
        className,
      )}
    >
      <div className="rounded-2xl bg-background/70 px-6 py-4 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
        Выберите чат или создайте новый
      </div>
    </div>
  )
}
