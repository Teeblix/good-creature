import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { EASE_OUT } from '../lib/motion'
import { MenuIcon } from '../components/MenuIcon'
import { MobileMenu } from '../components/MobileMenu'
import logo from '../assets/logo-v2.webp'

/**
 * Menu item underline: a hairline that wipes in from the left on hover or
 * keyboard focus, in the same left-to-right language as the image wipes.
 */
const NAV_LINK =
  'relative inline-block whitespace-nowrap ' +
  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left ' +
  'after:scale-x-0 after:bg-current after:transition-transform after:duration-300 ' +
  'after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 ' +
  'focus-visible:after:scale-x-100 motion-reduce:after:transition-none'

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Plan a visit', href: '#plan-a-visit' },
  { label: 'About', href: '#about-us' },
  { label: 'FAQ', href: '#faq' },
]

export function NavigationBar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [filled, setFilled] = useState(false)
  const reduceMotion = useReducedMotion()

  // Read inside the scroll listener without re-subscribing it.
  const lastY = useRef(0)
  const thresholdRef = useRef(600)
  const openRef = useRef(false)
  openRef.current = open

  useEffect(() => {
    // Transparent for the whole of the hero. The fill arrives only once the
    // section after it has reached the top of the viewport.
    const hero = document.getElementById('top')
    const measure = () => {
      thresholdRef.current = hero ? hero.offsetHeight : 600
    }
    measure()

    // Scrolling down takes the bar away; scrolling back up brings it in. A few
    // pixels of slack keeps trackpad jitter from flickering it.
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      lastY.current = y
      setFilled(y > thresholdRef.current)
      if (openRef.current) return setHidden(false)
      if (delta > 4 && y > 120) setHidden(true)
      else if (delta < -4 || y <= 120) setHidden(false)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const observer = hero ? new ResizeObserver(measure) : null
    if (hero && observer) observer.observe(hero)
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  // The full-screen menu owns the viewport while it is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Escape closes the overlay, as expected of anything covering the page.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Over the photograph — and over the open navy menu — everything is white;
  // on the cream fill everything is ink.
  const onFill = filled && !open
  const textTone = onFill ? 'text-ink' : 'text-cream'
  const barTone = onFill ? 'bg-ink' : 'bg-cream'

  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.3 : 0.6, ease: EASE_OUT },
    },
  }

  return (
    <>
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300 ease-out ${
        onFill ? 'bg-cream' : 'bg-transparent'
      }`}
      data-node-id="99:9780"
      data-hidden={hidden}
      data-filled={onFill}
      initial={false}
      animate={{ y: hidden && !reduceMotion ? '-100%' : '0%' }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE_OUT }}
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1920px] flex-col items-start px-4 py-5 lg:px-20"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.1 } },
        }}
      >
        <div className="flex w-full items-center justify-between">
          {/* Logo lockup — the design flips the mark with a difference blend
              once it is sitting on the cream fill. */}
          <motion.a
            href="#top"
            variants={item}
            className="flex items-center gap-1"
            aria-label="Good Creature — home"
          >
            <img
              src={logo}
              alt=""
              className={`h-[46px] w-[44px] object-contain ${onFill ? 'mix-blend-difference' : ''}`}
            />
            <span
              className={`font-grotesk text-[18px] font-medium whitespace-nowrap transition-colors duration-300 ${textTone}`}
            >
              Good Creature
            </span>
          </motion.a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            <ul
              className={`flex items-center gap-6 text-right text-[18px] font-medium transition-colors duration-300 ${textTone}`}
            >
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={item}>
                  <a href={link.href} className={NAV_LINK}>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div variants={item}>
              <ArrowButton variant="primary" href="#contact">
                Contact Us
              </ArrowButton>
            </motion.div>
          </nav>

          {/* Mobile toggle — "Menu" label beside the mark, per the design */}
          <motion.button
            type="button"
            variants={item}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex items-center gap-1 lg:hidden"
          >
            <span
              className={`text-[18px] font-medium whitespace-nowrap transition-colors duration-300 ${textTone}`}
            >
              {open ? 'Close' : 'Menu'}
            </span>
            <MenuIcon open={open} tone={barTone} />
          </motion.button>
        </div>
      </motion.div>

    </motion.header>
    <MobileMenu open={open} onNavigate={() => setOpen(false)} />
    </>
  )
}
