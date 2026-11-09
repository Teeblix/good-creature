import { useState } from 'react'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import addIcon from '../assets/icon-add-circle.svg'
import closeIcon from '../assets/icon-close-circle.svg'

const QUESTIONS = [
  {
    question: 'Do you accept new clients?',
    answer: 'Yes. Book online or call us.',
  },
  {
    question: 'Can I get a same day appointment?',
    answer: 'Usually, for unwell pets. Call early and we’ll find you a slot.',
  },
  {
    question: 'What if my pet is very nervous?',
    answer:
      'Tell us when you book. We’ll plan a quiet arrival, skip the waiting room and let them set the pace.',
  },
  {
    question: 'Will I know the cost first?',
    answer:
      'Always. We write the plan and the cost down, and nothing starts until you’ve approved it.',
  },
  {
    question: 'What about emergencies after hours?',
    // Operational detail — confirm the real out-of-hours arrangement before launch.
    answer:
      'Call the practice and our out of hours message will point you straight to the nearest emergency hospital.',
  },
]

export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section
      id="faq"
      className="flex w-full items-center bg-sand"
      data-node-id="61:53520"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto flex w-full max-w-[1512px] flex-1 items-center px-4 py-15 lg:p-20">
        <div className="flex w-full flex-1 flex-col items-start gap-10 lg:flex-row">
          {/* Heading */}
          <div className="flex w-full flex-col items-start justify-center gap-1 lg:min-w-0 lg:flex-1">
            <Eyebrow tone="dark">Before you book</Eyebrow>
            <div className="flex w-full flex-col items-start justify-center gap-1">
              <StaggerLines
                as="h2"
                id="faq-heading"
                lines={['Good questions,', 'straight answers.']}
                className="w-full max-w-[650px] font-display text-[36px] text-ink lg:text-[60px] lg:leading-[72.7px]"
              />
              <Reveal delay={0.15}>
                <p className="w-full max-w-[400px] text-[16px] text-ink-soft">
                  The things new clients ask us most, answered in a line or two. Feel free to reach
                  out.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex w-full flex-col items-start px-[7px] py-[15px] lg:min-w-0 lg:flex-1">
            <div className="flex w-full flex-col items-start">
              {QUESTIONS.map((item, index) => {
                const isOpen = open === index
                return (
                  <div
                    key={item.question}
                    className={`flex w-full flex-col items-start border-b border-line ${
                      index === 0 ? 'pb-3' : 'py-3'
                    }`}
                  >
                    <h3 className="w-full">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? -1 : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${index}`}
                        className="flex w-full cursor-pointer items-center gap-5 text-left"
                      >
                        <span className="min-w-0 flex-1 font-display text-[22px] text-black">
                          {item.question}
                        </span>
                        <img
                          src={isOpen ? closeIcon : addIcon}
                          alt=""
                          className="size-6 shrink-0"
                        />
                      </button>
                    </h3>
                    <div
                      id={`faq-answer-${index}`}
                      className={`grid w-full transition-[grid-template-rows,opacity] duration-400 ease-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="w-full pt-4 text-[16px] text-black">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
