import type { ComponentPropsWithoutRef } from 'react'
import { RollingText } from './RollingText'
import arrowLight from '../assets/icon-arrow-up.svg'
import arrowDark from '../assets/icon-arrow-up-dark.svg'

type ArrowButtonProps = ComponentPropsWithoutRef<'a'> & {
  /** light = white pill with a dark badge; primary = navy pill with a cream badge. */
  variant?: 'light' | 'primary'
}

const variants = {
  light: { pill: 'bg-white text-ink', badge: 'bg-ink', arrow: arrowLight },
  primary: { pill: 'bg-navy text-cream', badge: 'bg-cream', arrow: arrowDark },
} as const

/**
 * Pill button with a circular arrow badge, as used by the redesigned hero and
 * navigation bar. The label rolls on hover like every other button; the badge
 * lifts with it.
 */
export function ArrowButton({ variant = 'light', className = '', children, ...props }: ArrowButtonProps) {
  const style = variants[variant]

  return (
    <a
      className={`group inline-flex items-center justify-center gap-5 rounded-full py-0.5 pr-0.5 pl-6 text-[18px] font-medium transition-transform duration-300 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 ${style.pill} ${className}`}
      {...props}
    >
      <RollingText>{children}</RollingText>
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 ${style.badge}`}
      >
        {/* The design rotates the vuesax arrow-up glyph to point out of the pill */}
        <img src={style.arrow} alt="" className="size-5 rotate-[45deg]" />
      </span>
    </a>
  )
}
