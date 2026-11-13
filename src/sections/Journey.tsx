import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { useBookVisit } from '../components/FormPanel'
import { fadeInProps } from '../components/FadeIn'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import { StaggerText } from '../components/StaggerText'
import { EASE_OUT } from '../lib/motion'
import iconCalendar from '../assets/icon-journey-calendar.svg'
import iconHeart from '../assets/icon-journey-heart.svg'
import iconHealth from '../assets/icon-journey-health.svg'
import iconHome from '../assets/icon-journey-home.svg'
import step1 from '../assets/journey-step-1.webp'
import step2 from '../assets/journey-step-2.webp'
import step3 from '../assets/journey-step-3.webp'
import step4 from '../assets/journey-step-4.webp'

type Step = {
  number: string
  title: string
  body: string
  icon: string
  image: string
  alt: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Before you arrive',
    body: 'We send a reminder with what to bring and carrier tips. Tell us how your pet copes and we plan around it.',
    icon: iconCalendar,
    image: step1,
    alt: 'Illustrated cat stepping into an open carrier beside a packing checklist',
  },
  {
    number: '02',
    title: 'A quiet welcome',
    body: 'No crowded waiting room. We greet you at the door and take you straight to a calm room made for nervous pets.',
    icon: iconHeart,
    image: step2,
    alt: 'Illustrated nurse kneeling to greet a small dog at the practice door',
  },
  {
    number: '03',
    title: 'A gentle exam',
    body: 'Your pet sets the pace while we explain each step as it happens. You get a plain plan with costs before we begin.',
    icon: iconHealth,
    image: step3,
    alt: 'Illustrated cat on an examination table with a stethoscope held to its chest',
  },
  {
    number: '04',
    title: 'The ride home',
    body: 'You leave with medication, written aftercare and a date for the next visit. We call the next day to check in.',
    icon: iconHome,
    image: step4,
    alt: 'Illustrated dog trotting home beside a medicine bottle and a dated calendar card',
  },
]

/**
 * The white veil that sits over the lower half of the photograph, so the
 * illustration dissolves into the card's own fill instead of ending on a seam.
 */
const VEIL = 'linear-gradient(180deg, rgba(255,255,255,0) 46.2%, rgba(255,255,255,1) 99.3%)'

/**
 * Share of its own row height a resting card keeps. The design draws it at
 * 343 of 568, but the row there is only as wide as a 1512 frame — on a real
 * desktop the cards grow sideways, so a resting card held at that share turns
 * square. Kept taller, every card stays an upright rectangle at any width.
 */
const RESTING_HEIGHT = '74%'

/** How much wider the open card grows: 400 against 303 in the design. */
const OPEN_GROW = 1.32

/** The row's gap, and the padding each card carries outside its share. */
const GAP = 8
const EDGES = 24

/**
 * The curve the card opens on.
 *
 * The site's entrance easing is an expo ease-out, which is right for something
 * small arriving but wrong for a card that rebuilds itself: on that curve 40%
 * of the distance is gone in the first tenth of the move, and the rest creeps
 * in afterwards. It reads as a jump followed by a drift.
 *
 * This one spreads the move out — roughly a fifth of the way at a fifth of the
 * time, half by the third, then a long deceleration. It still answers the
 * cursor on the first frame, but it never snaps.
 */
const OPEN_EASE = [0.33, 0.06, 0.2, 1] as const

/** Live media query, so the open title can take its larger size only where it fits. */
function useMinWidth(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}

/**
 * One step in the row.
 *
 * Resting, the card is narrow and short: a pale number at the top and the step
 * name sitting on the floor of the card. Open, it takes a third again of the
 * width, stands to full height, and the number hands over to the photograph
 * while the body text grows in underneath the name.
 *
 * The photograph is stacked on top of the number rather than replacing it, so
 * the two cross-fade in place and the card never reflows mid-hover.
 */
