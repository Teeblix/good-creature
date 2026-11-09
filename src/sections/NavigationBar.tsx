import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import logo from '../assets/logo.webp'
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
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function NavigationBar() {
  const [open, setOpen] = useState(false)

  // Escape closes the overlay, as expected of anything covering the page.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="relative z-50 w-full bg-cream" data-node-id="61:52665">
      <div className="mx-auto flex w-full max-w-[1512px] flex-col items-start px-4 py-5 lg:px-20">
        {/* Logo + (desktop) links + (mobile) menu toggle */}
        <div className="flex w-full items-center justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label="Good Creature — home">
            <img src={logo} alt="Good Creature" className="h-[46px] w-[41px] object-contain" />
          </a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            <ul className="flex items-center gap-6 text-right text-[18px] font-medium text-ink">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={NAV_LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button href="#plan-a-visit">Book a visit</Button>
          </nav>

          {/* Mobile menu toggle — hamburger turns into a close mark */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative block size-6 lg:hidden"
          >
            <img
              src={menuIcon}
              alt=""
              className={`${ICON} ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
            />
            {/* The vuesax "add" glyph turned 45° — a bare cross matching the
                hamburger's weight; the icon set has no plain X. */}
            <img
              src={closeIcon}
              alt=""
              className={`${ICON} ${open ? 'rotate-45 opacity-100' : 'rotate-0 opacity-0'}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile navigation panel. Absolutely placed, so it lies over the hero
          instead of pushing it down; grid-rows 0fr/1fr collapses it without
          needing a measured pixel height. */}
      <div
        id="mobile-nav"
        className={`absolute inset-x-0 top-full grid bg-cream transition-[grid-template-rows,opacity] duration-400 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <nav className="overflow-hidden" aria-hidden={!open}>
          <div className="mx-auto w-full max-w-[1512px] px-4 pt-1 pb-5">
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
              <Button
                href="#plan-a-visit"
                tabIndex={open ? 0 : -1}
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Book a visit
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
