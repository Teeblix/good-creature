import type { ComponentPropsWithoutRef } from 'react'
import { RollingText } from './RollingText'
import arrowLight from '../assets/icon-arrow-up.svg'
import arrowDark from '../assets/icon-arrow-up-dark.svg'

type ArrowButtonProps = ComponentPropsWithoutRef<'a'> & {
  /** light = white pill with a dark badge; primary = navy pill with a cream badge. */
  variant?: 'light' | 'primary'
  /**
   * Makes this a button rather than a link. Use it for anything that opens
   * something on the page: an anchor would be navigation, and the smooth
   * scroller claims anchor clicks before React sees them.
   */
  onPress?: () => void
}

const variants = {
  light: { pill: 'bg-white text-ink', badge: 'bg-ink', arrow: arrowLight },
  primary: { pill: 'bg-navy text-cream', badge: 'bg-cream', arrow: arrowDark },
} as const

const SLIDE =
  'transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

/**
 * Pill button with a circular arrow badge.
 *
 * On hover the label rolls upward and the arrow rolls too — but along the 45°
 * axis it points down, leaving the badge through its own tip while an
 * identical arrow enters from the opposite corner. The badge itself never
 * moves; it just clips the two arrows.
 */
export function ArrowButton({
  variant = 'light',
  className = '',
  children,
  onPress,
  ...props
}: ArrowButtonProps) {
  const style = variants[variant]
  // Full-width versions push the label and badge to opposite ends, so only
  // centre the pair when the caller has not asked for a different alignment.
  const justify = className.includes('justify-') ? '' : 'justify-center'

  const Tag = onPress ? 'button' : 'a'
  const tagProps = onPress
    ? ({ type: 'button', onClick: onPress } as const)
    : (props as Record<string, unknown>)

  return (
    <Tag
      className={`group inline-flex cursor-pointer items-center ${justify} gap-5 rounded-full py-0.5 pr-0.5 pl-6 text-[18px] font-medium transition-transform duration-300 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 ${style.pill} ${className}`}
      {...tagProps}
    >
      <RollingText>{children}</RollingText>

      <span
        className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${style.badge}`}
      >
        {/* Leaves through the tip */}
        <span
          className={`absolute inset-0 flex items-center justify-center ${SLIDE} group-hover:translate-x-[80%] group-hover:-translate-y-[80%] group-focus-visible:translate-x-[80%] group-focus-visible:-translate-y-[80%] motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0`}
        >
          <img src={style.arrow} alt="" className="size-5 rotate-45" />
        </span>
        {/* Follows in from the tail */}
        <span
          aria-hidden
          className={`absolute inset-0 flex -translate-x-[80%] translate-y-[80%] items-center justify-center ${SLIDE} group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:group-hover:-translate-x-[80%] motion-reduce:group-hover:translate-y-[80%]`}
        >
          <img src={style.arrow} alt="" className="size-5 rotate-45" />
        </span>
      </span>
    </Tag>
  )
}
