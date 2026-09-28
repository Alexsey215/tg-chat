import { formatPhone } from '@/shared/lib/phone'
import type { Chat } from '../model/types'

export const getChatTitle = (chat: Chat) => chat.name ?? formatPhone(chat.phone)
