import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { fadeInProps } from '../components/FadeIn'
import { StaggerLines } from '../components/StaggerLines'
import { StaggerText } from '../components/StaggerText'
import { EASE_OUT } from '../lib/motion'
import paw from '../assets/icon-paw.svg'
import service1 from '../assets/service-1.webp'
import service2 from '../assets/service-2.webp'
import service3 from '../assets/service-3.webp'
import service4 from '../assets/service-4.webp'

type Service = {
  title: string
  body: string
  image: string
  alt: string
}

const SERVICES: Service[] = [
  {
    title: 'Everyday care',
    body: 'Wellness exams, vaccinations, parasite control and microchipping. Routine visits that keep your pet healthy and keep small problems small.',
    image: service1,
    alt: 'Labrador sitting calmly beside an owner’s outstretched hand',
  },
  {
    title: 'Sick pet care',
    body: 'Same day appointments, diagnostics and treatment when something is wrong. We find the cause quickly and explain your options before we start.',
    image: service2,
    alt: 'Vet in navy scrubs carrying a ginger cat',
  },
  {
    title: 'Surgery and dental',
    body: 'Safe procedures with careful pain control and clear aftercare. We plan each operation around your pet and send them home with written instructions.',
    image: service3,
    alt: 'Small dog in a recovery collar resting on a blanket',
  },
  {
    title: 'Life stage care',
    body: 'Support from the first puppy or kitten vaccines to the senior years, and gentle end of life care when the time comes.',
    image: service4,
    alt: 'Two golden retrievers lying together on a rug',
  },
]

/**
 * One name in the list. The paw is parked out of flow at the left edge, so
 * only the label moves aside for it — animating the row's own width would
 * reflow the whole column on every hover.
 */
function ServiceName({
  service,
  isActive,
  onActivate,
}: {
  service: Service
  isActive: boolean
  onActivate: () => void
}) {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.45, ease: EASE_OUT }

  return (
    <li>
      <button
        type="button"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        aria-pressed={isActive}
        className="relative flex w-full cursor-pointer items-center py-0.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
      >
        <motion.img
          src={paw}
          alt=""
          aria-hidden
          className="absolute left-0 size-6 shrink-0"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.5 }}
          transition={transition}
        />
        <motion.span
          className="block font-grotesk text-[22px] leading-none whitespace-nowrap lg:text-[36px]"
          initial={false}
          animate={{ x: isActive ? 30 : 0, color: isActive ? '#f5f5f5' : '#878787' }}
          transition={transition}
        >
          {service.title}
        </motion.span>
      </button>
    </li>
  )
}

export function Services() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const current = SERVICES[active]

  return (
    <section id="services" className="w-full bg-cream" data-node-id="61:52715">
      <div className="mx-auto w-full max-w-[1920px] px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col gap-4 lg:h-[90dvh] lg:flex-row lg:gap-3">
          {/* The card. Headline, list and detail sit at the top, middle and
              bottom of its height, which is the design's three equal gaps. */}
          <motion.div
            {...fadeInProps}
            className="flex h-[578px] w-full flex-col justify-between gap-12 rounded-lg bg-navy p-4 lg:h-full lg:p-10 lg:flex-1"
          >
            <StaggerLines
              as="h2"
              lines={['Care for Every', 'Stage of Life']}
              className="w-full max-w-[400px] font-grotesk text-[36px] leading-[1.16] text-cream lg:text-[60px] lg:leading-[70px]"
            />

            <ul className="flex w-full flex-col gap-1 lg:w-[352px]">
              {SERVICES.map((service, index) => (
                <ServiceName
                  key={service.title}
                  service={service}
                  isActive={index === active}
                  onActivate={() => setActive(index)}
                />
              ))}
            </ul>

            {/* The detail is remounted on change, so it resolves line by line.
                All four sit stacked and unpainted underneath to reserve the
                height of the longest one: without that, a taller detail would
                squeeze the gaps above it and walk the list of names up the
                card every time the hover changed. */}
            <div className="relative w-full max-w-[350px] text-[18px] leading-normal text-[#f7f7f7]">
              <div aria-hidden className="invisible grid">
                {SERVICES.map((service) => (
                  <p key={service.title} className="col-start-1 row-start-1">
                    {service.body}
                  </p>
                ))}
              </div>
              <div className="absolute inset-0">
                <StaggerText
                  key={current.title}
                  text={current.body}
                  playOnMount
                  variant="blur"
                  stagger={0.07}
                />
              </div>
            </div>
          </motion.div>

          {/* The photographs, stacked. Only the active one is sharp. */}
          {/* First on a phone, where the frame leads with the photograph, and
              cut to the same height as the card under it. From lg it goes back
              beside the card and takes its height from the row. */}
          <motion.div
            {...fadeInProps}
            transition={{ ...fadeInProps.transition, delay: 0.12 }}
            className="relative order-first h-[578px] w-full overflow-hidden rounded-lg bg-navy/5 lg:order-none lg:aspect-auto lg:h-full lg:flex-1"
          >
            {SERVICES.map((service, index) => (
              <motion.img
                key={service.title}
                src={service.image}
                alt={index === active ? service.alt : ''}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
                initial={false}
                animate={{
                  opacity: index === active ? 1 : 0,
                  filter: index === active ? 'blur(0px)' : 'blur(16px)',
                  scale: index === active ? 1 : 1.06,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE_OUT }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
