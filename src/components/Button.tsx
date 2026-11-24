import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

export type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger'
export type ButtonSize = 'L' | 'M' | 'S'

/** Couleurs communes à Button et Icon button. */
export const kindClasses: Record<ButtonKind, string> = {
  primary: 'bg-background-inverted text-text-icon-inverted',
  secondary: 'bg-background-elevated text-text-icon-default',
  ghost: 'text-text-icon-default',
  accent: 'bg-background-accent text-text-icon-on-accent',
  danger: 'bg-background-elevated text-text-icon-danger',
}

const sizeClasses: Record<ButtonSize, string> = {
  L: 'h-[48px] px-20 type-text-lg',
  M: 'h-[40px] px-16 type-text-sm',
  S: 'h-[32px] px-12 type-text-sm',
}

const iconSizes: Record<ButtonSize, number> = { L: 20, M: 20, S: 16 }

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
  label: string
  kind?: ButtonKind
  size?: ButtonSize
  leadingIcon?: IconName
  trailingIcon?: IconName
  fullWidth?: boolean
}

export function Button({
  label,
  kind = 'primary',
  size = 'L',
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex shrink-0 items-center justify-center gap-8 rounded-full whitespace-nowrap focus-ring disabled:opacity-40 ${kindClasses[kind]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
      {...props}
    >
      {leadingIcon && <Icon name={leadingIcon} size={iconSizes[size]} />}
      {label}
      {trailingIcon && <Icon name={trailingIcon} size={iconSizes[size]} />}
    </button>
  )
}
