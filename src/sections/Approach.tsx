import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import { WipeImage } from '../components/WipeImage'
import approachImage from '../assets/approach.webp'

type Pillar = { number: string; title: string; body: string }

// Note: the third badge reads "01" in the Figma file, not "03" — kept as designed.
const PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'Listen first',
    body: 'We hear your worries and your pet’s history before we touch anything.',
  },
  {
    number: '02',
    title: 'Plain words',
    body: 'No jargon, and every finding explained as we go.',
  },
  {
    number: '01',
    title: 'Your call',
    body: 'Every plan and every cost approved by you before we begin.',
  },
]

export function Approach() {
  return (
    <section
      id="approach"
      className="w-full bg-sand"
      data-node-id="61:53143"
      aria-labelledby="approach-heading"
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-start px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col items-start gap-10 lg:gap-20">
          <div className="flex w-full flex-col items-start gap-10 lg:gap-20">
            {/* Heading left, supporting copy right */}
            <div className="flex w-full flex-col items-start justify-between gap-6 lg:h-[180px] lg:flex-row lg:items-end lg:gap-10">
              <div className="flex w-full flex-col items-start justify-center gap-1 lg:min-w-0 lg:max-w-[650px] lg:flex-1">
                <Eyebrow tone="dark">Our approach</Eyebrow>
                <StaggerLines
                  as="h2"
                  id="approach-heading"
                  lines={['Kind people, brave', 'creatures.']}
                  className="w-full font-display text-[36px] text-ink lg:text-[60px] lg:leading-[72.7px]"
                />
              </div>
              <Reveal delay={0.15} className="w-full lg:min-w-0 lg:max-w-[550px] lg:flex-1">
                <p className="text-[16px] text-ink-soft">
                  We listen first, explain everything in plain words and move at your pet’s pace.
                  Nothing starts until you’ve approved the plan and the cost, and you can ask us to
                  pause or slow down at any point.
                </p>
              </Reveal>
            </div>

            {/* Three pillars */}
            <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-[136px]">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex w-full flex-col items-start gap-6 lg:w-[300px] lg:max-w-[300px] lg:shrink-0 lg:gap-[50px]"
                >
                  <Reveal>
                    <span className="flex size-[46px] items-center justify-center rounded-full bg-plum font-display text-[22px] text-cream">
                      {pillar.number}
                    </span>
                  </Reveal>
                  <div className="flex w-full flex-col items-start gap-2">
                    <StaggerLines
                      as="h3"
                      lines={[pillar.title]}
                      className="w-full font-display text-[36px] text-ink"
                    />
                    <Reveal delay={0.1}>
                      <p className="w-full text-[16px] text-ink-soft">{pillar.body}</p>
                    </Reveal>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration + call to action */}
          <div className="flex w-full flex-col items-center gap-5">
            <WipeImage
              src={approachImage}
              alt="Illustration of the Good Creature team with a dog and a cat in the clinic"
              direction="left"
              className="h-[220px] w-full lg:h-[550px]"
            />
            <Reveal delay={0.1}>
              <Button variant="light" href="#approach">
                Meet our team
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
