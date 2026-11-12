import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Reveal } from '../components/Reveal'
import iconClock from '../assets/icon-why-clock.svg'
import iconHeart from '../assets/icon-why-heart.svg'
import iconReceipt from '../assets/icon-why-receipt.svg'
import iconCall from '../assets/icon-why-call.svg'
import trust1 from '../assets/trust-1.webp'
import trust2 from '../assets/trust-2.webp'
import trust3 from '../assets/trust-3.webp'
import trust4 from '../assets/trust-4.webp'

type Card = {
  title: string
  body: string
  icon: string
  image: string
  alt: string
  /** Which column the card sits in — it slides in from that side. */
  side: 'left' | 'right'
  /** The 89px inset that staggers the second card of each column. */
  inset: boolean
}

/** Reveal order is array order: left column top to bottom, then right column. */
const CARDS: Card[] = [
  {
    title: 'Same day sick visits',
    body: 'Unwell pets are seen quickly, so you are never left waiting and worrying',
    icon: iconClock,
    image: trust1,
    alt: 'Illustrated cat waving from a clinic waiting bench',
    side: 'left',
    inset: false,
  },
  {
    title: 'Quiet, patient handling',
    body: 'Calm rooms and unhurried hands help nervous pets settle at their own pace',
    icon: iconHeart,
    image: trust2,
    alt: 'Illustrated dog resting calmly on a sofa cushion',
    side: 'left',
    inset: true,
  },
  {
    title: 'Prices agreed first',
    body: 'You approve every plan and cost before treatment starts, with no surprises',
    icon: iconReceipt,
    image: trust3,
    alt: 'Illustrated cat holding up an approved treatment plan',
    side: 'right',
    inset: true,
  },
  {
    title: 'Easy to reach',
    body: 'Call, message or walk in, and a real person from our team answers',
    icon: iconCall,
    image: trust4,
    alt: 'Illustrated dog holding a telephone receiver',
    side: 'right',
    inset: false,
  },
]

/* ---------------------------------------------------------------- timings */

type Phase = readonly [number, number]
/** The heading settles while the section is still arriving. */
const HEADING: Phase = [0.12, 0.26]
const SUBHEADING: Phase = [0.16, 0.3]
/** Progress at which the first card lands, and how the rest follow. */
const FIRST_CARD = 0.26
const CARD_STEP = 0.17
const CARD_SPAN = 0.1

function cardPhase(index: number): Phase {
  const from = FIRST_CARD + index * CARD_STEP
  return [from, from + CARD_SPAN]
}

/* ------------------------------------------------------------- the pieces */

/** The card itself — identical in both layouts, so only its wrapper changes. */
function CardFace({ card }: { card: Card }) {
  return (
    <article className="flex w-full flex-col gap-20 rounded-[4px] border border-line bg-cream p-3 lg:w-[350px]">
      <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-ember">
        <img src={card.icon} alt="" className="size-6" />
      </span>
      <div className="flex w-full flex-col gap-1.5">
        <h3 className="font-grotesk text-[22px] leading-none text-ink">{card.title}</h3>
        <p className="text-[14px] leading-normal text-ink-soft">{card.body}</p>
      </div>
    </article>
  )
}

/** A card on the pinned stage: it fades in from its own side of the section. */
function ScrollCard({ progress, index, card }: { progress: MotionValue<number>; index: number; card: Card }) {
  const [from, to] = cardPhase(index)
  const opacity = useTransform(progress, [from, to], [0, 1])
  const x = useTransform(progress, [from, to], [card.side === 'left' ? -36 : 36, 0])

  return (
    <motion.div style={{ opacity, x }} className={card.inset ? 'ml-[89px]' : ''}>
      <CardFace card={card} />
    </motion.div>
  )
}

/**
 * One photograph inside the doorway. Each new image rises over the one before
 * it and stays there, so the stack reads as a single frame being refilled —
 * and scrolling back up slides the newest image away to uncover the last.
 */
function ArchImage({ progress, index, card }: { progress: MotionValue<number>; index: number; card: Card }) {
  const [from, to] = cardPhase(index)
  const y = useTransform(progress, [from, to], ['101%', '0%'])

  return (
    <motion.img
      src={card.image}
      alt={card.alt}
      loading="lazy"
      style={{ y, zIndex: index }}
      className="absolute inset-0 size-full object-cover"
    />
  )
}

