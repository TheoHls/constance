import { useId, type TextareaHTMLAttributes } from 'react'
import { fieldClasses, Helper } from './TextInput'

type LargeTextInputProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id' | 'value' | 'onChange'> & {
  label: string
  value: string
  onChange: (value: string) => void
  showLabel?: boolean
  helper?: string
  error?: boolean
  /** Affiche « utilisés/maxLength ». */
  showCounter?: boolean
}

export function LargeTextInput({
  label,
  value,
  onChange,
  showLabel = true,
  helper,
  error = false,
  showCounter = false,
  maxLength,
  disabled,
  ...props
}: LargeTextInputProps) {
  const id = useId()
  const helperId = `${id}-helper`
  return (
    <div className={`flex w-full flex-col gap-8 ${disabled ? 'opacity-45' : ''}`}>
      {showLabel && (
        <label htmlFor={id} className="type-text-sm text-text-icon-secondary">
          {label}
        </label>
      )}
      <div className={`flex flex-col overflow-clip py-16 ${fieldClasses(error)}`}>
        <textarea
          {...props}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={maxLength}
          disabled={disabled}
          aria-label={showLabel ? undefined : label}
          aria-invalid={error}
          aria-describedby={helper ? helperId : undefined}
          className="field-sizing-content min-h-[57px] w-full resize-none bg-transparent type-text-md text-text-icon-default outline-none placeholder:text-text-icon-tertiary"
        />
        {showCounter && maxLength !== undefined && (
          <p className="self-end type-text-sm text-text-icon-tertiary">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
      {helper && <Helper id={helperId} text={helper} error={error} />}
    </div>
  )
}
