import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { StaggerLines } from '../components/StaggerLines'
import { WipeImage } from '../components/WipeImage'
import { Reveal } from '../components/Reveal'
import aboutImage from '../assets/about.webp'

export function About() {
  return (
    <section id="about-us" className="w-full bg-cream" data-node-id="61:52682">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-start px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col items-center justify-center gap-[50px] lg:flex-row">
          {/* Image — wipes in from the left edge rightward */}
          <div className="w-full p-2.5 lg:min-w-0 lg:flex-1">
            <WipeImage
              src={aboutImage}
              alt="Two vets in navy scrubs greeting a golden retriever in the clinic"
              direction="right"
              className="h-[845px] w-full"
            />
          </div>

          {/* Copy */}
          <div className="flex w-full flex-col items-start gap-6 lg:min-w-0 lg:flex-1">
            <div className="flex w-full flex-col items-start gap-1">
              <Eyebrow tone="dark">About us</Eyebrow>
              <div className="flex w-full flex-col items-start justify-center gap-3">
                <StaggerLines
                  as="h2"
                  lines={['A small practice with a big', 'soft spot for animals.']}
                  className="w-full max-w-[650px] font-display text-[36px] text-ink lg:text-[60px] lg:leading-[72.7px]"
                />
                <Reveal delay={0.15}>
                  <p className="w-full max-w-[550px] text-[16px] text-ink-soft">
                    Good Creature began with one simple idea: a vet visit should feel like a kind
                    step forward, not a stressful one. We’re a team of vets, nurses and animal
                    lovers who take the time to listen, explain things plainly and treat every pet
                    like family. Everything we do is built around calm, honest care.
                  </p>
                </Reveal>
              </div>
            </div>
            <Reveal delay={0.25}>
              <Button href="#about-us">More about us</Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
