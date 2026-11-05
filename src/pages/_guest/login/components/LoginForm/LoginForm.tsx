import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { login } from '@/api/auth'
import { TextField } from '@/components/TextField'
import { setSession } from '@/utils/auth/session'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/get-error-message'
import { loginSchema } from './login-schema'

type LoginFormProps = {
  redirectTo?: string
}

export const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: tokens => {
      setSession(tokens)
      toast.success('Zalogowano pomyślnie')
      router.history.push(redirectTo ?? '/projects')
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Nieprawidłowy e-mail lub hasło'))
    }
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(values => mutate(values))}
      className="flex flex-col gap-4"
    >
      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="Hasło"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <button
        type="submit"
        className="btn mt-2 w-full btn-lg btn-primary"
        disabled={isPending}
      >
        {isPending && <span className="loading loading-sm loading-spinner" />}
        Zaloguj się
      </button>
    </form>
  )
}
