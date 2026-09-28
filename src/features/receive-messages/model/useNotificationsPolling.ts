import { useEffect, useState } from 'react'
import { useSessionStore } from '@/entities/session'
import { greenApi } from '@/shared/api'
import { handleNotification } from './handleNotification'

const RECEIVE_TIMEOUT_SEC = 20
const RETRY_DELAY_MS = 5000

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })

export const useNotificationsPolling = () => {
  const credentials = useSessionStore((state) => state.credentials)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (!credentials) return

    const controller = new AbortController()
    const { signal } = controller

    const poll = async () => {
      while (!signal.aborted) {
        try {
          const notification = await greenApi.receiveNotification(credentials, {
            receiveTimeout: RECEIVE_TIMEOUT_SEC,
            signal,
          })
          setIsOnline(true)
          if (!notification) continue

          // Удаляем даже то, что не смогли разобрать, иначе очередь застрянет на этом уведомлении
          try {
            handleNotification(notification.body)
          } finally {
            await greenApi.deleteNotification(credentials, notification.receiptId, signal)
          }
        } catch {
          if (signal.aborted) return
          setIsOnline(false)
          await wait(RETRY_DELAY_MS, signal)
        }
      }
    }

    poll()
    return () => controller.abort()
  }, [credentials])

  return { isOnline }
}
