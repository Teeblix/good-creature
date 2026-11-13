import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { FadeIn } from '../components/FadeIn'
import { StaggerLines } from '../components/StaggerLines'
import { StaggerText } from '../components/StaggerText'
import { EASE_OUT } from '../lib/motion'
import arrowLeft from '../assets/icon-arrow-left.svg'
import arrowRight from '../assets/icon-arrow-right-nav.svg'
import avatar1 from '../assets/testimonial-1.webp'
import avatar2 from '../assets/testimonial-2.webp'
import avatar3 from '../assets/testimonial-3.webp'
import avatar4 from '../assets/testimonial-4.webp'

type Testimonial = {
  quote: string
  name: string
  role: string
  avatar: string
  alt: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '“Miso used to shake in the car park. Now she walks in with her tail up. Nobody rushes her, and nobody makes me feel silly for worrying.”',
    name: 'Amara O.',
    role: 'Owner of Miso',
    avatar: avatar2,
    alt: 'Amara holding her small dog Miso',
  },
  {
    quote:
      '“They wrote down the plan and the cost before anything started. For the first time at a vet, I knew exactly what I was agreeing to.”',
    name: 'Daniel K.',
    role: 'Owner of Biscuit',
    avatar: avatar3,
    alt: 'Daniel with his dog Biscuit',
  },
  {
    quote:
      '“Pepper stopped eating on a Tuesday morning and we were seen that afternoon. They explained everything in plain words, and called the next day to check on her.”',
    name: 'Tolu A.',
    role: 'Owner of Pepper',
    avatar: avatar1,
    alt: 'Tolu holding her cat Pepper',
  },
  {
    quote:
      '“Our old boy Bruno needed more time than most, and they gave it to him. The team treated his last months with so much kindness.”',
    name: 'Grace M.',
    role: 'Owner of Bruno',
    // Generated portrait — the Figma file only carries three.
    avatar: avatar4,
    alt: 'Grace sitting at home with her elderly golden retriever Bruno',
  },
]

/**
 * The quote's type, in one place: the visible quote and the invisible copy
 * that reserves its height have to be set identically or the reservation is
 * wrong. Neue Montreal at 36px is what the redesign uses — the section was
 * previously set in the display serif.
 */
const QUOTE_CLASS =
  'w-full text-center font-grotesk text-[24px] leading-normal text-ink sm:text-[28px] lg:text-[36px]'

const SMALL = 60
const LARGE = 128
/** Centre-to-centre distance between the active portrait and a neighbour. */
const STEP = LARGE / 2 + 13 + SMALL / 2

function slotFor(offset: number) {
  const clamped = Math.max(-2, Math.min(2, offset))
  const size = clamped === 0 ? LARGE : SMALL
  return {
    size,
    x: clamped * STEP - size / 2,
    y: -size / 2,
    opacity: Math.abs(offset) <= 1 ? 1 : 0,
  }
}

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  const active = TESTIMONIALS[index]
  const hasPrevious = index > 0
  const hasNext = index < TESTIMONIALS.length - 1

  const transition = { duration: reduceMotion ? 0 : 0.6, ease: EASE_OUT }

  return (
    <section
      id="stories"
      className="w-full bg-cream"
      data-node-id="61:53446"
      aria-roledescription="carousel"
      aria-label="Client stories"
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-start px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col items-center gap-[80px]">
          <StaggerLines
            as="h2"
            id="stories-heading"
            label="What Families Say About Us"
            lines={[
              <>
                What Families <span className="text-ember">Say</span>
              </>,
              'About Us',
            ]}
            className="max-w-[650px] text-center font-grotesk text-[36px] leading-[1.17] text-ink lg:text-[60px] lg:leading-[70px]"
          />

          <FadeIn className="flex w-full flex-col items-center gap-[50px]">
            {/* Portraits — the active one sits centre at 128px, neighbours at 60px.
                Moving on slides each portrait into its new slot. */}
            <div className="relative h-[128px] w-[274px] overflow-hidden" aria-hidden>
              {TESTIMONIALS.map((item, i) => {
                const { size, x, y, opacity } = slotFor(i - index)
                return (
                  <motion.div
                    key={item.name}
                    className="absolute top-1/2 left-1/2 overflow-hidden rounded-lg"
                    initial={false}
                    animate={{ x, y, width: size, height: size, opacity }}
                    transition={transition}
                  >
                    <img src={item.avatar} alt="" className="size-full object-cover" />
                  </motion.div>
                )
              })}
            </div>

            {/* Quote — remounts on change so the lines stagger back in */}
            <div className="flex w-full flex-col items-center gap-[50px]" aria-live="polite">
              {/* The quotes are not the same length, and without a fixed box
                  the longest ones push the name and the arrows down the page
                  as you move through them. An invisible copy of all four holds
                  the tallest one's height, so the controls never move. */}
              <div className="relative w-full max-w-[850px]">
                <div aria-hidden className="invisible grid">
                  {TESTIMONIALS.map((item) => (
                    <p key={item.name} className={`col-start-1 row-start-1 ${QUOTE_CLASS}`}>
                      {item.quote}
                    </p>
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center">
                  <StaggerText
                    key={`quote-${index}`}
                    text={active.quote}
                    playOnMount
                    className={QUOTE_CLASS}
                  />
                </div>
              </div>

              <Reveal key={`who-${index}`} playOnMount delay={0.25}>
                <div className="flex flex-col items-center text-center">
                  <p className="text-[18px] text-ink">{active.name}</p>
                  <p className="text-[14px] text-ink-soft">{active.role}</p>
                </div>
              </Reveal>
            </div>

            {/* Controls */}
            <div className="flex w-[75px] items-center justify-between">
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={!hasPrevious}
                aria-label="Previous story"
                className="size-6 transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <img src={arrowLeft} alt="" className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(TESTIMONIALS.length - 1, i + 1))}
                disabled={!hasNext}
                aria-label="Next story"
                className="size-6 transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <img src={arrowRight} alt="" className="size-6" />
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
