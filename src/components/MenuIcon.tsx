type MenuIconProps = {
  open: boolean
  /** Tailwind background class for the bars, e.g. bg-cream or bg-ink. */
  tone: string
}

/**
 * The vuesax menu glyph rebuilt as three bars so they can move independently:
 * 19.5 × 1.5px, 5px apart, matching the exported SVG's geometry.
 *
 * Opening, the middle bar nudges 4px to the right and fades, and the outer two
 * then swing together into a cross. Closing runs it back the other way, the
 * middle bar returning last.
 */
export function MenuIcon({ open, tone }: MenuIconProps) {
  const bar =
    `absolute left-[2.25px] h-[1.5px] w-[19.5px] rounded-full ${tone} ` +
    'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
  const outer = open ? 'delay-200' : 'delay-0'
  const middle = open ? 'delay-0' : 'delay-200'

  return (
    <span className="relative block size-6" aria-hidden>
      <span
        className={`${bar} ${outer} ${open ? 'top-[11.25px] rotate-45' : 'top-[6.25px] rotate-0'}`}
      />
      <span
        className={`${bar} ${middle} top-[11.25px] ${
          open ? 'translate-x-[4px] opacity-0' : 'translate-x-0 opacity-100'
        }`}
      />
      <span
        className={`${bar} ${outer} ${open ? 'top-[11.25px] -rotate-45' : 'top-[16.25px] rotate-0'}`}
      />
    </span>
  )
}
