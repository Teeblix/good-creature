import { FadeIn } from '../components/FadeIn'
import { Reveal } from '../components/Reveal'
import { StaggerLines } from '../components/StaggerLines'
import instagramIcon from '../assets/icon-instagram.svg'
import facebookIcon from '../assets/icon-facebook.svg'
import whatsappIcon from '../assets/icon-whatsapp.svg'

type Link = { label: string; href?: string }

/** Same four destinations as the navigation bar, with Home ahead of them. */
const NAVIGATE: Link[] = [
  { label: 'Home', href: '#top' },
  { label: 'Our services', href: '#services' },
  { label: 'Plan a visit', href: '#plan-a-visit' },
  { label: 'About us', href: '#about-us' },
  { label: 'Quick answers', href: '#faq' },
]

const CONTACT: Link[] = [
  { label: '020 7946 0123', href: 'tel:02079460123' },
  { label: 'hello@goodcreature.vet', href: 'mailto:hello@goodcreature.vet' },
  // The address is not a link; there is nowhere agreed for it to go yet.
  { label: '24 Larkfield Lane, Ashbourne, DE6 1QT' },
]

/** Placeholder destinations — the real profiles are not in the design. */
const SOCIALS = [
  { name: 'Instagram', icon: instagramIcon, href: '#' },
  { name: 'Facebook', icon: facebookIcon, href: '#' },
  { name: 'WhatsApp', icon: whatsappIcon, href: '#' },
]

function Column({ title, links }: { title: string; links: Link[] }) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <h3 className="w-full text-[18px] leading-normal text-[#949494]">{title}</h3>
      <ul className="flex w-full flex-col items-start gap-1.5">
        {links.map((link) => (
          <li key={link.label} className="w-full">
            {link.href ? (
              <a
                href={link.href}
                className="text-[16px] leading-normal text-ink-soft transition-opacity duration-200 hover:opacity-60"
              >
                {link.label}
              </a>
            ) : (
              <span className="text-[16px] leading-normal text-ink-soft">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="relative z-10 w-full" data-node-id="61:53961">
      <div className="mx-auto w-full max-w-[1920px] px-4 pt-15 pb-5 lg:px-20 lg:pt-20">
        {/* Navigate sits with Contact rather than with the headline: the two
            columns butt together as one pair, held well off the headline by a
            gap of their own. That gap is paid for out of the long run before
            the social buttons, so the columns keep their width and the buttons
            do not move. The design leaves a long drop between the two rows — it is what
            gives the footer its air, so it is kept on desktop and traded for
            something walkable once the columns stack. */}
        <div className="flex w-full flex-col items-start gap-20 lg:gap-[300px]">
          <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-start lg:gap-[150px]">
            <div className="flex w-full flex-1 flex-col items-start gap-10 lg:flex-row lg:gap-[140px]">
              <StaggerLines
                as="h2"
                label="Small steps for a kinder visit"
                lines={['Small steps for a', 'kinder visit']}
                className="w-full shrink-0 lg:w-[403px] font-grotesk text-[28px] leading-[1.2] text-ink lg:text-[36px]"
              />

              <div className="flex w-full flex-1 flex-col items-start gap-10 sm:flex-row sm:gap-0">
                <Reveal delay={0.1} className="w-full flex-1">
                  <Column title="Navigate" links={NAVIGATE} />
                </Reveal>
                <Reveal delay={0.15} className="w-full flex-1">
                  <Column title="Contact" links={CONTACT} />
                </Reveal>
              </div>
            </div>

            <Reveal delay={0.2}>
              <ul className="flex items-center gap-3">
                {SOCIALS.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      aria-label={social.name}
                      className="flex items-center justify-center rounded-full bg-ember p-2 transition-opacity duration-200 hover:opacity-80"
                    >
                      <img src={social.icon} alt="" className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <FadeIn className="flex w-full items-start justify-between gap-6 text-[16px] leading-normal text-ink">
            <p>© 2026 Good Creature</p>
            <a
              href="#top"
              className="whitespace-nowrap transition-opacity duration-200 hover:opacity-60"
            >
              Back to top
            </a>
          </FadeIn>
        </div>
      </div>
    </footer>
  )
}
