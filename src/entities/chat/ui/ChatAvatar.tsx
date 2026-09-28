import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/utils'
import { getAvatarGradient } from '../lib/getAvatarGradient'
import { getAvatarLabel } from '../lib/getAvatarLabel'

interface ChatAvatarProps {
  seed: string
  label: string
  size?: 'sm' | 'md'
}

export const ChatAvatar = ({ seed, label, size = 'md' }: ChatAvatarProps) => {
  const { from, to } = getAvatarGradient(seed)

  return (
    <Avatar
      className={size === 'sm' ? 'size-10' : 'size-12'}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <AvatarFallback
        className={cn(
          'bg-transparent font-medium text-white',
          size === 'sm' ? 'text-sm' : 'text-base',
        )}
      >
        {getAvatarLabel(label)}
      </AvatarFallback>
    </Avatar>
  )
}
