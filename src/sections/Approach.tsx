import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Reveal } from '../components/Reveal'

type Place = 'right' | 'bottom' | 'left'

type Pillar = {
  number: string
  title: string
  body: string
  /** Where the badge sits on the ring, and which way its words run from it. */
  place: Place
}

/** Reveal order is array order, which is also 01, 02, 03 around the circle. */
const PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'Listen first',
    body: 'We hear your worries and your pet’s history before we touch anything.',
    place: 'right',
  },
  {
    number: '02',
    title: 'Plain words',
    body: 'No jargon, and every finding explained as we go.',
    place: 'bottom',
  },
  {
    number: '03',
    title: 'Your call',
    body: 'Every plan and every cost approved by you before we begin.',
    place: 'left',
  },
]

/**
 * Where each badge sits, as a share of the circle's own box.
 *
 * Read straight off the design, which pins them inside a 676px circle: badge
 * centres at (578,146), (337,637) and (99,146). Every one of them sits a clear
 * distance *inside* the ring — 7.7px, 15.8px and 8.4px from the stroke — so
 * the line passes between the number and its words rather than through the
 * number. Kept as percentages they hold that position whatever size the circle
 * takes; the badge itself never scales.
 */
const BADGE: Record<Place, { left: string; top: string }> = {
  right: { left: '85.50%', top: '21.60%' },
  bottom: { left: '49.85%', top: '94.26%' },
  left: { left: '14.64%', top: '21.60%' },
}

/* ---------------------------------------------------------------- timings */

type Phase = readonly [number, number]

/** The ring draws itself in first, then the words at its centre. */
const CIRCLE: Phase = [0.05, 0.19]
const LABEL: Phase = [0.15, 0.3]

/** Progress at which the first pillar lands, and how the next two follow. */
const FIRST_PILLAR = 0.36
const PILLAR_STEP = 0.19
const PILLAR_SPAN = 0.13

/** How far the title and body trail the badge within one pillar. */
const TRAIL = 0.025

function pillarPhase(index: number): Phase {
  const from = FIRST_PILLAR + index * PILLAR_STEP
  return [from, from + PILLAR_SPAN]
}

/** The last pillar has nobody to hand over to; it simply stays. */
function handsOver(index: number) {
  return index < PILLARS.length - 1
}

/**
 * When a pillar hands over. There is only room for one set of words below the
 * ring on a phone, so each set leaves as the next arrives.
 *
 * The last pillar still gets a range — every stop fed to useTransform has to
 * sit inside the track's own 0 to 1, or the browser refuses the keyframes —
 * but handsOver() means nothing reads it.
 */
function handover(index: number): Phase {
  if (!handsOver(index)) return [0.98, 0.99]
  const [, to] = pillarPhase(index)
  return [to, pillarPhase(index + 1)[0] - 0.01]
}

/** One of the three parts of a pillar, each starting a beat after the last. */
function trailing([from, to]: Phase, slot: number): Phase {
  const start = from + slot * TRAIL
  return [start, start + (to - from) - TRAIL * 2]
}

/* ------------------------------------------------------------- the pieces */

/** The navy disc carrying the step number. */
function Badge({ children }: { children: string }) {
  return (
    <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-navy font-grotesk text-[22px] leading-none text-cream">
      {children}
    </span>
  )
}

/** The title and body that belong to a badge. */
function Words({ pillar, className = '' }: { pillar: Pillar; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className="font-grotesk text-[36px] leading-normal text-ink">{pillar.title}</h3>
      <p className="text-[16px] leading-normal text-ink-soft">{pillar.body}</p>
    </div>
  )
}

/**
 * A pillar on the ring. The badge is the anchor: it is pinned to its point on
 * the circle, and the words hang off it — out to the right, out to the left,
 * or straight down for the one at the bottom — so the whole group keeps its
 * place as the circle changes size.
 *
 * Everything is tied to scroll position rather than played on a timer, so
 * scrolling back up takes the pillars away again in reverse.
 */
