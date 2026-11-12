import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT, VIEWPORT } from '../lib/motion'

type StaggerTextProps = {
  text: string
  className?: string
  /** Play on mount instead of waiting to scroll into view. */
  playOnMount?: boolean
  stagger?: number
  delay?: number
  /**
   * 'mask' slides each line up out of a hidden row; 'blur' resolves it out of
   * a blur in place, with no edge for it to travel past.
   */
  variant?: 'mask' | 'blur'
}

/**
 * Staggers a block of prose line by line, where the lines are the *rendered*
 * ones rather than authored breaks.
 *
 * An invisible copy of the text with every word wrapped is measured after
 * layout; words sharing an offsetTop form a line. Re-measured on resize, so
 * the split follows the text as it reflows.
 */
export function StaggerText({
  text,
  className = '',
  playOnMount = false,
  stagger = 0.1,
  delay = 0,
  variant = 'mask',
}: StaggerTextProps) {
  const reduceMotion = useReducedMotion()
  const measureRef = useRef<HTMLSpanElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)
  const words = text.split(' ')

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const measure = () => {
      const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'))
      if (spans.length === 0) return
      const rows: { top: number; words: string[] }[] = []
      for (const span of spans) {
        const top = Math.round(span.offsetTop)
        const row = rows[rows.length - 1]
        if (row && Math.abs(row.top - top) < 4) row.words.push(span.textContent ?? '')
        else rows.push({ top, words: [span.textContent ?? ''] })
      }
      const next = rows.map((row) => row.words.join(' '))
      setLines((current) =>
        current && current.length === next.length && current.every((l, i) => l === next[i])
          ? current
          : next,
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text])

  const playback = playOnMount
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: VIEWPORT }

  return (
    <span className={`relative block ${className}`}>
      {/* Measuring copy — out of flow, never painted, never read aloud */}
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 block"
      >
        {words.map((word, index) => (
          <span key={index}>
            <span data-word>{word}</span>{' '}
          </span>
        ))}
      </span>

      {lines === null ? (
        // Pre-measurement: hold the exact final height, paint nothing
        <span className="block opacity-0">{text}</span>
      ) : (
        <motion.span
          className="block"
          initial="hidden"
          {...playback}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduceMotion ? 0 : stagger, delayChildren: delay },
            },
          }}
          aria-label={text}
        >
          {lines.map((line, index) => (
            <span
              key={index}
              className={variant === 'mask' ? 'block overflow-hidden' : 'block'}
              aria-hidden
            >
              <motion.span
                className="block"
                variants={
                  variant === 'mask'
                    ? {
                        hidden: reduceMotion ? { opacity: 0 } : { y: '110%', opacity: 0 },
                        visible: {
                          y: '0%',
                          opacity: 1,
                          transition: { duration: reduceMotion ? 0.3 : 0.8, ease: EASE_OUT },
                        },
                      }
                    : {
                        hidden: reduceMotion
                          ? { opacity: 0 }
                          : { y: '0.5em', opacity: 0, filter: 'blur(7px)' },
                        visible: {
                          y: '0em',
                          opacity: 1,
                          filter: 'blur(0px)',
                          transition: { duration: reduceMotion ? 0.3 : 0.7, ease: EASE_OUT },
                        },
                      }
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.span>
      )}
    </span>
  )
}
