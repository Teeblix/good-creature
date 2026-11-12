import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Site-wide smooth scrolling. Lenis eases the real window scroll, so everything
 * that reads `window.scrollY` — the hero's drift, the navigation bar, every
 * scroll-linked transform — keeps working untouched.
 *
 * Nothing is rendered; the component exists so App can mount the effect once.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Anyone who asks for reduced motion keeps the browser's own scrolling.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      // Long enough to feel eased, short enough that the page still answers at once.
      duration: 1.05,
      smoothWheel: true,
      // Touch keeps native momentum — smoothing it fights the platform.
      syncTouch: false,
      // Lenis takes over in-page anchor jumps so they ease like everything else.
      anchors: true,
      autoRaf: true,
    })

    return () => lenis.destroy()
  }, [])

  return null
}