function RingPillar({
  pillar,
  index,
  progress,
  narrow,
}: {
  pillar: Pillar
  index: number
  progress: MotionValue<number>
  /** Below 1280 there is no room beside the ring, so the words go underneath. */
  narrow: boolean
}) {
  const phase = pillarPhase(index)

  const [badgeFrom, badgeTo] = trailing(phase, 0)
  const badgeOpacity = useTransform(progress, [badgeFrom, badgeTo], [0, 1])
  const badgeScale = useTransform(progress, [badgeFrom, badgeTo], [0.4, 1])

  const [titleFrom, titleTo] = trailing(phase, 1)
  const titleOpacity = useTransform(progress, [titleFrom, titleTo], [0, 1])
  const titleY = useTransform(progress, [titleFrom, titleTo], [14, 0])
  const titleSoftness = useTransform(progress, [titleFrom, titleTo], [1, 0])
  const titleBlur = useMotionTemplate`blur(calc(10px * ${titleSoftness}))`

  const [bodyFrom, bodyTo] = trailing(phase, 2)
  const bodyOpacity = useTransform(progress, [bodyFrom, bodyTo], [0, 1])
  const bodyY = useTransform(progress, [bodyFrom, bodyTo], [12, 0])

  // Narrow screens show one pillar's words at a time, so the badge dims once
  // its turn is over — that is what ties the words below to a number up here.
  const [handFrom, handTo] = handover(index)
  const badgeDimming = useTransform(
    progress,
    [badgeFrom, badgeTo, handFrom, handTo],
    [0, 1, 1, 0.28],
  )
  const badgeDim = handsOver(index) ? badgeDimming : badgeOpacity

  // The words sit against the badge, bottom edges level, on whichever side
  // the design puts them — or centred underneath for the one at the bottom.
  const words =
    pillar.place === 'bottom'
      ? 'top-[calc(100%+20px)] left-1/2 w-[272px] -translate-x-1/2 text-center'
      : pillar.place === 'right'
        ? 'bottom-0 left-[calc(100%+34px)] w-[min(270px,22vw)]'
        : 'bottom-0 right-[calc(100%+34px)] w-[min(256px,21vw)]'

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: BADGE[pillar.place].left, top: BADGE[pillar.place].top }}
      data-pillar={pillar.number}
    >
      <motion.div style={{ opacity: narrow ? badgeDim : badgeOpacity, scale: badgeScale }}>
        <Badge>{pillar.number}</Badge>
      </motion.div>

      {/* Beside the badge — only where there is room either side of the ring. */}
      <div className={`absolute hidden xl:block ${words}`}>
        <motion.h3
          style={{ opacity: titleOpacity, y: titleY, filter: titleBlur }}
          className="font-grotesk text-[36px] leading-normal whitespace-nowrap text-ink"
        >
          {pillar.title}
        </motion.h3>
        <motion.p
          style={{ opacity: bodyOpacity, y: bodyY }}
          className="mt-2 text-[16px] leading-normal text-ink-soft"
        >
          {pillar.body}
        </motion.p>
      </div>
    </div>
  )
}

/** One pillar's words under the ring, holding the stage until the next takes over. */
function UnderWords({
  pillar,
  index,
  progress,
}: {
  pillar: Pillar
  index: number
  progress: MotionValue<number>
}) {
  const [from, to] = pillarPhase(index)
  const [handFrom, handTo] = handover(index)
  const leaving = useTransform(progress, [from, to, handFrom, handTo], [0, 1, 1, 0])
  const staying = useTransform(progress, [from, to], [0, 1])
  const opacity = handsOver(index) ? leaving : staying
  const y = useTransform(progress, [from, to], [14, 0])
  const softness = useTransform(progress, [from, to], [1, 0])
  const filter = useMotionTemplate`blur(calc(10px * ${softness}))`

  return (
    <motion.div style={{ opacity, y, filter }} className="absolute inset-0" data-under={pillar.number}>
      <h3 className="font-grotesk text-[26px] leading-normal text-ink">{pillar.title}</h3>
      <p className="mt-2 text-[15px] leading-normal text-ink-soft">{pillar.body}</p>
    </motion.div>
  )
}

/**
 * The words for all three, under the ring, one visible at a time.
 *
 * Below 1280 there is nowhere to put 270px of text either side of the circle,
 * so the ring keeps its numbers and the words move underneath it. An invisible
 * copy of all three holds the tallest one's height, so the ring never shifts
 * as the words change.
 */
function WordsUnderRing({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative mt-10 w-full max-w-[200px] text-center md:max-w-[440px] xl:hidden">
      <div aria-hidden className="invisible grid">
        {PILLARS.map((pillar) => (
          <div key={pillar.number} className="col-start-1 row-start-1">
            <h3 className="font-grotesk text-[26px] leading-normal">{pillar.title}</h3>
            <p className="mt-2 text-[15px] leading-normal">{pillar.body}</p>
          </div>
        ))}
      </div>

      {PILLARS.map((pillar, index) => (
        <UnderWords key={pillar.number} pillar={pillar} index={index} progress={progress} />
      ))}
    </div>
  )
}

