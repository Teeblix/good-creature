import { useRef } from 'react'
import type { MotionValue } from 'motion/react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'

/** The statement, authored line by line — the stagger is per line, never per word. */
const HEADLINE = ['A small practice built', 'around calm care']

/** The paragraph that takes its place in the same spot, also authored by line. */
const BODY = [
  'Good Creature began with one simple idea: a vet visit',
  'should feel like a kind step forward, not a stressful one.',
  'We’re a team of vets, nurses and animal lovers who listen,',
  'explain things plainly and treat every pet like family.',
]

/**
 * Where each move sits along the track's scroll progress (0 at the top of the
 * track, 1 when the pin releases). Everything is scroll-linked rather than
 * played on a timer, so scrolling back up runs the whole sequence in reverse,
 * line by line, exactly as far as you have travelled.
 */
type Phase = readonly [number, number]
const HEADLINE_IN: Phase = [0.2, 0.37]
const HEADLINE_OUT: Phase = [0.52, 0.64]
const BODY_IN: Phase = [0.64, 0.79]

/** Progress a line waits behind the one before it. */
const STAGGER = 0.035

/** Splits a phase into one sub-range per line, each offset behind the last. */
function lineRange([start, end]: Phase, index: number, count: number) {
  const step = count > 1 ? Math.min(STAGGER, (end - start) / (count * 2)) : 0
  const from = start + step * index
  return [from, from + (end - start) - step * (count - 1)] as const
}

type LineProps = {
  progress: MotionValue<number>
  index: number
  count: number
  children: string
}

/**
 * A headline line. Nothing clips it: the line resolves out of a blur as it
 * fades up into place, then blurs back out as it lifts away — the softness is
 * what carries the movement, so there is no edge for it to slide past.
 *
 * Both the blur and the travel are set in the line's own type size (via the
 * --statement-blur custom property and em units), so they scale with the
 * headline instead of being tuned for one breakpoint.
 */
function HeadlineLine({ progress, index, count, children }: LineProps) {
  const [inFrom, inTo] = lineRange(HEADLINE_IN, index, count)
  const [outFrom, outTo] = lineRange(HEADLINE_OUT, index, count)
  const keyframes = [inFrom, inTo, outFrom, outTo]
  const opacity = useTransform(progress, keyframes, [0, 1, 1, 0])
  const y = useTransform(progress, keyframes, ['0.42em', '0em', '0em', '-0.42em'])
  const softness = useTransform(progress, keyframes, [1, 0, 0, 1])
  const filter = useMotionTemplate`blur(calc(var(--statement-blur) * ${softness}))`

  return (
    <motion.span className="block" style={{ y, opacity, filter }} aria-hidden>
      {children}
    </motion.span>
  )
}

/** A body line: it never travels, it simply resolves where the headline left. */
function BodyLine({ progress, index, count, children }: LineProps) {
  const [from, to] = lineRange(BODY_IN, index, count)
  const opacity = useTransform(progress, [from, to], [0, 1])
  const softness = useTransform(progress, [from, to], [1, 0])
  const filter = useMotionTemplate`blur(calc(var(--statement-blur) * ${softness}))`

  return (
    <motion.span className="block" style={{ opacity, filter }} aria-hidden>
      {children}
    </motion.span>
  )
}

/**
 * The statement itself: one viewport held still while two blocks of type hand
 * over to each other. The track above it is what supplies the scroll distance —
 * the sticky child stays pinned for as long as the track is passing through.
 */
function Statement() {
  const trackRef = useRef<HTMLDivElement>(null)
  // Measured from the moment the track's top reaches the bottom of the screen,
  // so the headline is already arriving as the section comes into view.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end end'],
  })

  // Mirrors the live progress onto the DOM so the sequence can be inspected
  // while scrolling, the same way the navigation bar exposes its own state.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    trackRef.current?.setAttribute('data-progress', value.toFixed(3))
  })

  return (
    <div ref={trackRef} className="relative h-[300vh]">
      <div className="sticky top-0 grid h-dvh place-items-center px-6">
        <h2
          className="col-start-1 row-start-1 w-full max-w-[900px] text-center font-grotesk text-[32px] leading-[1.14] text-ink [--statement-blur:8px] sm:text-[52px] lg:text-[76px] lg:[--statement-blur:16px]"
          aria-label={HEADLINE.join(' ')}
        >
          {HEADLINE.map((line, index) => (
            <HeadlineLine
              key={line}
              progress={scrollYProgress}
              index={index}
              count={HEADLINE.length}
            >
              {line}
            </HeadlineLine>
          ))}
        </h2>

        <p
          className="col-start-1 row-start-1 w-full max-w-[760px] text-center font-grotesk text-[17px] leading-[1.65] text-ink-soft [--statement-blur:5px] sm:text-[21px] lg:text-[26px] lg:[--statement-blur:8px]"
          aria-label={BODY.join(' ')}
        >
          {BODY.map((line, index) => (
            <BodyLine key={line} progress={scrollYProgress} index={index} count={BODY.length}>
              {line}
            </BodyLine>
          ))}
        </p>
      </div>
    </div>
  )
}

/** The same two blocks, stacked and still, for anyone who asks for less motion. */
function StillStatement() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 px-6 py-20">
      <h2 className="w-full max-w-[900px] text-center font-grotesk text-[32px] leading-[1.14] text-ink sm:text-[52px] lg:text-[76px]">
        {HEADLINE.join(' ')}
      </h2>
      <p className="w-full max-w-[760px] text-center font-grotesk text-[17px] leading-[1.65] text-ink-soft sm:text-[21px] lg:text-[26px]">
        {BODY.join(' ')}
      </p>
    </div>
  )
}

export function About() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="about-us" className="w-full bg-cream" data-node-id="107:9994">
      {reduceMotion ? <StillStatement /> : <Statement />}
    </section>
  )
}
