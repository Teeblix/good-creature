import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT, VIEWPORT } from '../lib/motion'

type EyebrowProps = {
  children: ReactNode
  /** dark = black stroke on light sections, light = white stroke over imagery. */
  tone?: 'dark' | 'light'
  /** Play on mount instead of on scroll (used by the hero). */
  playOnMount?: boolean
  delay?: number
  className?: string
}

/**
 * Small pill label above every section heading.
 *
 * The stroke is not a plain border: in Figma it is a 1px inside stroke painted
 * with a horizontal linear gradient that is solid at both ends and fully
 * transparent across the middle (stops at 0%, 13.6%, 86.45%, 100%), so only the
 * left and right arcs read. Reproduced here with a gradient-filled ring that is
 * masked down to its 1px edge.
 */
const STROKE = {
  dark: 'linear-gradient(90deg, rgb(0,0,0) 0%, rgba(243,243,243,0) 13.6%, rgba(243,243,243,0) 86.45%, rgb(0,0,0) 100%)',
  light:
    'linear-gradient(90deg, rgb(255,255,255) 0%, rgba(243,243,243,0) 13.6%, rgba(243,243,243,0) 86.45%, rgb(255,255,255) 100%)',
} as const

const TEXT = {
  dark: 'text-ink',
  light: 'text-cream',
} as const

export function Eyebrow({
  children,
  tone = 'dark',
  playOnMount = false,
  delay = 0,
  className = '',
}: EyebrowProps) {
  const reduceMotion = useReducedMotion()

  const playback = playOnMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: VIEWPORT }

  return (
    <motion.span
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      {...playback}
      transition={{ duration: reduceMotion ? 0.3 : 0.6, ease: EASE_OUT, delay }}
      className={`relative inline-flex items-center justify-center rounded-full px-3 py-1.5 text-center text-[12px] whitespace-nowrap ${TEXT[tone]} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full p-px"
        style={{
          background: STROKE[tone],
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </motion.span>
  )
}
