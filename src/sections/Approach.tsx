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

/**
 * The veil over the figure.
 *
 * It belongs to the card's width, not to the page's layout. Once the card can
 * hold its full 623 the body stops at 440 and never reaches the figure, so
 * the drawing is left alone. Below that the card shrinks, the text runs under
 * it, and this is what keeps the words readable: the card's own fill, solid
 * where the text is and clear at the outer edge, so the figure still reads as
 * a figure rather than as something stamped on the paragraph.
 */
const VEIL = 'linear-gradient(270deg, rgba(248,241,222,0) 0%, rgb(248,241,222) 86%)'

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="relative flex w-full flex-col gap-[70px] overflow-hidden rounded-lg border border-line p-4">
      <h3 className="relative z-10 font-grotesk text-[22px] leading-none text-ink">
        {pillar.title}
      </h3>

      {/* Taller than the card and clipped by it, which is what keeps the
          figure bleeding off the top and bottom edges rather than sitting in
          the middle of a box of its own. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 h-[calc(100%+22px)] w-[143px] -translate-y-1/2"
      >
        <img src={pillar.figure} alt="" loading="lazy" className="size-full object-cover" />
        <span className="absolute inset-0 sm:hidden" style={{ background: VEIL }} />
      </span>

      <p className="relative z-10 max-w-[440px] text-[18px] leading-normal text-pretty text-ink-soft">
        {pillar.body}
      </p>
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
 * The row waits for xl rather than lg. The cards are a fixed 623 — the design
 * draws them that way and the figure inside is a fixed 143 — so at 1024 the
 * headline would be left with 201px, and 60px type in 201px is five lines
 * where the design has two. Below xl the two columns stack instead, and the
 * cards keep their width rather than stretching across the page.
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

          <ul className="flex w-full max-w-[623px] flex-col gap-4 xl:w-[623px] xl:max-w-none xl:shrink-0 xl:gap-5">
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
