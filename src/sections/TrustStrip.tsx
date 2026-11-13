import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { fadeInProps } from '../components/FadeIn'
import { Reveal } from '../components/Reveal'
import { EASE_OUT } from '../lib/motion'
import { StaggerLines } from '../components/StaggerLines'
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
    alt: 'Illustrated cat in glasses holding up an approved treatment plan',
    side: 'right',
    inset: true,
  },
  {
    title: 'Easy to reach',
    body: 'Call, message or walk in, and a real person from our team answers',
    icon: iconCall,
    image: trust4,
    alt: 'Illustrated dog waving from the reception desk beside a telephone',
    side: 'right',
    inset: false,
  },
]

/* ---------------------------------------------------------------- timings */

type Phase = readonly [number, number]
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
    <article className="flex h-full w-full flex-col justify-between gap-10 rounded-xl bg-white p-3 shadow-card lg:w-[350px]">
      <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-ember">
        <img src={card.icon} alt="" className="size-6" />
      </span>
      <div className="flex w-full flex-col gap-1.5">
        <h3 className="font-grotesk text-[22px] leading-none text-ink">{card.title}</h3>
        <p className="text-[18px] leading-normal text-ink-soft">{card.body}</p>
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
 * One photograph inside the doorway. The image does not travel: it is held
 * still and uncovered from the bottom edge upwards, so the new picture is
 * peeled into view over the one before it rather than sliding across it. The
 * slight settle of its own scale keeps the reveal from feeling like a shutter.
 *
 * Images stack in order, so scrolling back up closes the mask again and the
 * previous photograph is still sitting underneath, untouched.
 */
function ArchImage({ progress, index, card }: { progress: MotionValue<number>; index: number; card: Card }) {
  const [from, to] = cardPhase(index)
  const covered = useTransform(progress, [from, to], [100, 0])
  const clipPath = useMotionTemplate`inset(${covered}% 0% 0% 0%)`
  const scale = useTransform(progress, [from, to], [1.06, 1])

  return (
    <motion.div style={{ clipPath, zIndex: index }} className="absolute inset-0">
      <motion.img
        src={card.image}
        alt={card.alt}
        loading="lazy"
        style={{ scale }}
        className="size-full object-cover"
      />
    </motion.div>
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

  // Mirrors the live progress onto the DOM so the sequence can be inspected
  // while scrolling, as the navigation bar and the About statement both do.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    trackRef.current?.setAttribute('data-progress', value.toFixed(3))
  })

  return (
    <div ref={trackRef} className="relative h-[360vh]">
      <div className="sticky top-0 grid h-dvh place-items-center">
        <div className="flex w-full max-w-[1920px] flex-col items-center gap-[60px] px-20">
          <div className="flex w-full flex-col items-center gap-1 text-center">
            <StaggerLines
              as="h2"
              lines={['Why Families Stay']}
              className="max-w-[650px] font-grotesk text-[60px] leading-[70px] text-ink"
            />
            <Reveal delay={0.15}>
              <p className="text-[18px] text-ink-soft">
                Fast answers, gentle handling and prices agreed before treatment.
              </p>
            </Reveal>
          </div>

          {/* The row has to be at least as tall as the frame, which is
              centred on it and taller than the cards. */}
          <div className="relative flex min-h-[min(586px,62dvh)] w-full max-w-[1352px] items-center justify-between">
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

            {/* The frame. Images stack inside it, newest on top — and it
                carries the cards' own corner radius, so the three shapes in
                the row are the same shape. */}
            <div className="absolute left-1/2 top-1/2 isolate aspect-[379/586] h-[min(586px,62dvh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-ink/5">
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

/**
 * Tablet and mobile: the header, then the doorway, then the cards on a rail
 * you push sideways.
 *
 * The doorway still belongs to a card — scrolling the rail hands it the
 * photograph of whichever card you have reached, which is the same idea as
 * the desktop peel without needing the height a pinned sequence would eat.
 */
/**
 * The frame, between the second and third card.
 *
 * It used to be a readout: the rail's scroll position chose the photograph,
 * so the picture only moved when the cards did. Stacked, there is nothing to
 * read, so it simply shows the four in turn — long enough on each to be
 * looked at, blurring out and back in rather than cutting.
 */
function CyclingFrame() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % CARDS.length), 3600)
    return () => window.clearInterval(id)
  }, [reduceMotion])

  return (
    // Atmosphere, not information: the four cards beside it already say
    // everything this is here to feel like, and a picture that swaps itself
    // every few seconds is nothing but interruption read aloud.
    <div
      aria-hidden
      className="relative isolate aspect-[379/480] w-full overflow-hidden rounded-xl bg-ink/5"
    >
      {CARDS.map((card, index) => (
        <motion.img
          key={card.title}
          src={card.image}
          alt=""
          loading="lazy"
          initial={false}
          animate={{
            opacity: active === index ? 1 : 0,
            filter: active === index ? 'blur(0px)' : 'blur(10px)',
            scale: active === index ? 1 : 1.04,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE_OUT }}
          className="absolute inset-0 size-full object-cover"
        />
      ))}
    </div>
  )
}

/**
 * The phone layout: the four cards stacked, with the frame sitting between
 * the second and the third.
 *
 * They were a horizontal rail, which asked people to push sideways through a
 * page that otherwise only goes down, and left the cards reading as unequal —
 * one and a half of them visible at a time, each a different amount of itself.
 * Stacked, they are four of the same thing, and the frame breaks the run so
 * the column is not eight hundred pixels of card.
 */
function MobileStrip() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-start px-4 py-15">
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <StaggerLines
          as="h2"
          lines={['Why Families Stay']}
          className="w-full font-grotesk text-[36px] leading-[1.19] text-ink"
        />
        <Reveal delay={0.15}>
          <p className="w-full text-[18px] leading-normal text-ink-soft">
            Fast answers, gentle handling and prices agreed before treatment.
          </p>
        </Reveal>
      </div>

      <div className="mt-[40px] flex w-full flex-col gap-4">
        {CARDS.slice(0, 2).map((card) => (
          <Reveal key={card.title} className="w-full">
            <CardFace card={card} />
          </Reveal>
        ))}

        <motion.div {...fadeInProps} className="w-full">
          <CyclingFrame />
        </motion.div>

        {CARDS.slice(2).map((card) => (
          <Reveal key={card.title} className="w-full">
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
      {pinned ? <PinnedStage /> : <MobileStrip />}
    </section>
  )
}
