import { useEffect, useRef, type KeyboardEvent } from 'react'

// Item 44 px + gap Spacing/8.
const STEP = 52

type PickerColumnProps = {
  label: string
  items: string[]
  selectedIndex: number
  onChange: (index: number) => void
}

/** Roue : l'élément choisi est en bas, les deux précédents au-dessus. */
export function PickerColumn({ label, items, selectedIndex, onChange }: PickerColumnProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list && Math.round(list.scrollTop / STEP) !== selectedIndex) list.scrollTop = selectedIndex * STEP
  }, [selectedIndex])

  const clamp = (index: number) => Math.min(items.length - 1, Math.max(0, index))

  const handleScroll = () => {
    const index = clamp(Math.round(listRef.current!.scrollTop / STEP))
    if (index !== selectedIndex) onChange(index)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const delta = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    event.preventDefault()
    onChange(clamp(selectedIndex + delta))
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <p className="type-caption text-text-icon-tertiary">{label}</p>
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="no-scrollbar flex h-[148px] w-full snap-y snap-mandatory flex-col gap-8 overflow-y-auto overscroll-contain rounded-12 pt-[104px] focus-ring"
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex
          return (
            <div
              key={item}
              role="option"
              aria-selected={selected}
              onClick={() => onChange(index)}
              className={`flex h-[44px] shrink-0 snap-end items-center justify-center rounded-12 type-text-md ${
                selected ? 'bg-background-elevated text-text-icon-default' : 'text-text-icon-tertiary'
              } ${index <= selectedIndex - 2 ? 'opacity-50' : ''}`}
            >
              {item}
            </div>
          )
        })}
      </div>
    </div>
  )
}
