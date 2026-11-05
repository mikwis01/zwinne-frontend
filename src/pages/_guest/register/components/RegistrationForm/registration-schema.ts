import { z } from 'zod'

export const registrationSchema = z
  .object({
    imie: z
      .string()
      .trim()
      .min(2, 'Imię musi mieć co najmniej 2 znaki')
      .max(50, 'Imię może mieć maksymalnie 50 znaków'),
    nazwisko: z
      .string()
      .trim()
      .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
      .max(50, 'Nazwisko może mieć maksymalnie 50 znaków'),
    nrIndeksu: z
      .string()
      .trim()
      .min(1, 'Podaj numer indeksu')
      .max(20, 'Numer indeksu może mieć maksymalnie 20 znaków')
      .regex(/^\d+$/, 'Numer indeksu może zawierać tylko cyfry'),
    email: z
      .email('Podaj poprawny adres e-mail')
      .max(100, 'E-mail może mieć maksymalnie 100 znaków'),
    stacjonarny: z.boolean(),
    password: z
      .string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .max(25, 'Hasło może mieć maksymalnie 25 znaków'),
    confirmPassword: z.string()
  })
  .refine(values => values.password === values.confirmPassword, {
    message: 'Hasła muszą być takie same',
    path: ['confirmPassword']
  })
