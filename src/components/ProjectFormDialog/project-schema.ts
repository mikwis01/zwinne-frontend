import { z } from 'zod'

export const projectSchema = z.object({
  nazwa: z
    .string()
    .trim()
    .min(3, 'Nazwa musi zawierać co najmniej 3 znaki')
    .max(50, 'Nazwa nie może przekraczać 50 znaków'),
  opis: z
    .string()
    .trim()
    .max(1000, 'Opis nie może przekraczać 1000 znaków')
    .optional()
    .or(z.literal('')),
  dataOddania: z.string().optional().or(z.literal(''))
})

export type ProjectFormValues = z.infer<typeof projectSchema>
