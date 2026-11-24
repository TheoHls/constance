/** Trois lignes 6 x 5 px, uniquement dans Day dot « M + note ». */
export function NoteIcon({ color }: { color: 'light' | 'dark' }) {
  return (
    <svg
      width="6"
      height="5"
      viewBox="0 0 6 5"
      aria-hidden
      shapeRendering="crispEdges"
      className={color === 'light' ? 'fill-background-inverted' : 'fill-background-surface'}
    >
      <rect width="6" height="1" />
      <rect y="2" width="6" height="1" />
      <rect y="4" width="4" height="1" />
    </svg>
  )
}
