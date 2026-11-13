import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { useBookVisit } from '../components/FormPanel'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import { EASE_OUT, VIEWPORT } from '../lib/motion'
import ctaDesktop from '../assets/cta.webp'
import ctaMobile from '../assets/cta-mobile.webp'

export function Cta() {
  const reduceMotion = useReducedMotion()
  const openBooking = useBookVisit()

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
      className="relative flex min-h-lvh w-full items-start overflow-hidden lg:items-center"
      // Deliberately not marked over-image, unlike the hero. The hero is
      // transparent because the bar is sitting at the top of the page and has
      // not arrived yet; here it has — it is flying back in over a section
      // you have already scrolled past, and a bar with no fill over a
      // photograph reads as a bar that failed to draw.
      data-node-id="61:53897"
      aria-labelledby="cta-heading"
    >
      {/* Sized in lvh, not dvh. A phone's address bar collapses the moment
          you start scrolling, and with dvh the section would shrink with it —
          taking the picture's frame down by about 67px and its offset by 4,
          in one frame, every time. lvh is the viewport with the bar already
          out of the way: a fixed number, so the frame the picture travels in
          never changes size under it. */}
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: parallaxY }}
        className="pointer-events-none absolute inset-x-0 -inset-y-[12%]"
      >
        <motion.picture
          initial={reduceMotion ? { opacity: 1 } : { scale: 1.06, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: reduceMotion ? 0.3 : 1.4, ease: EASE_OUT }}
          className="block size-full"
        >
          <source media="(min-width: 1024px)" srcSet={ctaDesktop} />
          <img src={ctaMobile} alt="" className="size-full max-w-none object-cover" />
        </motion.picture>
      </motion.div>

      <div className="relative mx-auto w-full max-w-[1920px] px-4 py-20 lg:p-20">
        <div className="flex w-full max-w-[700px] flex-col items-start gap-[30px]">
          <div className="flex w-full flex-col items-start gap-3">
            <StaggerLines
              as="h2"
              id="cta-heading"
              lines={['Your Pet’s Next Visit', 'Starts at Our Door']}
              className="w-full font-grotesk text-[38px] leading-[1.14] text-cream sm:text-[52px] lg:text-[80px] lg:leading-[1.08]"
            />
            <Reveal delay={0.15}>
              <p className="w-full max-w-[450px] text-[18px] leading-normal text-[#f7f7f7]">
                Book online or call us and we’ll find a time that suits you and your pet. We accept
                new clients every week.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.25}>
            <ArrowButton variant="light" onPress={openBooking}>
              Book a visit
            </ArrowButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
