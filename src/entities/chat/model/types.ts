export interface Chat {
  // chatId для отправки: 79991234567@c.us
  id: string
  phone: string
  // Во входящих Telegram присылает числовой id пользователя вместо номера,
  // поэтому запоминаем его, как только сопоставили ответ с чатом
  telegramId?: string
  name?: string
  createdAt: number
}
