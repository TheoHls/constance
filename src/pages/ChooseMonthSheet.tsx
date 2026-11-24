import { useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { Button } from '../components/Button'
import { PickerColumn } from '../components/PickerColumn'
import { SheetHeader } from '../components/SheetHeader'
import { monthNames, type Month } from '../lib/dates'

type ChooseMonthSheetProps = {
  month: Month
  /** Années proposées, dans l'ordre. */
  years: number[]
  onChoose: (month: Month) => void
  onClose: () => void
}

export function ChooseMonthSheet({ month, years, onChoose, onClose }: ChooseMonthSheetProps) {
  const [index, setIndex] = useState(month.month)
  const [yearIndex, setYearIndex] = useState(Math.max(0, years.indexOf(month.year)))

  return (
    <BottomSheet label="Choose month" onClose={onClose}>
      <SheetHeader title="Choose month" icon="Chevron left" onBack={onClose} />
      <div className="flex flex-col gap-40 p-16">
        <div className="flex gap-16">
          <PickerColumn label="Month" items={monthNames} selectedIndex={index} onChange={setIndex} />
          <PickerColumn label="Year" items={years.map(String)} selectedIndex={yearIndex} onChange={setYearIndex} />
        </div>
        <Button label="Show month" kind="accent" fullWidth onClick={() => onChoose({ year: years[yearIndex]!, month: index })} />
      </div>
    </BottomSheet>
  )
}
