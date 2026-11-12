import { SmoothScroll } from './components/SmoothScroll'
import { NavigationBar } from './sections/NavigationBar'
import { Hero } from './sections/Hero'
import { TrustStrip } from './sections/TrustStrip'
import { Services } from './sections/Services'
import { Journey } from './sections/Journey'
import { Approach } from './sections/Approach'
import { Testimonials } from './sections/Testimonials'
import { Faq } from './sections/Faq'
import { Cta } from './sections/Cta'
import { Footer } from './sections/Footer'

function App() {
  return (
    <>
      <SmoothScroll />
      <NavigationBar />
      <main>
        <Hero />
        {/* Everything after the hero shares one opaque layer, so it slides up
            over the pinned hero instead of scrolling alongside it. */}
        <div className="relative z-10">
          <TrustStrip />
          {/* The About section is out of the page while it is being redesigned.
              src/sections/About.tsx still holds the scroll-driven statement —
              drop <About /> back in here once the new frames land. */}
          <Services />
          <Journey />
          <Approach />
          <Testimonials />
          <Faq />
          <Cta />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App
