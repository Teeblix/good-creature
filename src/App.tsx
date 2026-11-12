import { SmoothScroll } from './components/SmoothScroll'
import { NavigationBar } from './sections/NavigationBar'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
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
          {/* The "Why families stay" strip is out of the page while it is being
              redesigned. src/sections/TrustStrip.tsx is untouched — drop
              <TrustStrip /> back in here once the new frames land. */}
          <About />
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
