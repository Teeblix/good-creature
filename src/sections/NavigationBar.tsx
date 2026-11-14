import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { EASE_OUT } from '../lib/motion'
import { MenuIcon } from '../components/MenuIcon'
import { MobileMenu } from '../components/MobileMenu'
import { useContactUs } from '../components/FormPanel'
import logo from '../assets/logo-mark.webp'

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

/** Sentence case, unlike the section headlines — only the first word is capitalised. */
export const NAV_LINKS = [
  { label: 'About us', href: '#about-us' },
  { label: 'Our services', href: '#services' },
  { label: 'Plan a visit', href: '#plan-a-visit' },
  { label: 'Quick answers', href: '#faq' },
]

export function NavigationBar() {
  const openContact = useContactUs()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  // The colour of whatever section is currently behind the bar, and whether
  // that section is a photograph rather than a flat fill.
  const [tint, setTint] = useState<string | null>(null)
  const [overImage, setOverImage] = useState(true)
  const reduceMotion = useReducedMotion()

  const headerRef = useRef<HTMLElement>(null)

  // Read inside the scroll listener without re-subscribing it.
  const lastY = useRef(0)
  const openRef = useRef(false)
  openRef.current = open

  useEffect(() => {
    // The colour you would actually see behind an element: its own fill, or
    // the first one an ancestor paints. A section that sets no background of
    // its own still sits on the page's, and that is the colour the bar wants —
    // not a hard-coded guess, which silently goes wrong the day the page
    // changes colour.
    const surfaceOf = (start: HTMLElement) => {
      let node: HTMLElement | null = start
      while (node) {
        const colour = getComputedStyle(node).backgroundColor
        if (colour !== 'rgba(0, 0, 0, 0)' && colour !== 'transparent') return colour
        node = node.parentElement
      }
      return null
    }

    // Read once: a section's fill is a class, and classes do not change under
    // us. The two that carry a photograph are marked, because what you see
    // there is the picture, not any colour underneath it.
    const panels = Array.from(document.querySelectorAll<HTMLElement>('main section, footer')).map(
      (el) => ({
        el,
        colour: surfaceOf(el),
        overImage: el.dataset.bar === 'over-image',
      }),
    )

    // Which section is behind the bar. Measured at the bar's own waist, so the
    // colour changes when a new section is half way across it rather than at
    // the moment it first appears underneath.
    const pickTint = () => {
      const waist = (headerRef.current?.offsetHeight ?? 89) / 2
      let panel: (typeof panels)[number] | undefined
      for (const candidate of panels) {
        const box = candidate.el.getBoundingClientRect()
        if (box.top <= waist && box.bottom > waist) panel = candidate
      }
      setTint(panel?.colour ?? null)
      setOverImage(panel?.overImage ?? false)
    }

    // Scrolling down takes the bar away; scrolling back up brings it in. A few
    // pixels of slack keeps trackpad jitter from flickering it.
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      lastY.current = y
      pickTint()
      if (openRef.current) return setHidden(false)
      if (delta > 4 && y > 120) setHidden(true)
      else if (delta < -4 || y <= 120) setHidden(false)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', pickTint)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', pickTint)
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

  // The bar takes the colour you would see behind the section it is over, so
  // it reads as part of that section rather than as a strip laid across it.
  // Clear only over the two photographs, and over the open navy menu.
  const barFill = open || overImage ? 'transparent' : (tint ?? 'transparent')

  // White type over the two photographs and over the open navy menu; ink
  // everywhere else, including the sections that paint nothing, since what
  // shows through them is the page's own light background.
  const onDark = open || overImage
  const textTone = onDark ? 'text-cream' : 'text-ink'
  // The logotype takes the mark's own navy wherever the background allows it,
  // so the lockup reads as one object rather than as a word set beside a
  // picture. Over the photographs and the open menu it goes cream with
  // everything else, because navy on those is unreadable.
  const wordTone = onDark ? 'text-cream' : 'text-navy'
  const barTone = onDark ? 'bg-cream' : 'bg-ink'

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
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300 ease-out"
      style={{ backgroundColor: barFill }}
      data-node-id="99:9780"
      data-hidden={hidden}
      data-over-image={overImage}
      data-tint={tint ?? 'none'}
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
          {/* Logo lockup. The mark carries its own colour now, so it stays as
              drawn in both bar states; only the wordmark changes tone. */}
          <motion.a
            href="#top"
            variants={item}
            className="flex items-center gap-1"
            aria-label="Good Creature — home"
          >
            {/* The mark keeps its own colours everywhere except over the open
                menu, where the design has it flat white. brightness-0 takes
                every pixel to black and invert takes it to white, so one file
                serves both states and the transparency is kept. */}
            <img
              src={logo}
              alt=""
              className={`h-[49px] w-[44px] object-contain transition-[filter] duration-300 ease-out ${
                open ? 'brightness-0 invert' : ''
              }`}
            />
            <span
              className={`font-grotesk text-[18px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 ${wordTone}`}
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
              <ArrowButton variant="primary" onPress={openContact}>
                Contact us
              </ArrowButton>
            </motion.div>
          </nav>

          {/* Mobile toggle. The icon says it on its own — the word beside it
              was telling people what they could already see. It keeps an
              accessible name, which is where that word belongs. */}
          <motion.button
            type="button"
            variants={item}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex items-center lg:hidden"
          >
            <MenuIcon open={open} tone={barTone} />
          </motion.button>
        </div>
      </motion.div>

    </motion.header>
    <MobileMenu open={open} onNavigate={() => setOpen(false)} />
    </>
  )
}
