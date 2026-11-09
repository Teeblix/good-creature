import type { ReactNode } from 'react'

/**
 * Button label that rolls on hover: the visible copy slides up and out of the
 * button while an identical copy rises from below into its place.
 *
 * The parent must carry the `group` class — the roll is driven by its hover
 * and focus state, so the whole button is the target, not just the text.
 * Under prefers-reduced-motion both copies stay put.
 */
export function RollingText({ children }: { children: ReactNode }) {
  const shared =
    'block whitespace-nowrap transition-transform duration-[450ms] ' +
    'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

  return (
    <span className="relative block overflow-hidden">
      <span
        className={`${shared} group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0`}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={`${shared} absolute inset-0 translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:group-hover:translate-y-full motion-reduce:group-focus-visible:translate-y-full`}
      >
        {children}
      </span>
    </span>
  )
}