/* --------------------------------------------------------- the two layouts */

/**
 * Desktop and laptop: the section parks in the middle of the screen while the
 * four cards arrive one scroll at a time, each handing its photograph to the
 * doorway in the centre. Every move is tied to scroll position, so the whole
 * sequence unwinds if you scroll back up.
 */
function PinnedStage() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start end', 'end end'] })

  const heading = [...HEADING]
  const headingOpacity = useTransform(scrollYProgress, heading, [0, 1])
  const headingY = useTransform(scrollYProgress, heading, ['0.3em', '0em'])
  const headingSoftness = useTransform(scrollYProgress, heading, [1, 0])
  const headingBlur = useMotionTemplate`blur(calc(12px * ${headingSoftness}))`

  const sub = [...SUBHEADING]
  const subOpacity = useTransform(scrollYProgress, sub, [0, 1])
  const subY = useTransform(scrollYProgress, sub, ['0.5em', '0em'])

  // Mirrors the live progress onto the DOM so the sequence can be inspected
  // while scrolling, as the navigation bar and the About statement both do.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    trackRef.current?.setAttribute('data-progress', value.toFixed(3))
  })

  return (
    <div ref={trackRef} className="relative h-[360vh]">
      <div className="sticky top-0 grid h-dvh place-items-center">
        <div className="flex w-full max-w-[1920px] flex-col items-center gap-[50px] px-20">
          <div className="flex w-full flex-col items-center gap-1 text-center">
            <motion.h2
              style={{ opacity: headingOpacity, y: headingY, filter: headingBlur }}
              className="max-w-[650px] font-grotesk text-[60px] leading-[70px] text-ink"
            >
              Why families stay
            </motion.h2>
            <motion.p
              style={{ opacity: subOpacity, y: subY }}
              className="max-w-[400px] text-[16px] text-ink-soft"
            >
              Fast answers, gentle handling and prices agreed before treatment.
            </motion.p>
          </div>

          <div className="relative flex min-h-[474px] w-full max-w-[1352px] items-center justify-between">
            <div className="flex flex-col gap-[30px]">
              {CARDS.filter((card) => card.side === 'left').map((card) => (
                <ScrollCard
                  key={card.title}
                  card={card}
                  index={CARDS.indexOf(card)}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            {/* The doorway. Images stack inside it, newest on top. */}
            <div className="absolute left-1/2 top-1/2 isolate aspect-[379/586] h-[min(586px,58dvh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-t-[250px] bg-ink/5">
              {CARDS.map((card, index) => (
                <ArchImage
                  key={card.title}
                  card={card}
                  index={index}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            <div className="flex flex-col gap-[30px]">
              {CARDS.filter((card) => card.side === 'right').map((card) => (
                <ScrollCard
                  key={card.title}
                  card={card}
                  index={CARDS.indexOf(card)}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Tablet and mobile: the same cards, simply stacked and read in order. */
function StackedCards() {
  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center gap-10 px-4 py-15 md:px-10">
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <h2 className="max-w-[650px] font-grotesk text-[36px] leading-[1.14] text-ink md:text-[48px]">
          Why families stay
        </h2>
        <p className="max-w-[400px] text-[16px] text-ink-soft">
          Fast answers, gentle handling and prices agreed before treatment.
        </p>
      </div>
      <div className="flex w-full max-w-[560px] flex-col gap-4 md:max-w-[720px]">
        {CARDS.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.08}>
            <CardFace card={card} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function TrustStrip() {
  // The pinned sequence is a desktop and laptop idea; narrower screens and
  // anyone asking for reduced motion get the plain stack.
  const [pinned, setPinned] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1280px) and (prefers-reduced-motion: no-preference)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1280px) and (prefers-reduced-motion: no-preference)')
    const update = () => setPinned(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <section id="why-families-stay" className="w-full bg-cream" data-node-id="107:9964">
      {pinned ? <PinnedStage /> : <StackedCards />}
    </section>
  )
}