function StepCard({
  step,
  isOpen,
  bodyHeight,
  bodyWidth,
  onOpen,
}: {
  step: Step
  isOpen: boolean
  /** The body's height once this card is open — measured before the move starts. */
  bodyHeight: number
  /** And its width, for the same reason. */
  bodyWidth: number
  onOpen: () => void
}) {
  const reduceMotion = useReducedMotion()
  const wide = useMinWidth('(min-width: 1280px)')
  const transition = { duration: reduceMotion ? 0 : 0.55, ease: OPEN_EASE }

  // Counts the opens. Each one gives the body a new key, so it is built
  // again and the lines resolve in from the start.
  const [plays, setPlays] = useState(0)
  useEffect(() => {
    if (isOpen) setPlays((count) => count + 1)
  }, [isOpen])

  return (
    <motion.button
      type="button"
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onOpen}
      aria-pressed={isOpen}
      style={{ flexBasis: 0 }}
      animate={{ flexGrow: isOpen ? OPEN_GROW : 1, height: isOpen ? '100%' : RESTING_HEIGHT }}
      transition={transition}
      className="relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl bg-white p-3 text-left shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      {/* The number and the photograph share this space and trade places in it. */}
      <div className="relative min-h-0 w-full flex-1">
        <motion.span
          aria-hidden
          animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? -12 : 0 }}
          transition={transition}
          className="absolute top-0 left-0 font-grotesk text-[80px] leading-[1.2] whitespace-nowrap text-[#e8e8e8]"
        >
          {step.number}
        </motion.span>

        {/* Opacity and scale only. A blur here looked right in isolation, but
            the browser rasterises a filtered layer once, at the size the box
            had when the hover started, then stretches that one bitmap as the
            card grows — and drops it the moment the filter reaches zero. That
            hand-back is the jump: the picture snaps to its true resolution
            after everything else has settled. */}
        <motion.span
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
          transition={transition}
          className="absolute inset-0 block overflow-hidden rounded-t-[4px]"
        >
          <img src={step.image} alt={step.alt} loading="lazy" className="size-full object-cover" />
          <span aria-hidden className="absolute inset-0" style={{ background: VEIL }} />
        </motion.span>
      </div>

      {/* Name and body sit on the floor of the card, so they grow upwards. */}
      <div className="mt-[30px] flex w-full flex-col items-start gap-2">
        <span className="flex size-[36.8px] shrink-0 items-center justify-center rounded-full bg-ember">
          <img src={step.icon} alt="" className="size-[19.2px]" />
        </span>
        <motion.h3
          animate={{ fontSize: isOpen ? (wide ? 36 : 30) : 22 }}
          transition={transition}
          className="w-full font-grotesk leading-tight text-ink"
        >
          {step.title}
        </motion.h3>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? bodyHeight : 0,
          marginTop: isOpen ? 32 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          ...transition,
          // Up quickly, so the stagger underneath is what you notice; down
          // slowly, so the words are still there while the card collapses.
          opacity: { duration: reduceMotion ? 0 : isOpen ? 0.2 : 0.4, ease: EASE_OUT },
        }}
        className="w-full overflow-hidden"
      >
        {/* Held at the width it will have once the card is open, rather than
            the width the card has right now. The card grows for 550ms, and a
            paragraph that takes its width from the card re-wraps on every one
            of those frames — you watch the lines rebuild themselves. Fixed, it
            is typeset once. The card clips the overflow while it is narrow. */}
        <div
          style={{ width: bodyWidth || undefined }}
          className="text-[18px] leading-normal text-pretty text-black"
        >
          {/* Keyed on the count, not on isOpen: the lines have to stay on
              screen while the card closes, so the block is never unmounted —
              it is replaced, which is what makes it play again. */}
          {plays > 0 && (
            <StaggerText
              key={plays}
              text={step.body}
              playOnMount
              stagger={0.08}
              delay={0.18}
            />
          )}
        </div>
      </motion.div>
    </motion.button>
  )
}

/** The same four steps stacked and fully open, for tablet and mobile. */
function StackedSteps() {
  return (
    <div className="flex w-full flex-col gap-4 lg:hidden">
      {STEPS.map((step) => (
        <Reveal
          key={step.number}
          className="flex w-full flex-col rounded-xl bg-white p-3 shadow-card"
        >
          <span className="relative block h-[220px] w-full overflow-hidden rounded-t-[4px]">
            <img src={step.image} alt={step.alt} loading="lazy" className="size-full object-cover" />
            <span aria-hidden className="absolute inset-0" style={{ background: VEIL }} />
          </span>
          <span className="mt-[30px] flex size-[36.8px] items-center justify-center rounded-full bg-ember">
            <img src={step.icon} alt="" className="size-[19.2px]" />
          </span>
          <h3 className="mt-2 font-grotesk text-[22px] leading-tight text-ink">{step.title}</h3>
          <p className="mt-6 text-[18px] leading-normal text-pretty text-black">{step.body}</p>
        </Reveal>
      ))}
    </div>
  )
}

