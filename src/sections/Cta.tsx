import { motion, useReducedMotion } from 'motion/react'
import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { RollingText } from '../components/RollingText'
import { StaggerLines } from '../components/StaggerLines'
import { EASE_OUT, VIEWPORT } from '../lib/motion'
import ctaImage from '../assets/cta.webp'

export function Cta() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="plan-your-visit"
      className="relative flex min-h-[864px] w-full flex-col items-center justify-center overflow-hidden"
      data-node-id="61:53897"
      aria-labelledby="cta-heading"
    >
      <motion.img
        src={ctaImage}
        alt=""
        aria-hidden
        initial={reduceMotion ? { opacity: 1 } : { scale: 1.06, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: reduceMotion ? 0.3 : 1.4, ease: EASE_OUT }}
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
      />

      <div className="relative mx-auto flex w-full max-w-[1512px] flex-col items-center justify-center gap-6 px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col items-center gap-1">
          <Eyebrow tone="dark">Let’s get started</Eyebrow>
          <div className="flex w-full flex-col items-center justify-center gap-1 text-center">
            <StaggerLines
              as="h2"
              id="cta-heading"
              lines={['Ready when you are.']}
              className="w-full max-w-[650px] font-display text-[36px] text-ink lg:text-[60px] lg:leading-[72.7px]"
            />
            <Reveal delay={0.15}>
              <p className="w-full max-w-[400px] text-[16px] text-ink-soft">
                Book online or call us and we’ll take it from there, one small step at a time.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.25}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="#plan-a-visit">Book a visit</Button>
            <a
              href="tel:+112345678 9"
              className="group inline-flex items-center justify-center gap-2 rounded-full py-1 text-[18px] font-medium text-ink"
            >
              <RollingText>Call +1 1234 5678 9</RollingText>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
