import type { ComponentPropsWithoutRef } from 'react'
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

/**
 * Hover is a fill, nothing more: the pill deepens, the badge follows, and
 * every element stays exactly where it was. The page's own motion is in the
 * scroll — the buttons should be the quiet part of it.
 */
const variants = {
  light: {
    pill: 'bg-white text-ink hover:bg-[#ececec] focus-visible:bg-[#ececec]',
    badge: 'bg-ink group-hover:bg-[#2e2e2e] group-focus-visible:bg-[#2e2e2e]',
    arrow: arrowLight,
  },
  primary: {
    pill: 'bg-navy text-cream hover:bg-[#2d5474] focus-visible:bg-[#2d5474]',
    badge: 'bg-cream group-hover:bg-white group-focus-visible:bg-white',
    arrow: arrowDark,
  },
} as const

/** Pill button with a circular arrow badge. */
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
  // As a button it keeps everything but the href — tabIndex and aria still
  // matter — and any onClick of its own runs before the press handler, so a
  // caller can close its menu and open a panel from the same click.
  const { href: _href, onClick, ...rest } = props
  const tagProps = onPress
    ? ({
        ...rest,
        type: 'button',
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          onClick?.(event as React.MouseEvent<HTMLAnchorElement>)
          onPress()
        },
      } as Record<string, unknown>)
    : (props as Record<string, unknown>)

  return (
    <Tag
      className={`group inline-flex cursor-pointer items-center ${justify} gap-5 rounded-full py-0.5 pr-0.5 pl-6 text-[18px] font-medium transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 ${style.pill} ${className}`}
      {...tagProps}
    >
      <span className="block whitespace-nowrap">{children}</span>

      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-out ${style.badge}`}
      >
        <img src={style.arrow} alt="" className="size-5 rotate-45" />
      </span>
    </Tag>
  )
}
