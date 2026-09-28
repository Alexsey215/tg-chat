import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getApiUrl, useSessionStore } from '@/entities/session'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { checkCredentials } from '../model/checkCredentials'

const INITIAL_VALUES = { idInstance: '', apiTokenInstance: '' }

export const LoginForm = () => {
  const login = useSessionStore((state) => state.login)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const isFilled = values.idInstance.trim() !== '' && values.apiTokenInstance.trim() !== ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFilled || pending) return

    const idInstance = values.idInstance.trim()
    if (!/^\d{4,}$/.test(idInstance)) {
      setError('ID инстанса состоит только из цифр')
      return
    }

    const credentials = {
      apiUrl: getApiUrl(idInstance),
      idInstance,
      apiTokenInstance: values.apiTokenInstance.trim(),
    }

    setPending(true)
    setError(null)
    const errorText = await checkCredentials(credentials)
    setPending(false)

    if (errorText) setError(errorText)
    else login(credentials)
  }

  return (
    <div className="w-full max-w-[400px] rounded-3xl bg-background p-8 shadow-sm">
      <h1 className="text-xl font-semibold">Вход через GREEN-API</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Данные инстанса можно найти в{' '}
        <a
          href="https://console.green-api.com"
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          личном кабинете
        </a>
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="idInstance">idInstance</Label>
          <Input
            id="idInstance"
            name="idInstance"
            inputMode="numeric"
            autoComplete="off"
            placeholder="4100123456"
            value={values.idInstance}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="apiTokenInstance">apiTokenInstance</Label>
          <Input
            id="apiTokenInstance"
            name="apiTokenInstance"
            type="password"
            autoComplete="off"
            value={values.apiTokenInstance}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={!isFilled || pending} className="h-11 w-full">
          {pending && <Loader2 className="animate-spin" />}
          Войти
        </Button>
      </form>
    </div>
  )
}
