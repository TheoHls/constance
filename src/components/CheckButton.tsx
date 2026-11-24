type CheckButtonProps = {
  label: string
  checked: boolean
  /** Habitude Quit : croix à la place du check. */
  type?: 'build' | 'quit'
  onToggle: () => void
}

/** Gros bouton check de Habit card et de Add note. */
export function CheckButton({ label, checked, type = 'build', onToggle }: CheckButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={checked}
      onClick={onToggle}
      className={`relative flex size-[40px] shrink-0 items-center justify-center rounded-full focus-ring ${
        checked
          ? 'bg-background-accent text-text-icon-on-accent'
          : 'border-[2.5px] border-text-icon-tertiary bg-background-elevated text-border-strong'
      }`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
        <path
          d={
            type === 'quit'
              ? 'M6 6L18 18M18 6L6 18'
              : 'M5 13.2592L7.58583 15.9568C8.2525 16.6523 8.58583 17 9.00004 17C9.41425 17 9.74759 16.6523 10.4143 15.9568L19 7'
          }
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
