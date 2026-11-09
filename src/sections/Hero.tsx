import { motion, useReducedMotion } from 'motion/react'
import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { StaggerLines } from '../components/StaggerLines'
import { EASE_OUT } from '../lib/motion'
import heroImage from '../assets/hero-desktop.webp'

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="top"
      className="relative flex min-h-[866px] w-full flex-col items-center justify-end overflow-hidden"
      data-node-id="61:52667"
    >
      {/* Background image — a subtle settle on load, plus the 25% scrim from the design */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.img
          src={heroImage}
          alt=""
          fetchPriority="high"
          initial={reduceMotion ? { opacity: 1 } : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0.3 : 1.6, ease: EASE_OUT }}
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1512px] flex-col items-start px-4 py-10 lg:px-20">
        <div className="flex w-full flex-col items-start justify-center gap-10 lg:flex-row lg:items-end lg:gap-10">
          {/* Headline block */}
          <div className="flex w-full flex-col items-start gap-1 lg:min-w-0 lg:flex-1">
            <Eyebrow tone="light" playOnMount>
              Gentle vet care
            </Eyebrow>

            <div className="flex w-full flex-col items-start gap-[11px] text-cream lg:gap-6">
              <StaggerLines
                as="h1"
                playOnMount
                delay={0.15}
                lines={['Braver visits.', 'Happier days ahead.']}
                className="w-full max-w-[850px] font-display text-[56px] leading-tight lg:text-[100px] lg:leading-[110px]"
              />
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0.3 : 0.8, ease: EASE_OUT, delay: 0.55 }}
                className="w-full max-w-[550px] text-[18px]"
              >
                Calm, skilled veterinary care for your pet, and clear answers for you. We take every
                visit one small step at a time, so nervous paws and worried owners feel at ease from
                the first hello.
              </motion.p>
            </div>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.3 : 0.8, ease: EASE_OUT, delay: 0.7 }}
            className="flex w-[196px] shrink-0 flex-col items-start gap-3"
          >
            <Button variant="light" href="#plan-a-visit" className="w-full">
              Plan your first visit
            </Button>
            <p className="w-full text-[14px] text-cream lg:text-right">
              Same day sick visits available. Call [000 000 0000].
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
