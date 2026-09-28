export type MessageStatus = 'pending' | 'sent' | 'failed'

export interface Message {
  id: string
  chatId: string
  text: string
  direction: 'in' | 'out'
  timestamp: number
  status?: MessageStatus
  // id из GREEN-API, по нему отсекаем дубли из очереди
  idMessage?: string
}
