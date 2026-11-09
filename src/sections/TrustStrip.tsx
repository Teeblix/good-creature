import { motion, useReducedMotion } from 'motion/react'
import { Eyebrow } from '../components/Eyebrow'
import { StaggerLines } from '../components/StaggerLines'
import { WipeImage } from '../components/WipeImage'
import { EASE_OUT, VIEWPORT } from '../lib/motion'
import type { WipeDirection } from '../lib/motion'
import trust1 from '../assets/trust-1.webp'
import trust2 from '../assets/trust-2.webp'
import trust3 from '../assets/trust-3.webp'
import trust4 from '../assets/trust-4.webp'

type TrustCard = {
  title: string
  body: string
  image: string
  alt: string
  /** 'start' puts the image after the copy (left column), 'end' puts it first (right column). */
  imageSide: 'after' | 'before'
  wipe: WipeDirection
}

const CARDS: TrustCard[] = [
  {
    title: 'Same day sick visits',
    body: 'Unwell pets seen quickly.',
    image: trust1,
    alt: 'Illustrated cat waving from a clinic waiting bench',
    imageSide: 'after',
    wipe: 'right',
  },
  {
    title: 'Low stress handling',
    body: 'Patient, gentle, never rushed.',
    image: trust2,
    alt: 'Illustrated dog resting calmly on a sofa cushion',
    imageSide: 'before',
    wipe: 'left',
  },
  {
    title: 'Clear costs first',
    body: 'You approve the plan before we begin.',
    image: trust3,
    alt: 'Illustrated cat holding up an approved treatment plan',
    imageSide: 'after',
    wipe: 'right',
  },
  {
    title: 'Easy to reach',
    body: 'Call, message or walk in.',
    image: trust4,
    alt: 'Illustrated dog answering a telephone at a reception desk',
    imageSide: 'before',
    wipe: 'left',
  },
]

function Card({ card }: { card: TrustCard }) {
  const copy = (
    <div
      className={`flex w-full flex-col justify-center gap-0.5 lg:min-w-0 lg:flex-1 ${
        card.imageSide === 'after' ? 'items-start lg:items-end lg:text-right' : 'items-start'
      }`}
    >
      <StaggerLines
        as="h3"
        lines={[card.title]}
        className="w-full font-display text-[26px] text-ink lg:text-[36px]"
      />
      <p className="w-full text-[16px] text-ink-soft">{card.body}</p>
    </div>
  )

  const image = (
    <WipeImage
      src={card.image}
      alt={card.alt}
      direction={card.wipe}
      className="h-[250px] w-full shrink-0 lg:w-[220px]"
    />
  )

  return (
    <div className="flex flex-col items-start justify-center gap-5 lg:flex-row lg:items-center lg:justify-center">
      {card.imageSide === 'before' ? (
        <>
          <div className="order-2 w-full lg:order-1 lg:w-auto lg:min-w-0 lg:flex-none">{image}</div>
          <div className="order-1 w-full lg:order-2 lg:min-w-0 lg:flex-1">{copy}</div>
        </>
      ) : (
        <>
          <div className="order-1 w-full lg:min-w-0 lg:flex-1">{copy}</div>
          <div className="order-2 w-full lg:w-auto lg:flex-none">{image}</div>
        </>
      )}
    </div>
  )
}

export function TrustStrip() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="about"
      className="w-full bg-cream"
      data-node-id="61:54212"
      aria-labelledby="trust-strip-heading"
    >
      <div className="mx-auto flex w-full max-w-[1512px] flex-col items-start px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col items-center gap-[50px]">
          {/* Section header */}
          <div className="flex w-full flex-col items-center gap-1">
            <Eyebrow tone="dark">Why families stay</Eyebrow>
            <div className="flex w-full flex-col items-center justify-center gap-1 text-center">
              <StaggerLines
                as="h2"
                id="trust-strip-heading"
                lines={['Care you can lean on.']}
                className="w-full max-w-[650px] font-display text-[36px] text-ink lg:text-[60px] lg:leading-[72.7px]"
              />
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: reduceMotion ? 0.3 : 0.7, ease: EASE_OUT, delay: 0.15 }}
                className="w-full max-w-[400px] text-[16px] text-ink-soft"
              >
                Fast answers, gentle hands and honest costs, so you always know what happens next.
              </motion.p>
            </div>
          </div>

          {/* Cards */}
          <div className="flex w-full flex-col items-start p-2.5">
            <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
              {CARDS.map((card) => (
                <Card key={card.title} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
