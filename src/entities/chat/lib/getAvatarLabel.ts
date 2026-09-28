const isPhoneLabel = (label: string) => /^[+\d][\d\s()-]*$/.test(label) && /\d{3,}/.test(label)

export const getAvatarLabel = (label: string): string => {
  const trimmed = label.trim()

  if (isPhoneLabel(trimmed)) {
    return trimmed.replace(/\D/g, '').slice(-2)
  }

  return trimmed
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}
