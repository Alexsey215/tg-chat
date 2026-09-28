const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const weekdayFormat = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

const DAY = 24 * 60 * 60 * 1000

export const formatMessageTime = (timestamp: number) => timeFormat.format(timestamp)

// Как в списке чатов мессенджеров: сегодня — время, вчера — «вчера», неделя — день недели
export const formatChatTime = (timestamp: number, now = Date.now()) => {
  const startOfToday = new Date(now).setHours(0, 0, 0, 0)

  if (timestamp >= startOfToday) return timeFormat.format(timestamp)
  if (timestamp >= startOfToday - DAY) return 'вчера'
  if (timestamp >= startOfToday - 6 * DAY) return weekdayFormat.format(timestamp)
  return dateFormat.format(timestamp)
}
