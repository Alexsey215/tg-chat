import { beforeEach, describe, expect, it } from 'vitest'
import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import type { IncomingMessageNotification } from '@/shared/api'
import incomingText from './__fixtures__/incomingText.json'
import { handleNotification } from './handleNotification'

// Реальный формат ответа из Telegram: chatId числовой, номер лежит отдельно
const notification = incomingText as IncomingMessageNotification
const CHAT_ID = '79991234567@c.us'

const withChanges = (patch: Partial<IncomingMessageNotification>) => ({ ...notification, ...patch })

describe('handleNotification', () => {
  beforeEach(() => {
    useChatStore.getState().reset()
    useMessageStore.getState().reset()
    useChatStore.getState().createChat('79991234567')
  })

  it('кладёт ответ в чат, созданный по номеру, и запоминает telegramId', () => {
    handleNotification(notification)

    const [message] = useMessageStore.getState().byChat[CHAT_ID]
    expect(message).toMatchObject({
      text: 'Привет! Всё дошло',
      direction: 'in',
      timestamp: 1790575217000,
    })
    expect(useChatStore.getState().chats[0]).toMatchObject({ telegramId: '100500', name: 'Иван' })
  })

  it('находит чат по telegramId, если номер скрыт', () => {
    handleNotification(notification)
    handleNotification(
      withChanges({
        idMessage: 'next',
        senderData: { ...notification.senderData, senderPhoneNumber: undefined },
      }),
    )

    expect(useMessageStore.getState().byChat[CHAT_ID]).toHaveLength(2)
  })

  it('не дублирует уведомление, пришедшее повторно', () => {
    handleNotification(notification)
    handleNotification(notification)

    expect(useMessageStore.getState().byChat[CHAT_ID]).toHaveLength(1)
  })

  it('игнорирует сообщения из чатов, которых нет в списке', () => {
    handleNotification(
      withChanges({
        senderData: { ...notification.senderData, chatId: '777', senderPhoneNumber: 70000000000 },
      }),
    )

    expect(useMessageStore.getState().byChat).toEqual({})
  })

  it('пропускает не текстовые сообщения и другие типы уведомлений', () => {
    handleNotification(withChanges({ messageData: { typeMessage: 'imageMessage' } }))
    handleNotification({ typeWebhook: 'outgoingMessageStatus' })

    expect(useMessageStore.getState().byChat).toEqual({})
  })
})
