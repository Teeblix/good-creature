import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { RollingText } from '../components/RollingText'
import { StaggerLines } from '../components/StaggerLines'
import { WipeImage } from '../components/WipeImage'
import tickIcon from '../assets/icon-tick-square.svg'
import arrowIcon from '../assets/icon-arrow-right.svg'
import service1 from '../assets/service-1.webp'
import service2 from '../assets/service-2.webp'
import service3 from '../assets/service-3.webp'
import service4 from '../assets/service-4.webp'

type Service = {
  number: string
  title: string
  summary: string
  points: string[]
  cta: string
  image: string
  alt: string
}

const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Everyday care',
    summary:
      'Wellness exams, vaccinations, parasite prevention, microchipping, nutrition',
    points: [
      'Full nose to tail wellness exams',
      'Vaccinations tailored to your pet’s lifestyle',
      'Flea, tick and worm prevention',
      'Microchipping and nutrition advice',
    ],
    cta: 'Explore everyday care',
    image: service1,
    alt: 'Labrador sitting calmly beside an owner’s outstretched hand',
  },
  {
    number: '02',
    title: 'When they’re unwell',
    summary: 'Same day sick visits, diagnostics and lab, imaging, medication.',
    points: [
      'Same day sick visits, call early',
      'In house lab tests and imaging',
      'Clear diagnosis with your options explained',
      'Medication ready before you leave',
    ],
    cta: 'Explore sick pet care',
    image: service2,
    alt: 'Vet in navy scrubs carrying a ginger cat',
  },
  {
    number: '03',
    title: 'Surgery and dental',
    summary: 'Safe procedures, careful pain control and clear aftercare.',
    points: [
      'Spay, neuter and soft tissue surgery',
      'Dental cleaning and gum treatment',
      'Pre surgery checks for every patient',
      'Written aftercare and a follow up call',
    ],
    cta: 'Explore surgery and dental',
    image: service3,
    alt: 'Small dog in a recovery collar resting on a blanket',
  },
  {
    number: '04',
    title: 'Every life stage',
    summary: 'Puppy and kitten care, senior care, gentle end of life care.',
    points: [
      'Puppy and kitten starter plans',
      'Adult wellness and weight care',
      'Senior check ups and comfort care',
      'Gentle end of life support, with time and kindness',
    ],
    cta: 'Explore everyday care',
    image: service4,
    alt: 'Two golden retrievers lying together on a rug',
  },
]

function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="flex flex-col items-start justify-center gap-5 lg:flex-row lg:items-center">
      <div className="flex w-full flex-col items-start gap-6 lg:min-w-0 lg:flex-1 lg:gap-[50px]">
        <Reveal>
          <span className="flex size-[46px] items-center justify-center rounded-full bg-plum font-display text-[22px] text-cream">
            {service.number}
          </span>
        </Reveal>

        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-start gap-2">
            <StaggerLines
              as="h3"
              lines={[service.title]}
              className="w-full font-display text-[36px] text-ink"
            />
            <Reveal delay={0.1}>
              <p className="w-full text-[16px] text-ink-soft">{service.summary}</p>
            </Reveal>
          </div>

          <Reveal delay={0.18} className="w-full">
            <ul className="flex w-full flex-col items-start gap-2">
              {service.points.map((point) => (
                <li key={point} className="flex w-full items-center gap-1.5">
                  <img src={tickIcon} alt="" className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 text-[14px] text-ink-soft">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.26}>
          <a
            href="#services"
            className="group inline-flex items-center justify-center gap-2 rounded-full py-1 text-[18px] font-medium text-ink"
          >
            <RollingText>{service.cta}</RollingText>
            <img
              src={arrowIcon}
              alt=""
              className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </div>

      {/* Service imagery — wipes leftward on entrance */}
      <WipeImage
        src={service.image}
        alt={service.alt}
        direction="left"
        className="h-[450px] w-full shrink-0 lg:w-[340px]"
      />
    </div>
  )
}

export function Services() {
  return (
    <section
      id="services"
      className="flex w-full items-center bg-sand"
      data-node-id="61:52715"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-1 items-center px-4 py-15 lg:p-20">
        <div className="flex w-full flex-1 flex-col items-start gap-10 lg:flex-row">
          {/* Left column — pins 100px below the top while the cards scroll past */}
          <div className="flex w-full flex-col items-start justify-center gap-1 lg:sticky lg:top-[100px] lg:w-[617px] lg:shrink-0 lg:self-start">
            <Eyebrow tone="dark">Our services</Eyebrow>
            <div className="flex w-full flex-col items-start justify-center gap-1">
              <StaggerLines
                as="h2"
                id="services-heading"
                lines={['Care for Every', 'Stage of Their Life.']}
                className="w-full max-w-[650px] font-display text-[36px] text-ink lg:text-[60px] lg:leading-[72.7px]"
              />
              <Reveal delay={0.15}>
                <p className="w-full max-w-[400px] text-[16px] text-ink-soft">
                  From a first vaccine to a gentle goodbye, our four service groups make it easy to
                  find exactly what your pet needs.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Service cards */}
          <div className="flex w-full flex-col items-start gap-10 lg:min-w-0 lg:flex-1">
            {SERVICES.map((service) => (
              <ServiceRow key={service.number} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