/* --------------------------------------------------------- the two layouts */

/**
 * The section parks in the middle of the screen at every width. The ring fades
 * up, its name resolves out of a blur at the centre, and then the three
 * pillars arrive one scroll apart, each one badge first.
 *
 * Only where the words go changes with the screen: beside the ring from 1280
 * up, as the design draws it, and underneath it below that.
 */
function PinnedStage({ narrow }: { narrow: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start end', 'end end'] })

  const circleOpacity = useTransform(scrollYProgress, [...CIRCLE], [0, 1])

  const label = [...LABEL]
  const labelOpacity = useTransform(scrollYProgress, label, [0, 1])
  const labelScale = useTransform(scrollYProgress, label, [0.86, 1])
  const labelSoftness = useTransform(scrollYProgress, label, [1, 0])
  const labelBlur = useMotionTemplate`blur(calc(16px * ${labelSoftness}))`

  // Mirrors the live progress onto the DOM so the sequence can be inspected
  // while scrolling, as the trust strip and the About statement both do.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    trackRef.current?.setAttribute('data-progress', value.toFixed(3))
  })

  return (
    <div ref={trackRef} className="relative h-[340vh]">
      {/* Wide: badge 02 and its words hang 113px below the ring with nothing
          balancing them above, so the foot of the stage is inset by that
          overhang — it lifts the ring by half of it and centres what you
          actually see. Narrow: the words sit under the ring and are part of
          the column, so the column centres itself and no inset is wanted. */}
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden px-4 xl:px-20 xl:pb-[113px]">
        {/* The ring. Everything else is pinned to its edge or its centre, so
            it is the only thing that has to know how big it is.

            Wide, its size is what keeps the rest on screen: a ring taller than
            the screen less 270px would push the bottom pillar past the edge.
            Narrow, it is the width that binds, with the words left room below. */}
        <motion.div
          style={{ opacity: circleOpacity }}
          className="@container relative size-[min(84vw,calc(100dvh-280px))] shrink-0 rounded-full border border-[#b7b7b7] xl:size-[min(676px,calc(100dvh-270px),46vw)]"
        >
          <motion.h2
            id="approach-heading"
            style={{ opacity: labelOpacity, scale: labelScale, filter: labelBlur }}
            /* 60px in the design's 676 circle — 8.88% of it. Measured against
               the ring rather than the viewport, so it keeps that proportion
               at every size the ring takes. */
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-grotesk text-[clamp(26px,8.88cqw,60px)] leading-[1.17] whitespace-nowrap text-ink"
          >
            Our Approach
          </motion.h2>

          {PILLARS.map((pillar, index) => (
            <RingPillar
              key={pillar.number}
              pillar={pillar}
              index={index}
              progress={scrollYProgress}
              narrow={narrow}
            />
          ))}
        </motion.div>

        <WordsUnderRing progress={scrollYProgress} />
      </div>
    </div>
  )
}

/** For anyone asking for less motion: the same three, stacked and still. */
function StackedPillars() {
  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center gap-12 px-4 py-15 md:px-10">
      <h2 id="approach-heading" className="font-grotesk text-[36px] leading-[1.14] text-ink md:text-[48px]">
        Our Approach
      </h2>
      <div className="flex w-full max-w-[560px] flex-col gap-10">
        {PILLARS.map((pillar, index) => (
          <Reveal key={pillar.number} delay={index * 0.08} className="flex items-start gap-5">
            <Badge>{pillar.number}</Badge>
            <Words pillar={pillar} className="flex-1" />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/** Watches a media query and re-renders when the answer changes. */
function useMedia(query: string, initial = false) {
  const [matches, setMatches] = useState(
    () => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches),
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}

export function Approach() {
  // The ring is the section at every width now — only the words move. The
  // plain stack is kept for anyone who has asked for less motion.
  const motionOk = useMedia('(prefers-reduced-motion: no-preference)')
  const wide = useMedia('(min-width: 1280px)')

  return (
    <section
      id="approach"
      className="w-full bg-sand"
      data-node-id="61:53143"
      aria-labelledby="approach-heading"
    >
      {motionOk ? <PinnedStage narrow={!wide} /> : <StackedPillars />}
    </section>
  )
}
