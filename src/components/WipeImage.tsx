import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE_OUT, VIEWPORT, wipeClip } from '../lib/motion'
import type { WipeDirection } from '../lib/motion'

type WipeImageProps = {
  src: string
  alt: string
  /** Direction the reveal travels across the image. */
  direction: WipeDirection
  className?: string
  imgClassName?: string
  delay?: number
}

/**
 * Image revealed by a clip-path wipe when it scrolls into view. The image
 * itself never moves — only the mask travels — so the crop stays exactly as
 * it is in the design.
 *
 * The scroll trigger lives on the outer wrapper rather than on the clipped
 * element: Chromium folds an element's own clip-path into its
 * IntersectionObserver ratio, so a fully clipped element reports itself as
 * off-screen and would never reveal.
 */
export function WipeImage({
  src,
  alt,
  direction,
  className = '',
  imgClassName = '',
  delay = 0,
}: WipeImageProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: VIEWPORT.once, amount: VIEWPORT.amount })
  const clip = wipeClip[direction]

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="size-full"
        initial={false}
        animate={{ clipPath: inView || reduceMotion ? clip.to : clip.from }}
        transition={{ duration: reduceMotion ? 0 : 1.1, ease: EASE_OUT, delay }}
        style={{ clipPath: clip.from }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`block size-full object-cover ${imgClassName}`}
        />
      </motion.div>
    </div>
  )
}
