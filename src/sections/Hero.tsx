import { motion, useReducedMotion } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { StaggerLines } from '../components/StaggerLines'
import { StaggerText } from '../components/StaggerText'
import { EASE_OUT } from '../lib/motion'
import heroDesktop from '../assets/hero-v2.webp'
import heroMobile from '../assets/hero-mobile.webp'
import clockIcon from '../assets/icon-clock.svg'
import heartIcon from '../assets/icon-heart.svg'
import tickIcon from '../assets/icon-tick-circle.svg'

/** The stacked scrims from the design. Mobile uses its own, lighter set —
 *  the portrait crop carries more of the scene, so it needs less covering. */
const SCRIM_DESKTOP =
  'linear-gradient(0deg, rgba(36, 18, 8, 0.78) 0%, rgba(36, 18, 8, 0.5) 30%, rgba(36, 18, 8, 0.1) 65%, rgba(36, 18, 8, 0) 100%), ' +
  'linear-gradient(180deg, rgba(36, 18, 8, 0.45) 0%, rgba(36, 18, 8, 0.15) 40%, rgba(36, 18, 8, 0) 100%), ' +
  'linear-gradient(90deg, rgba(36, 18, 8, 0.5) 0%, rgba(36, 18, 8, 0.3) 50%, rgba(36, 18, 8, 0) 80%), ' +
  'linear-gradient(90deg, rgba(36, 18, 8, 0.05) 0%, rgba(36, 18, 8, 0.05) 100%)'

const SCRIM_MOBILE =
  'linear-gradient(0deg, rgba(36, 18, 8, 0.6) 0%, rgba(36, 18, 8, 0.3) 30%, rgba(36, 18, 8, 0) 60%, rgba(36, 18, 8, 0) 100%), ' +
  'linear-gradient(180deg, rgba(36, 18, 8, 0.5) 0%, rgba(36, 18, 8, 0.22) 40%, rgba(36, 18, 8, 0) 100%), ' +
  'linear-gradient(90deg, rgba(36, 18, 8, 0.08) 0%, rgba(36, 18, 8, 0.08) 100%)'

const FACTS = [
  {
    icon: clockIcon,
    title: 'Same day sick visits',
    body: 'Unwell pets seen without delay',
  },
  {
    icon: heartIcon,
    title: 'Quiet, patient handling',
    body: 'Calm rooms and no rushing, so nervous pets settle',
  },
  {
    icon: tickIcon,
    title: 'Prices agreed first',
    body: 'You approve every plan and cost before we begin',
  },
]

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="top"
      // Pinned from the xl breakpoint up so the sections that follow ride up
      // over it. The offset holds the whole hero on screen first: it scrolls
      // until its bottom meets the viewport bottom, then sticks.
      data-sticky-hero
      className="relative flex min-h-[789px] w-full flex-col overflow-hidden lg:min-h-[994px] xl:sticky xl:top-[min(0px,calc(100dvh-994px))] xl:z-0"
      data-node-id="96:9714"
    >
      {/* Photograph, easing out of a slow zoom, under the design's scrims.
          The source swaps at the lg breakpoint, so only one file is fetched. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            scale: { duration: reduceMotion ? 0 : 2.4, ease: EASE_OUT },
            opacity: { duration: reduceMotion ? 0.3 : 1.2, ease: EASE_OUT },
          }}
        >
          <picture>
            <source media="(min-width: 1024px)" srcSet={heroDesktop} />
            <img
              src={heroMobile}
              alt=""
              fetchPriority="high"
              className="absolute inset-0 size-full max-w-none object-cover"
            />
          </picture>
        </motion.div>
        <div className="absolute inset-0 lg:hidden" style={{ backgroundImage: SCRIM_MOBILE }} />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ backgroundImage: SCRIM_DESKTOP }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-between gap-16 px-4 pt-[120px] pb-10 lg:px-20">
        {/* Headline */}
        <h1 className="w-full max-w-[850px] font-grotesk leading-[1.15] text-cream">
          <StaggerText
            text="Braver Visits Start with Kinder Care"
            playOnMount
            delay={0.35}
            className="block text-[46px] lg:hidden"
          />
          <StaggerLines
            playOnMount
            delay={0.35}
            lines={['Braver Visits', 'Start with Kinder Care']}
            className="hidden text-[80px] lg:block"
          />
        </h1>

        {/* Reassurances left, promise and call to action right */}
        <div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <ul className="hidden w-full flex-col items-start justify-center gap-5 lg:flex lg:w-[380px] lg:max-w-[380px] lg:shrink-0">
            {FACTS.map((fact, index) => (
              <motion.li
                key={fact.title}
                className="flex w-full items-center gap-3"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0.3 : 0.7,
                  ease: EASE_OUT,
                  delay: 0.9 + index * 0.12,
                }}
              >
                <img src={fact.icon} alt="" className="size-10 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 text-cream">
                  <p className="w-full font-grotesk text-[18px] font-medium">{fact.title}</p>
                  <p className="w-full text-[14px]">{fact.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="flex w-full flex-col justify-center lg:min-w-0 lg:flex-1 lg:items-end">
            {/* 632px in the design; Switzer sets wider than Neue Montreal, so the
                box is widened just enough to keep the design's two-line break. */}
            <div className="flex w-full flex-col items-start justify-center gap-6 lg:w-[680px]">
              <StaggerText
                text="We take every step with you and your pet, and nothing happens until you say yes"
                playOnMount
                delay={0.6}
                className="w-full font-grotesk text-[26px] leading-[1.25] text-cream lg:text-[36px]"
              />
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0.3 : 0.7, ease: EASE_OUT, delay: 1.15 }}
                className="w-full lg:w-auto"
              >
                <ArrowButton
                  variant="light"
                  href="#plan-a-visit"
                  className="w-full justify-between lg:w-auto lg:justify-center"
                >
                  Book a visit
                </ArrowButton>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
