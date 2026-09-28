// Приводим ввод к виду, который принимает GREEN-API: только цифры с кодом страны
export const normalizePhone = (input: string) => {
  const digits = input.replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('8')) return `7${digits.slice(1)}`
  return digits
}

export const isValidPhone = (digits: string) => /^\d{10,15}$/.test(digits)

export const formatPhone = (digits: string) => {
  const ru = digits.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/)
  if (ru) return `+7 ${ru[1]} ${ru[2]}-${ru[3]}-${ru[4]}`
  return `+${digits}`
}
