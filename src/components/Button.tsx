import type { ComponentPropsWithoutRef } from 'react'
import { RollingText } from './RollingText'

type ButtonProps = ComponentPropsWithoutRef<'a'> & {
  /** primary = navy pill (nav, dark surfaces); light = white pill (over imagery). */
  variant?: 'primary' | 'light'
}

const base =
  'group inline-flex items-center justify-center rounded-full px-6 py-3 text-[18px] font-medium ' +
  'transition-transform duration-300 ease-out active:scale-[0.98] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2'

const variants = {
  primary: 'bg-navy text-cream focus-visible:outline-navy',
  light: 'bg-white text-ink focus-visible:outline-white',
} as const

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      <RollingText>{children}</RollingText>
    </a>
  )
}
