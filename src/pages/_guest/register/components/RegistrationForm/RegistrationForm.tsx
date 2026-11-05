import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { registerStudent } from '@/api/auth'
import { TextField } from '@/components/TextField'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/get-error-message'
import { registrationSchema } from './registration-schema'

export const RegistrationForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      imie: '',
      nazwisko: '',
      nrIndeksu: '',
      email: '',
      stacjonarny: true,
      password: '',
      confirmPassword: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      toast.success('Konto zostało utworzone. Możesz się zalogować.')
      void navigate({ to: '/login' })
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Nie udało się utworzyć konta'))
    }
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(({ confirmPassword: _, ...student }) =>
        mutate(student)
      )}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Imię"
          autoComplete="given-name"
          error={errors.imie?.message}
          {...register('imie')}
        />
        <TextField
          label="Nazwisko"
          autoComplete="family-name"
          error={errors.nazwisko?.message}
          {...register('nazwisko')}
        />
      </div>
      <TextField
        label="Numer indeksu"
        inputMode="numeric"
        error={errors.nrIndeksu?.message}
        {...register('nrIndeksu')}
      />
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
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <TextField
        label="Powtórz hasło"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <label className="flex cursor-pointer items-center gap-3 pl-1">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          {...register('stacjonarny')}
        />
        Studiuję stacjonarnie
      </label>
      <button
        type="submit"
        className="btn mt-2 w-full btn-lg btn-primary"
        disabled={isPending}
      >
        {isPending && <span className="loading loading-sm loading-spinner" />}
        Załóż konto
      </button>
    </form>
  )
}
