export type Segment = 'first' | 'second'

type SegmentedControlProps = {
  label: string
  option1: string
  option2: string
  selected: Segment
  onChange: (selected: Segment) => void
}

export function SegmentedControl({ label, option1, option2, selected, onChange }: SegmentedControlProps) {
  const segments: [Segment, string][] = [
    ['first', option1],
    ['second', option2],
  ]
  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-[48px] w-full gap-4 rounded-full border border-border-strong bg-background-elevated p-4"
    >
      {segments.map(([value, text]) => (
        <button
          key={value}
          type="button"
          aria-pressed={selected === value}
          onClick={() => onChange(value)}
          className={`flex-1 rounded-full type-text-sm focus-ring ${
            selected === value ? 'bg-background-selected text-text-icon-default' : 'text-text-icon-secondary'
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