/**
 * Every body's height at the width its card will have once it is open.
 *
 * The card cannot measure this itself. A paragraph inside a card that is still
 * narrow wraps onto more lines than it will need once the card has grown, so a
 * height read at the start of the move — or left to the browser as 'auto' — is
 * the wrong number, and the card spends the end of its move correcting it.
 * This copy is laid out at the open width from the start and never moves, so
 * the card knows where it is going on the first frame.
 */
function useOpenBodyHeights() {
  const rowRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [heights, setHeights] = useState<number[]>(() => STEPS.map(() => 0))
  const [bodyWidth, setBodyWidth] = useState(0)

  useLayoutEffect(() => {
    const row = rowRef.current
    const measure = measureRef.current
    if (!row || !measure) return

    const run = () => {
      // Cards size themselves off a zero basis, so the space is shared out by
      // grow factor — but each card's own padding and border sit outside that.
      const shared = row.clientWidth - GAP * (STEPS.length - 1) - EDGES * STEPS.length
      const width = (shared * OPEN_GROW) / (STEPS.length - 1 + OPEN_GROW)
      if (width <= 0) return

      measure.style.width = `${width}px`
      setBodyWidth((current) => (current === width ? current : width))
      const next = Array.from(measure.children, (child) => (child as HTMLElement).offsetHeight)
      setHeights((current) =>
        current.length === next.length && current.every((h, i) => h === next[i]) ? current : next,
      )
    }

    run()
    const observer = new ResizeObserver(run)
    observer.observe(row)
    return () => observer.disconnect()
  }, [])

  return { rowRef, measureRef, heights, bodyWidth }
}

export function Journey() {
  // One card is always open; leaving the row hands it back to the first step.
  const [open, setOpen] = useState(0)
  const openBooking = useBookVisit()
  const { rowRef, measureRef, heights, bodyWidth } = useOpenBodyHeights()

  return (
    <section
      id="plan-a-visit"
      className="w-full bg-cream"
      data-node-id="61:53145"
      aria-labelledby="journey-heading"
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-start px-4 py-15 lg:p-10 xl:p-20">
        <div className="relative flex w-full flex-col items-center gap-[50px]">
          {/* Headline on the left, the standing invitation on the right */}
          <div className="flex w-full flex-col items-start justify-between gap-3 lg:flex-row lg:gap-12">
            <StaggerLines
              as="h2"
              id="journey-heading"
              lines={['How a Visit Works', 'in Four Steps']}
              className="max-w-[650px] font-grotesk text-[36px] leading-[1.17] text-ink lg:text-[48px] xl:text-[60px] xl:leading-[70px]"
            />

            <div className="flex w-full max-w-[450px] flex-col items-start gap-6">
              <Reveal delay={0.1}>
                <p className="text-[18px] leading-normal text-ink-soft">
                  From packing the carrier to the ride home, every step is planned around your pet.
                  You always know what happens next, and you stay in control the whole way.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <ArrowButton variant="primary" onPress={openBooking}>
                  Book a visit
                </ArrowButton>
              </Reveal>
            </div>
          </div>

          <StackedSteps />

          {/* Desktop row: hovering a card opens it and closes the one before.
              The row's height tracks the viewport, because the cards share the
              width between them — pinned to the design's 568 they would spread
              into squares on a wide screen instead of staying upright. */}
          {/* Laid out, never painted: the bodies at their open width. */}
          <div
            ref={measureRef}
            aria-hidden
            className="pointer-events-none invisible absolute top-0 left-0 text-[18px] leading-normal text-pretty"
          >
            {STEPS.map((step) => (
              <p key={step.number}>{step.body}</p>
            ))}
          </div>

          <motion.div
            ref={rowRef}
            {...fadeInProps}
            className="hidden w-full items-center justify-center gap-2 lg:flex lg:h-[clamp(500px,calc(45vw-83px),740px)]"
            onMouseLeave={() => setOpen(0)}
          >
            {STEPS.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                isOpen={open === index}
                bodyHeight={heights[index]}
                bodyWidth={bodyWidth}
                onOpen={() => setOpen(index)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
