import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonOwnProps {
  /** Estilo visual del botón. */
  variant?: ButtonVariant
  size?: ButtonSize
  /** Si se pasa, el botón se renderiza como <Link> en lugar de <button>. */
  href?: string
}

type ButtonAsButton = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    href?: undefined
  }

type ButtonAsLink = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[13px] rounded-md gap-1.5',
  md: 'px-[18px] py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3.5 text-base rounded-lg gap-2',
}

// Hover states darken the fill by one shade (never opacity); press states go
// one shade darker still and drop any shadow — no transform/scale, ever.
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-navy-600 text-white hover:bg-navy-800 active:bg-navy-900 active:shadow-none',
  secondary:
    'border-navy-600 bg-white text-navy-600 hover:bg-navy-50 active:bg-navy-100 active:shadow-none',
  ghost:
    'border-transparent bg-transparent text-navy-600 hover:bg-navy-50 active:bg-navy-100 active:shadow-none',
  danger:
    'border-transparent bg-danger text-white hover:bg-[#8B2A25] active:bg-[#752219] active:shadow-none',
}

const baseClasses = cn(
  'inline-flex items-center justify-center border font-body font-bold',
  'transition-colors duration-base ease-out',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  'disabled:cursor-not-allowed disabled:opacity-50',
)

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, sizeClasses[size], variantClasses[variant], className)

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
