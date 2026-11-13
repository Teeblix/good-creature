import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import { EASE_OUT, VIEWPORT } from '../lib/motion'
import ctaImage from '../assets/cta.webp'

export function Cta() {
  const reduceMotion = useReducedMotion()

  // The photograph travels against its own frame as the section crosses the
  // screen, the way the hero lags the page. It is cut taller than the section
  // and sits over the edges, so the travel never uncovers a corner.
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section
      id="plan-your-visit"
      ref={sectionRef}
      className="relative flex min-h-dvh w-full items-center overflow-hidden"
      data-node-id="61:53897"
      aria-labelledby="cta-heading"
    >
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: parallaxY }}
        className="pointer-events-none absolute inset-x-0 -inset-y-[12%]"
      >
        <motion.img
          src={ctaImage}
          alt=""
          initial={reduceMotion ? { opacity: 1 } : { scale: 1.06, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: reduceMotion ? 0.3 : 1.4, ease: EASE_OUT }}
          className="size-full max-w-none object-cover"
        />
      </motion.div>

      {/* The photograph is dark where the words sit, but only at the width it
          was shot for. Narrower than that the crop walks the lit doorway in
          under the type, so a scrim holds the left side down. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(90deg, rgba(40,26,20,0.82) 0%, rgba(40,26,20,0.6) 45%, rgba(40,26,20,0.15) 100%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1920px] px-4 py-15 lg:p-20">
        <div className="flex w-full max-w-[700px] flex-col items-start gap-[30px]">
          <div className="flex w-full flex-col items-start gap-3">
            <StaggerLines
              as="h2"
              id="cta-heading"
              lines={['Your Pet’s Next Visit', 'Starts at Our Door']}
              className="w-full font-grotesk text-[36px] leading-[1.14] text-cream sm:text-[52px] lg:text-[80px] lg:leading-[1.08]"
            />
            <Reveal delay={0.15}>
              <p className="w-full max-w-[450px] text-[16px] leading-normal text-[#f7f7f7]">
                Book online or call us and we’ll find a time that suits you and your pet. We accept
                new clients every week.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.25}>
            <ArrowButton variant="light" href="#plan-a-visit">
              Book a visit
            </ArrowButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
