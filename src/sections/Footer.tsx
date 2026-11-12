import type { ReactNode } from 'react'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import chevron from '../assets/icon-chevron-right.svg'

type Column = {
  title: string
  width: string
  items: { label: ReactNode; href?: string }[]
}

const COLUMNS: Column[] = [
  {
    title: 'Explore',
    width: 'lg:w-[120px]',
    items: [
      { label: 'Services', href: '#services' },
      { label: 'Plan a visit', href: '#plan-a-visit' },
      { label: 'About', href: '#about-us' },
      { label: 'Contact', href: '#plan-your-visit' },
    ],
  },
  {
    title: 'Services',
    width: 'lg:w-[182px]',
    items: [
      { label: 'Everyday care', href: '#services' },
      { label: 'When they’re unwell', href: '#services' },
      { label: 'Surgery and dental', href: '#services' },
      { label: 'Every life stage', href: '#services' },
    ],
  },
  {
    title: 'Contact us',
    width: 'lg:w-[227px]',
    items: [
      { label: 'Call: 020 7946 0123', href: 'tel:02079460123' },
      {
        label: (
          <>
            Email:{' '}
            <a href="mailto:hello@goodcreature.vet" className="underline">
              hello@goodcreature.vet
            </a>
          </>
        ),
      },
      { label: 'Good Creature Veterinary Practice. 24 Larkfield Lane.' },
    ],
  },
  {
    title: 'Opening hours',
    width: 'lg:w-[227px]',
    items: [
      {
        label: (
          <>
            Monday to Friday:
            <br />
            8:00am to 7:00pm
          </>
        ),
      },
      {
        label: (
          <>
            Saturday:
            <br />
            9:00am to 4:00pm
          </>
        ),
      },
      { label: 'Sunday: Closed' },
    ],
  },
  {
    title: 'Social',
    width: 'lg:w-[227px]',
    items: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'Tiktok', href: '#' },
      { label: 'Pinterest', href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 flex w-full items-center bg-sand"
      data-node-id="61:53961"
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-1 items-center px-4 py-15 lg:p-20">
        <div className="flex w-full flex-1 flex-col items-start gap-10">
          <div className="flex w-full flex-col items-start gap-5">
            <StaggerLines
              as="h2"
              lines={['Small steps. A kinder visit.']}
              className="w-full font-display text-[36px] text-black lg:text-[60px] lg:leading-[72.7px]"
            />

            <div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row lg:items-start lg:gap-6">
              {COLUMNS.map((column) => (
                <Reveal key={column.title} className={`flex w-full flex-col gap-4 ${column.width}`}>
                  <h3 className="w-full font-display text-[22px] text-ink">{column.title}</h3>
                  <ul className="flex w-full flex-col items-start gap-1.5">
                    {column.items.map((item, index) => (
                      <li key={index} className="flex w-full items-center gap-1">
                        <img src={chevron} alt="" className="size-[18px] shrink-0" />
                        {item.href ? (
                          <a
                            href={item.href}
                            className="min-w-0 flex-1 text-[16px] text-ink-soft transition-opacity duration-200 hover:opacity-70"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span className="min-w-0 flex-1 text-[16px] text-ink-soft">
                            {item.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Oversized wordmark — scales with the container, capped so it spans
              the 1920px max width without overflowing */}
          <p className="w-full font-display text-[36px] text-ink lg:text-[min(9.85vw,194px)]">
            © 2026 Good Creature
          </p>
        </div>
      </div>
    </footer>
  )
}
