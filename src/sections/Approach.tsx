import { FadeIn } from '../components/FadeIn'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import listenFigure from '../assets/approach-listen.webp'
import plainFigure from '../assets/approach-plain.webp'
import yourCallFigure from '../assets/approach-your-call.webp'
import followFigure from '../assets/approach-follow.webp'

type Pillar = {
  title: string
  body: string
  figure: string
  alt: string
}

const PILLARS: Pillar[] = [
  {
    title: 'Listen first',
    body: 'We take in your concerns and your pet’s history before any exam. You know your pet best, so we start with what you have noticed.',
    figure: listenFigure,
    alt: 'Illustrated figure leaning in with a hand cupped to one ear',
  },
  {
    title: 'Plain words',
    body: 'No jargon. We explain every finding as we go and answer questions until you are comfortable with what happens next.',
    figure: plainFigure,
    alt: 'Illustrated figure speaking with an open, explaining hand',
  },
  {
    title: 'Your call',
    body: 'You approve each plan and cost before anything begins. If you want time to think or a second opinion, we support that.',
    figure: yourCallFigure,
    alt: 'Illustrated figure giving a thumbs up',
  },
  {
    title: 'Follow through',
    body: 'You leave with written aftercare and a date for the next visit. We call the next day to check how your pet is doing.',
    figure: followFigure,
    alt: 'Illustrated figure holding a phone to one ear and waving',
  },
]

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="flex w-full items-start gap-5 overflow-hidden rounded-lg border border-line">
      <div className="flex min-w-0 flex-1 flex-col gap-[70px] p-4">
        <h3 className="font-grotesk text-[22px] leading-none text-ink">{pillar.title}</h3>
        <p className="text-[18px] leading-normal text-pretty text-ink-soft">{pillar.body}</p>
      </div>

      {/* In the layout rather than over it, and stretched to whatever height
          the words opposite it come to. That is the whole point of the change:
          a figure given a height of its own was being cut off by the card,
          and this one is never taller than the box it sits in.

          Gone on a phone. At 358 the card cannot give 143 to a picture and
          still leave a readable column beside it. */}
      <div
        aria-hidden
        className="hidden w-[143px] shrink-0 self-stretch overflow-hidden rounded-r-[7px] sm:block"
      >
        <img src={pillar.figure} alt="" loading="lazy" className="size-full object-cover" />
      </div>
    </article>
  )
}

/**
 * Our approach to every visit.
 *
 * The headline stays put while the four cards go by: the left column is
 * sticky, so the claim is still on screen while the proof for it scrolls
 * past.
 *
 * Both columns fill the row and share it equally. The row still waits for
 * xl: at 1024 an even split leaves the headline 412px, and 60px type wants
 * more than that to hold the design's two lines.
 *
 * The 99px offset is the FAQ's — the navigation bar's height with 10px of air
 * above the column, the gap the two sticky sections share.
 */
export function Approach() {
  return (
    <section
      id="approach"
      className="w-full bg-sand"
      data-node-id="61:53143"
      aria-labelledby="approach-heading"
    >
      <div className="mx-auto w-full max-w-[1920px] px-4 py-15 lg:p-20">
        <div className="flex w-full flex-col items-start gap-10 xl:flex-row xl:gap-10">
          <div className="flex w-full flex-col items-start gap-3 xl:sticky xl:top-[99px] xl:min-w-0 xl:flex-1">
            <StaggerLines
              as="h2"
              id="approach-heading"
              lines={['Our Approach to', 'Every Visit']}
              className="w-full max-w-[550px] font-grotesk text-[36px] leading-[1.17] text-ink lg:text-[60px] lg:leading-[70px]"
            />
            <Reveal delay={0.15}>
              <p className="max-w-[350px] text-[18px] leading-normal text-pretty text-ink-soft">
                We listen first, explain in plain words and move at your pet’s pace. Nothing starts
                until you approve the plan and the cost.
              </p>
            </Reveal>
          </div>

          <ul className="flex w-full flex-col gap-4 xl:min-w-0 xl:flex-1 xl:gap-5">
            {PILLARS.map((pillar, index) => (
              <li key={pillar.title} className="w-full">
                <FadeIn delay={index * 0.06} className="w-full">
                  <PillarCard pillar={pillar} />
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
