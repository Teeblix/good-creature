import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT, VIEWPORT } from '../lib/motion'

/** Pre-created motion components — creating these during render would remount on every pass. */
const TAGS = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
} as const

type StaggerLinesProps = {
  /** One entry per visual line — the stagger is line by line, never word by word. */
  lines: ReactNode[]
  /** Element to render as. Defaults to a div. */
  as?: keyof typeof TAGS
  className?: string
  id?: string
  /** Per-line delay. */
  stagger?: number
  /** Delay before the first line moves. */
  delay?: number
  /** Play on mount instead of waiting to scroll into view (used by the hero). */
  playOnMount?: boolean
  /**
   * The plain sentence for screen readers. Needed when any line is markup
   * rather than a string, since only string lines can be joined into one.
   */
  label?: string
}

/**
 * Headline entrance used by every section: each line sits in an overflow-hidden
 * row and slides up into place, one line after the other.
 */
export function StaggerLines({
  lines,
  as = 'div',
  className = '',
  id,
  stagger = 0.12,
  delay = 0,
  playOnMount = false,
  label,
}: StaggerLinesProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = TAGS[as]

  const playback = playOnMount
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: VIEWPORT }

  // Screen readers get the plain sentence; the split rows are decorative.
  const sentence = label ?? lines.filter((line): line is string => typeof line === 'string').join(' ')

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      {...playback}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduceMotion ? 0 : stagger, delayChildren: delay },
        },
      }}
      aria-label={sentence || undefined}
    >
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden" aria-hidden>
          <motion.span
            className="block"
            variants={{
              hidden: reduceMotion ? { opacity: 0 } : { y: '110%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: { duration: reduceMotion ? 0.3 : 0.9, ease: EASE_OUT },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
