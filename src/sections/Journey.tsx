import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import { WipeImage } from '../components/WipeImage'
import journey1 from '../assets/journey-1.webp'
import journey2 from '../assets/journey-2.webp'

type Step = {
  badge: string
  title: string
  body: string
  /** Cell the card occupies in the desktop staircase — card n sits at row n, column n. */
  cell: string
}

const STEPS: Step[] = [
  {
    badge: 'Step 01',
    title: 'Before you arrive',
    body: 'We send a short reminder with what to bring and a few tips for getting your pet into the carrier calmly. Tell us how they usually react to new places, and we’ll plan the visit around it.',
    cell: 'lg:col-start-1 lg:row-start-1',
  },
  {
    badge: 'Step 02',
    title: 'A quiet welcome',
    body: 'You skip the crowded waiting room. Our team greets you at the door and takes you to a calm space, with separate areas for cats and dogs and a treat ready on arrival.',
    cell: 'lg:col-start-2 lg:row-start-2',
  },
  {
    badge: 'Step 03',
    title: 'A gentle exam',
    body: 'Our vets let your pet set the pace and talk you through every step as it happens. Afterwards you get a clear plan in plain language, with costs written down before anything starts.',
    cell: 'lg:col-start-3 lg:row-start-3',
  },
  {
    badge: 'Step 04',
    title: 'The ride home',
    body: 'You leave with medication ready, written aftercare and a date for the next visit. We call the next day to check how your pet is feeling, and you can message us anytime if something worries you.',
    cell: 'lg:col-start-4 lg:row-start-4',
  },
]

export function Journey() {
  return (
    <section
      id="plan-a-visit"
      className="w-full bg-cream"
      data-node-id="61:53145"
      aria-labelledby="journey-heading"
    >
      <div className="mx-auto flex w-full max-w-[1512px] flex-col items-start px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col items-center gap-[50px]">
          {/* Section header */}
          <div className="flex w-full flex-col items-center gap-1">
            <Eyebrow tone="dark">How a visit works</Eyebrow>
            <div className="flex w-full flex-col items-center justify-center gap-1 text-center">
              <StaggerLines
                as="h2"
                id="journey-heading"
                lines={['One small step at a time.']}
                className="w-full max-w-[650px] font-display text-[36px] text-ink lg:text-[60px] lg:leading-[72.7px]"
              />
              <Reveal delay={0.15}>
                <p className="w-full max-w-[400px] text-[16px] text-ink-soft">
                  A vet visit doesn’t have to feel big. We guide you and your pet through four calm
                  steps, from packing the carrier to the ride home.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Staircase of step cards. Each card sits one column further right than
              the last, and the two illustrations fill the gaps left behind. */}
          <div className="relative mx-auto w-full max-w-[1352px]">
            <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-4 lg:grid-rows-4">
              {STEPS.map((step) => (
                <Reveal
                  key={step.badge}
                  className={`flex h-[268px] max-w-full flex-col items-start justify-between border border-line p-3 lg:max-w-[350px] ${step.cell}`}
                >
                  <span className="inline-flex items-center justify-center bg-powder px-2 py-0.5 text-[14px] text-black">
                    {step.badge}
                  </span>
                  <div className="flex w-full flex-col items-start gap-2 text-black">
                    <StaggerLines
                      as="h3"
                      lines={[step.title]}
                      className="w-full font-display text-[36px]"
                    />
                    <p className="w-full text-[16px]">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Illustrations — desktop only, exactly where they sit in the design */}
            <WipeImage
              src={journey1}
              alt="Illustrated cat peeking out of a carrier in a sunlit hallway"
              direction="left"
              className="absolute top-[3px] left-[70.41%] hidden h-[300px] w-[29.59%] lg:block"
            />
            <WipeImage
              src={journey2}
              alt="Illustrated dog trotting home through an open doorway"
              direction="right"
              className="absolute top-[802px] left-0 hidden h-[300px] w-[29.59%] lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
