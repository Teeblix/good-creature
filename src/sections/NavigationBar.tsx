import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { EASE_OUT } from '../lib/motion'
import logo from '../assets/logo-v2.webp'
import menuIcon from '../assets/icon-menu.svg'
import closeIcon from '../assets/icon-close.svg'

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

const ICON =
  'absolute inset-0 size-6 transition-all duration-300 ease-out motion-reduce:transition-none'

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
    // The bar is transparent while it sits over the hero photograph and takes
    // a cream fill once it has travelled past it.
    const hero = document.getElementById('top')
    const measure = () => {
      thresholdRef.current = hero ? Math.max(0, hero.offsetHeight - 86) : 600
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

  // Escape closes the overlay, as expected of anything covering the page.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Over the photograph everything is white; on the cream fill everything is ink.
  const onFill = filled && !open
  const textTone = onFill ? 'text-ink' : 'text-cream'
  const iconTone = onFill ? '' : 'brightness-0 invert'

  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.3 : 0.6, ease: EASE_OUT },
    },
  }

  return (
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
            <span className="relative block size-6">
              <img
                src={menuIcon}
                alt=""
                className={`${ICON} ${iconTone} ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
              />
              <img
                src={closeIcon}
                alt=""
                className={`${ICON} ${iconTone} ${open ? 'rotate-45 opacity-100' : 'rotate-0 opacity-0'}`}
              />
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile navigation panel. Absolutely placed, so it lies over the page
          instead of pushing it down; grid-rows 0fr/1fr collapses it without
          needing a measured pixel height. */}
      <div
        id="mobile-nav"
        className={`absolute inset-x-0 top-full grid bg-cream transition-[grid-template-rows,opacity] duration-400 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <nav className="overflow-hidden" aria-hidden={!open}>
          <div className="mx-auto w-full max-w-[1920px] px-4 pt-1 pb-5">
            <div className="flex w-full flex-col items-start justify-center gap-10">
              <ul className="flex w-full flex-col items-start justify-center gap-6 text-[18px] font-medium text-ink">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      tabIndex={open ? 0 : -1}
                      onClick={() => setOpen(false)}
                      className={NAV_LINK}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ArrowButton
                variant="primary"
                href="#contact"
                tabIndex={open ? 0 : -1}
                className="w-full justify-between"
                onClick={() => setOpen(false)}
              >
                Contact Us
              </ArrowButton>
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
