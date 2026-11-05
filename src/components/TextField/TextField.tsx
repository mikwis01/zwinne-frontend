import { useId, type ComponentProps } from 'react'
import { cn } from '@/utils/cn'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  error?: string
}

export const TextField = ({
  label,
  error,
  id,
  className,
  ...props
}: TextFieldProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="pl-1 text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'input w-full border-base-300 bg-base-100 text-base input-lg focus:border-primary focus:outline-primary',
          error && 'border-error focus:border-error focus:outline-error',
          className
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="pl-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
