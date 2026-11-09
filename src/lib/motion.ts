import type { Transition } from 'motion/react'

/** Shared easing — a soft, editorial ease-out used across the whole page. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const textTransition: Transition = {
  duration: 0.8,
  ease: EASE_OUT,
}

/** How far down the viewport an element must be before its entrance plays. */
export const VIEWPORT = { once: true, amount: 0.3 } as const

/** A wipe is a clip-path reveal; the name is the direction the reveal travels. */
export type WipeDirection = 'left' | 'right'

export const wipeClip: Record<WipeDirection, { from: string; to: string }> = {
  // Travels leftward: held back from the right edge, then opens out to the left.
  left: { from: 'inset(0% 0% 0% 100%)', to: 'inset(0% 0% 0% 0%)' },
  // Travels rightward: held back from the left edge, then opens out to the right.
  right: { from: 'inset(0% 100% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
}
