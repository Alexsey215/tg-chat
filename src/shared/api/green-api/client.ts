import type {
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  GreenApiCredentials,
  ReceivedNotification,
  SendMessageParams,
  SendMessageResponse,
} from './types'

export class GreenApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  pathSuffix?: string
  query?: Record<string, string | number>
  signal?: AbortSignal
}

const request = async <T>(
  credentials: GreenApiCredentials,
  apiMethod: string,
  { method = 'GET', body, pathSuffix, query, signal }: RequestOptions = {},
): Promise<T> => {
  const { apiUrl, idInstance, apiTokenInstance } = credentials
  const base = apiUrl.replace(/\/+$/, '')
  const url = new URL(`${base}/waInstance${idInstance}/${apiMethod}/${apiTokenInstance}`)

  if (pathSuffix) url.pathname += `/${pathSuffix}`
  if (query) {
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)))
  }

  const response = await fetch(url, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new GreenApiError(
      response.status,
      `${apiMethod}: ${response.status} ${response.statusText}`,
    )
  }

  // receiveNotification на пустой очереди отвечает пустым телом / null
  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}

export const getStateInstance = (credentials: GreenApiCredentials, signal?: AbortSignal) =>
  request<GetStateInstanceResponse>(credentials, 'getStateInstance', { signal })

export const sendMessage = (
  credentials: GreenApiCredentials,
  params: SendMessageParams,
  signal?: AbortSignal,
) =>
  request<SendMessageResponse>(credentials, 'sendMessage', { method: 'POST', body: params, signal })

export const receiveNotification = (
  credentials: GreenApiCredentials,
  { receiveTimeout = 20, signal }: { receiveTimeout?: number; signal?: AbortSignal } = {},
) =>
  request<ReceivedNotification | null>(credentials, 'receiveNotification', {
    query: { receiveTimeout },
    signal,
  })

export const deleteNotification = (
  credentials: GreenApiCredentials,
  receiptId: number,
  signal?: AbortSignal,
) =>
  request<DeleteNotificationResponse>(credentials, 'deleteNotification', {
    method: 'DELETE',
    pathSuffix: String(receiptId),
    signal,
  })
