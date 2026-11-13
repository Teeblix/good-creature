import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowButton } from '../components/ArrowButton'
import { useContactUs } from '../components/FormPanel'
import { FadeIn } from '../components/FadeIn'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import { EASE_OUT } from '../lib/motion'

type Item = { question: string; answer: string }
type Category = { title: string; items: Item[] }

const CATEGORIES: Category[] = [
  {
    title: 'Booking and first visits',
    items: [
      {
        question: 'How do I book a first visit?',
        answer:
          'Book online or call us, and walk in if you would rather — booking ahead is just quicker. We’ll ask a few questions about your pet so we can plan the visit around them.',
      },
      {
        question: 'Can I get a same day appointment if my pet is unwell?',
        answer:
          'Yes. We keep space for same day sick visits, so call early and we’ll see your pet as soon as we can.',
      },
      {
        question: 'What should I bring to our first visit?',
        answer:
          'Bring any previous records, a list of current medication and your pet in a carrier or on a lead.',
      },
    ],
  },
  {
    title: 'Costs and payment',
    items: [
      {
        question: 'Will I know the cost before treatment starts?',
        answer:
          'Yes. We explain the plan and the cost in plain words, and nothing begins until you approve it. Ask and we’ll write the estimate down. You pay after the visit, once we’ve confirmed the total with you.',
      },
      {
        question: 'Do you work with pet insurance?',
        answer:
          'Yes, we can provide the paperwork your insurer needs. Check your policy for what it covers.',
      },
    ],
  },
  {
    title: 'Nervous pets',
    items: [
      {
        question: 'Can you help if my pet is scared of the vet?',
        answer:
          'Yes. Tell us when you book. We use quiet rooms, slow handling and extra time so nervous pets can settle, and we keep cats and dogs apart.',
      },
      {
        question: 'Can I stay with my pet during the exam?',
        answer:
          'Yes, in most cases. We want you there, and we’ll explain each step as it happens.',
      },
    ],
  },
  {
    title: 'After your visit',
    items: [
      {
        question: 'What happens after treatment?',
        answer:
          'You leave with any medication, written aftercare and a date for the next visit. We call the next day to see how your pet is doing.',
      },
      {
        question: 'What if I have a question after we get home?',
        answer: 'Call or message us and a member of our team will help.',
      },
    ],
  },
]

/**
 * One question.
 *
 * A row on a ruled list rather than a card: no fill, no box, just the hairline
 * under it. The only marks of state are the answer and the icon, which is a
 * plus that turns forty-five degrees into a cross.
 */
function Question({
  item,
  isOpen,
  onToggle,
}: {
  item: Item
  isOpen: boolean
  onToggle: () => void
}) {
  const reduceMotion = useReducedMotion()
  const id = `faq-${item.question.replace(/\W+/g, '-').toLowerCase()}`
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT }

  return (
    <div className="w-full border-b border-line first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className="flex w-full cursor-pointer items-center gap-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        <span className="min-w-0 flex-1 font-grotesk text-[22px] leading-normal text-black">
          {item.question}
        </span>

        {/* One mark for both states: upright it reads as a plus, turned it
            reads as a cross, and the turn is the transition between them. */}
        <motion.svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-6 shrink-0 text-ink"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={transition}
        >
          <path
            d="M12 5.75v12.5M5.75 12h12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            key="answer"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden"
          >
            <p className="pb-4 text-[18px] leading-normal text-black">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * A group of questions under its own title.
 *
 * Each question opens and closes on its own — opening one leaves the rest as
 * they are, so two answers can be read side by side.
 */
function CategoryBlock({ category }: { category: Category }) {
  // The design shows the first question of every group already open.
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]))

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Reveal>
        {/* text black-100 in the file, the palest of the greys — the group
            titles sit back and let the questions lead. */}
        <h3 className="font-grotesk text-[24px] leading-normal text-[#b7b7b7] lg:text-[30px]">
          {category.title}
        </h3>
      </Reveal>
      <div className="flex w-full flex-col items-start">
        {category.items.map((item, index) => (
          <Question
            key={item.question}
            item={item}
            isOpen={open.has(index)}
            onToggle={() =>
              setOpen((current) => {
                const next = new Set(current)
                if (!next.delete(index)) next.add(index)
                return next
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

export function Faq() {
  const openContact = useContactUs()

  return (
    <section
      id="faq"
      className="flex w-full items-center"
      data-node-id="61:53520"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-1 items-start px-4 py-15 lg:p-20">
        <div className="flex w-full flex-1 flex-col items-start gap-10 lg:flex-row lg:gap-10">
          {/* Heading, and the way out for anything not answered here. It
              stays with you down the questions, parked clear of the navigation
              bar — which is 89px tall and comes back the moment you scroll up,
              so the heading would sit under it with any less. */}
          <div className="flex w-full flex-col items-start gap-10 lg:sticky lg:top-[99px] lg:min-w-0 lg:flex-1 lg:gap-[60px]">
            <StaggerLines
              as="h2"
              id="faq-heading"
              lines={['Questions We', 'Hear Most']}
              className="w-full max-w-[650px] font-grotesk text-[36px] leading-[1.17] text-ink lg:text-[60px] lg:leading-[70px]"
            />

            <div className="flex flex-col items-start gap-3">
              <Reveal delay={0.1}>
                <p className="text-[18px] leading-normal text-ink-soft">Still have questions?</p>
              </Reveal>
              <Reveal delay={0.2}>
                <ArrowButton variant="primary" onPress={openContact}>
                  Contact us
                </ArrowButton>
              </Reveal>
            </div>
          </div>

          {/* The questions themselves, grouped */}
          <div className="flex w-full flex-col items-start gap-[30px] lg:min-w-0 lg:flex-1 lg:px-[7px] lg:py-[15px]">
            {CATEGORIES.map((category) => (
              <FadeIn key={category.title} className="w-full">
                <CategoryBlock category={category} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
