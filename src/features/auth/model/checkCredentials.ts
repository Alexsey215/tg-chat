import { GreenApiError, greenApi, type GreenApiCredentials } from '@/shared/api'

// Возвращает текст ошибки для формы или null, если инстанс готов к работе
export const checkCredentials = async (credentials: GreenApiCredentials) => {
  try {
    const { stateInstance } = await greenApi.getStateInstance(credentials)

    if (stateInstance !== 'authorized') {
      return `Инстанс не авторизован в Telegram (статус: ${stateInstance})`
    }
    return null
  } catch (error) {
    if (error instanceof GreenApiError && [401, 403, 404].includes(error.status)) {
      return 'Неверный ID инстанса или токен'
    }
    return 'Не удалось подключиться к GREEN-API. Проверьте ID инстанса и интернет'
  }
}
