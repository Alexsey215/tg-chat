import { useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { isValidPhone, normalizePhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

interface CreateChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateChatDialog = ({ open, onOpenChange }: CreateChatDialogProps) => {
  const createChat = useChatStore((state) => state.createChat)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setPhone('')
      setError(null)
    }
    onOpenChange(next)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const digits = normalizePhone(phone)
    if (!isValidPhone(digits)) {
      setError('Введите номер с кодом страны, например 79991234567')
      return
    }

    createChat(digits)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый чат</DialogTitle>
          <DialogDescription>Номер получателя в Telegram в международном формате</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 999 123-45-67"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setError(null)
              }}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={!phone.trim()}>
              Создать чат
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
