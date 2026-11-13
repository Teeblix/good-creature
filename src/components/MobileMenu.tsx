import { motion, useReducedMotion } from 'motion/react'
import { ArrowButton } from './ArrowButton'
import { useContactUs } from './FormPanel'
import { EASE_OUT } from '../lib/motion'

export const MOBILE_LINKS = [
  { label: 'Our Services', href: '#services' },
  { label: 'Plan a Visit', href: '#plan-a-visit' },
  { label: 'About Us', href: '#about-us' },
  { label: 'Quick Answers', href: '#faq' },
]

/**
 * Full-screen menu for mobile. The navigation bar stays on top of it with its
 * own logo and Close control, so this holds everything below that row.
 */
export function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const openContact = useContactUs()
  const reduceMotion = useReducedMotion()

  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0.3 : 0.5, ease: EASE_OUT } },
  }

  return (
    <motion.div
      id="mobile-nav"
      className="fixed inset-0 z-40 flex h-dvh flex-col overflow-y-auto bg-navy lg:hidden"
      initial={false}
      animate={open ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, pointerEvents: 'none' as const },
        visible: { opacity: 1, pointerEvents: 'auto' as const },
      }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT }}
      aria-hidden={!open}
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-between gap-20 px-4 pt-[106px] pb-5"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07, delayChildren: 0.12 } },
        }}
      >
        <div className="flex w-full flex-col items-start justify-center gap-5">
          <ul className="flex w-full flex-col items-start justify-center gap-4">
            {MOBILE_LINKS.map((link, index) => (
              <motion.li key={link.href} variants={item} className="flex w-full flex-col gap-4">
                <a
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  onClick={onNavigate}
                  className="text-[20px] font-medium whitespace-nowrap text-cream"
                >
                  {link.label}
                </a>
                {index < MOBILE_LINKS.length - 1 && <span className="h-px w-full bg-line" />}
              </motion.li>
            ))}
          </ul>

          <motion.div variants={item} className="w-full">
            <ArrowButton
              variant="light"
              onPress={openContact}
              tabIndex={open ? 0 : -1}
              className="w-full justify-between"
              onClick={onNavigate}
            >
              Contact us
            </ArrowButton>
          </motion.div>
        </div>

        <motion.div variants={item} className="flex w-[166px] flex-col items-start gap-10">
          <div className="flex w-full flex-col items-start gap-1.5">
            <p className="w-full text-[14px] text-[#949494]">Email Us</p>
            <a
              href="mailto:hello@goodcreature.vet"
              tabIndex={open ? 0 : -1}
              className="w-full text-[16px] text-cream"
            >
              hello@goodcreature.vet
            </a>
          </div>
          <div className="flex w-full flex-col items-start gap-1.5">
            <p className="w-full text-[14px] text-[#949494]">Social Media</p>
            <div className="flex w-full flex-col items-start gap-px text-[16px] text-cream">
              <a href="#" tabIndex={open ? 0 : -1} className="w-full">
                Instagram
              </a>
              <a href="#" tabIndex={open ? 0 : -1} className="w-full">
                Facebook
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
