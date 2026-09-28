export interface AvatarGradient {
  from: string
  to: string
}

// градиенты из палитры MAX для аватаров без фото
const AVATAR_GRADIENTS: AvatarGradient[] = [
  { from: '#ff48b6', to: '#ff8a35' },
  { from: '#ffc93d', to: '#ff832a' },
  { from: '#14e1d5', to: '#03c722' },
  { from: '#08d7f3', to: '#5398ff' },
  { from: '#bf97ff', to: '#526eff' },
]

export const getAvatarGradient = (seed: string): AvatarGradient => {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}
