export interface GreenApiCredentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type InstanceState =
  'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting' | 'yellowCard'

export interface GetStateInstanceResponse {
  stateInstance: InstanceState
}

export interface SendMessageParams {
  chatId: string
  message: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface SenderData {
  chatId: string
  chatType?: string
  sender: string
  chatName?: string
  senderName?: string
  senderContactName?: string
  // Telegram отдаёт номер, только если собеседник его не скрыл
  senderPhoneNumber?: number
}

export interface MessageData {
  typeMessage: string
  textMessageData?: {
    textMessage: string
  }
  extendedTextMessageData?: {
    text: string
  }
}

export interface IncomingMessageNotification {
  typeWebhook: 'incomingMessageReceived'
  idMessage: string
  timestamp: number
  senderData: SenderData
  messageData: MessageData
}

// В очередь падают и статусы, и исходящие, и смена состояния инстанса.
// Нас интересуют только входящие, остальное просто удаляем из очереди.
export interface OtherNotification {
  typeWebhook: string
  timestamp?: number
}

export type NotificationBody = IncomingMessageNotification | OtherNotification

export interface ReceivedNotification {
  receiptId: number
  body: NotificationBody
}

export interface DeleteNotificationResponse {
  result: boolean
}
