import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT, VIEWPORT } from '../lib/motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  /** Play on mount instead of on scroll. */
  playOnMount?: boolean
}

/** Plain fade-and-rise for supporting copy, buttons and small blocks. */
export function Reveal({ children, delay = 0, className = '', playOnMount = false }: RevealProps) {
  const reduceMotion = useReducedMotion()

  const playback = playOnMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: VIEWPORT }

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      {...playback}
      transition={{ duration: reduceMotion ? 0.3 : 0.7, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
