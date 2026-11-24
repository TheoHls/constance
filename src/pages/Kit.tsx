import { Icon, icons, type IconName } from '../components/Icon'
import { accentStyle, habitColors } from '../lib/habitColors'

const textStyles = [
  ['H1', 'type-h1'],
  ['H2', 'type-h2'],
  ['H3', 'type-h3'],
  ['Text xl', 'type-text-xl'],
  ['Text lg', 'type-text-lg'],
  ['Text md', 'type-text-md'],
  ['Text sm', 'type-text-sm'],
  ['Text xs', 'type-text-xs'],
  ['caption', 'type-caption'],
]

const backgrounds = [
  ['default', 'bg-background-default'],
  ['surface', 'bg-background-surface'],
  ['elevated', 'bg-background-elevated'],
  ['selected', 'bg-background-selected'],
  ['inverted', 'bg-background-inverted'],
  ['overlay', 'bg-background-overlay'],
]

const texts = [
  ['default', 'text-text-icon-default'],
  ['secondary', 'text-text-icon-secondary'],
  ['tertiary', 'text-text-icon-tertiary'],
  ['inverted', 'text-text-icon-inverted bg-background-inverted'],
  ['danger', 'text-text-icon-danger'],
]

const borders = [
  ['default', 'border-border-default'],
  ['strong', 'border-border-strong'],
  ['focus', 'border-border-focus'],
  ['danger', 'border-border-danger'],
]

export function Kit() {
  return (
    <main className="flex flex-col gap-40 p-16">
      <h1 className="type-h1">Kit</h1>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Icons</h2>
        <div className="flex flex-wrap gap-24 rounded-24 bg-background-surface p-32">
          {(Object.keys(icons) as IconName[]).map((name) => (
            <span key={name} title={name}>
              <Icon name={name} />
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Text styles</h2>
        {textStyles.map(([name, className]) => (
          <p key={name} className={className}>
            {name} Constance
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="type-h2">Background</h2>
        {backgrounds.map(([name, className]) => (
          <div key={name} className="flex items-center gap-12 type-text-sm">
            <span className={`${className} rounded-12 border border-border-strong p-20`} />
            {name}
          </div>
        ))}
      </section>

      <section className="flex flex-col items-start gap-8">
        <h2 className="type-h2">Text-Icon</h2>
        {texts.map(([name, className]) => (
          <p key={name} className={`${className} type-text-md`}>
            {name}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="type-h2">Border</h2>
        {borders.map(([name, className]) => (
          <p key={name} className={`${className} rounded-16 border p-12 type-text-sm`}>
            {name}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="type-h2">Habit colors</h2>
        {habitColors.map((color) => (
          <div
            key={color}
            style={accentStyle(color)}
            className="rounded-12 bg-background-accent p-12 type-text-sm text-text-icon-on-accent"
          >
            {color}
          </div>
        ))}
      </section>
    </main>
  )
}
