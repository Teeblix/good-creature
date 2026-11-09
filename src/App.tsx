import { NavigationBar } from './sections/NavigationBar'
import { Hero } from './sections/Hero'
import { TrustStrip } from './sections/TrustStrip'
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
      <NavigationBar />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <Journey />
        <Approach />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}

export default App
