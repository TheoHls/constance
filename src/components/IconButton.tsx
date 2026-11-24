import type { ButtonHTMLAttributes } from 'react'
import { kindClasses, type ButtonKind, type ButtonSize } from './Button'
import { Icon, type IconName } from './Icon'

const sizeClasses: Record<ButtonSize, string> = {
  L: 'size-[48px]',
  M: 'size-[40px]',
  S: 'size-[32px]',
}

const iconSizes: Record<ButtonSize, number> = { L: 22, M: 20, S: 18 }

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'aria-label'> & {
  icon: IconName
  /** Lu par les lecteurs d'écran, le bouton n'a pas de texte visible. */
  label: string
  kind?: ButtonKind
  size?: ButtonSize
}

export function IconButton({ icon, label, kind = 'primary', size = 'L', type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`flex shrink-0 items-center justify-center rounded-full focus-ring ${kindClasses[kind]} ${sizeClasses[size]}`}
      {...props}
    >
      <Icon name={icon} size={iconSizes[size]} />
    </button>
  )
}
