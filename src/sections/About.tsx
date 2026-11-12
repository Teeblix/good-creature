import { useRef } from 'react'
import type { ReactNode } from 'react'
import type { MotionValue } from 'motion/react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'

import catMotif from '../assets/about-cat.webp'
import dogMotif from '../assets/about-dog.webp'

/** The statement, authored line by line — the stagger is per line, never per word. */
const HEADLINE: ReactNode[] = [
  'A Small Practice Built',
  <>
    Around <span className="text-ember">Calm</span> Care
  </>,
]

/** The same sentence as plain text, for screen readers and the still version. */
const HEADLINE_TEXT = 'A Small Practice Built Around Calm Care'

/**
 * The paragraph that takes its place in the same spot, also authored by line.
 * The breaks are where the text wraps on its own in the 1000px measure at
 * 40px Satoshi, which is how the design sets it; they are worth recomputing
 * if the typeface or the measure changes.
 */
const BODY = [
  'We are an independent practice of vets and nurses. We',
  'keep our team small, so your pet sees familiar faces',
  'every visit. Our rooms are quiet and our appointments',
  'are long enough to do the job properly.',
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
  children: ReactNode
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
 * The two drawings that keep the corners company. They arrive with the
 * headline and keep drifting gently upwards for the rest of the section, so
 * the page never reads as bare type on an empty field.
 */
function Motifs({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.12, 0.3], [0, 1])
  const y = useTransform(progress, [0.12, 0.3, 1], [56, 0, -38])

  return (
    <>
      <motion.img
        src={catMotif}
        alt=""
        aria-hidden
        loading="lazy"
        style={{ opacity, y }}
        className="pointer-events-none absolute bottom-[9vh] left-[5vw] w-[clamp(74px,9vw,164px)] lg:bottom-[12vh]"
      />
      <motion.img
        src={dogMotif}
        alt=""
        aria-hidden
        loading="lazy"
        style={{ opacity, y }}
        /* Flipped so the dog looks back in towards the words. */
        className="pointer-events-none absolute bottom-[9vh] right-[5vw] w-[clamp(84px,10vw,184px)] -scale-x-100 lg:bottom-[12vh]"
      />
    </>
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

  // The doorway outline opens out behind the words for the whole of the
  // section, so the type is always sitting inside something that is still
  // growing rather than against a blank page.
  const archScale = useTransform(scrollYProgress, [0.08, 1], [0.72, 1.38])
  const archOpacity = useTransform(scrollYProgress, [0.08, 0.26], [0, 1])

  return (
    <div ref={trackRef} className="relative h-[300vh]">
      <div className="sticky top-0 grid h-dvh place-items-center overflow-hidden px-6">
        {/* The doorway, drawn as an outline — it sits behind the words and
            keeps opening out as the section is scrolled. */}
        <motion.div
          aria-hidden
          style={{ scale: archScale, opacity: archOpacity }}
          className="col-start-1 row-start-1 aspect-[391/547] h-[min(547px,62dvh)] rounded-t-[250px] border border-line"
        />

        <h2
          className="col-start-1 row-start-1 w-full max-w-[900px] text-center font-grotesk text-[32px] leading-[1.14] text-ink [--statement-blur:8px] sm:text-[52px] lg:text-[76px] lg:[--statement-blur:16px]"
          aria-label={HEADLINE_TEXT}
        >
          {HEADLINE.map((line, index) => (
            <HeadlineLine
              key={index}
              progress={scrollYProgress}
              index={index}
              count={HEADLINE.length}
            >
              {line}
            </HeadlineLine>
          ))}
        </h2>

        <Motifs progress={scrollYProgress} />

        <p
          className="col-start-1 row-start-1 w-full max-w-[1000px] text-center font-sans text-[18px] leading-[1.5] text-ink-soft [--statement-blur:5px] sm:text-[27px] lg:text-[40px] lg:leading-[1.35] lg:[--statement-blur:9px]"
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
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden px-6 py-20">
      <div
        aria-hidden
        className="absolute top-1/2 aspect-[391/547] h-[min(547px,62dvh)] -translate-y-1/2 rounded-t-[250px] border border-line"
      />
      <img
        src={catMotif}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[9vh] left-[5vw] w-[clamp(74px,9vw,164px)]"
      />
      <img
        src={dogMotif}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[9vh] right-[5vw] w-[clamp(84px,10vw,184px)] -scale-x-100"
      />
      <h2 className="relative w-full max-w-[900px] text-center font-grotesk text-[32px] leading-[1.14] text-ink sm:text-[52px] lg:text-[76px]">
        A Small Practice Built Around <span className="text-ember">Calm</span> Care
      </h2>
      <p className="relative w-full max-w-[1000px] text-center font-sans text-[18px] leading-[1.5] text-ink-soft sm:text-[27px] lg:text-[40px] lg:leading-[1.35]">
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
