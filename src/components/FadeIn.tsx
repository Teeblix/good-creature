import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT, VIEWPORT } from '../lib/motion'

type FadeInProps = {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Opacity alone, played once when the block scrolls into view.
 *
 * This is for the parts of the page that carry their own behaviour — a
 * carousel, a hover row, a scrolling rail — where [[Reveal]]'s 16px lift
 * would fight the transforms those parts are already running. Everything
 * that just sits there should use Reveal instead; this is the quieter
 * entrance for things that move on their own once they have arrived.
 */
export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * The same entrance as props, for elements that cannot take a wrapper — a
 * flex child whose width comes from its parent, or one measured by a ref.
 */
export const fadeInProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: VIEWPORT,
  transition: { duration: 0.8, ease: EASE_OUT },
} as const
