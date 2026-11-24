import { useId, type InputHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

/** Cadre commun à Text input et Large text input : bordure selon l'état. */
export function fieldClasses(error: boolean) {
  return `rounded-16 bg-background-elevated px-16 ${
    error
      ? 'border-[1.5px] border-border-danger'
      : 'border-[1.5px] border-border-default focus-within:border-2 focus-within:border-border-focus'
  }`
}

export function Helper({ id, text, error }: { id: string; text: string; error: boolean }) {
  return (
    <p id={id} className={`type-text-sm ${error ? 'text-text-icon-danger' : 'text-text-icon-tertiary'}`}>
      {text}
    </p>
  )
}

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'value' | 'onChange'> & {
  label: string
  value: string
  onChange: (value: string) => void
  showLabel?: boolean
  icon?: IconName
  helper?: string
  error?: boolean
}

/** Les états Empty, Filled et Focus de Figma viennent de la valeur et du focus. */
export function TextInput({
  label,
  value,
  onChange,
  showLabel = true,
  icon,
  helper,
  error = false,
  disabled,
  ...props
}: TextInputProps) {
  const id = useId()
  const helperId = `${id}-helper`
  return (
    <div className={`flex w-full flex-col gap-8 ${disabled ? 'opacity-45' : ''}`}>
      {showLabel && (
        <label htmlFor={id} className="type-text-sm text-text-icon-secondary">
          {label}
        </label>
      )}
      <div className={`flex h-[52px] items-center gap-12 overflow-clip ${fieldClasses(error)}`}>
        {icon && (
          <span className="shrink-0 text-text-icon-tertiary">
            <Icon name={icon} size={20} />
          </span>
        )}
        <input
          {...props}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-label={showLabel ? undefined : label}
          aria-invalid={error}
          aria-describedby={helper ? helperId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent type-text-md text-text-icon-default outline-none placeholder:text-text-icon-tertiary"
        />
      </div>
      {helper && <Helper id={helperId} text={helper} error={error} />}
    </div>
  )
}
