import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Tono de la Badge. `ochre` no se porta acá: es del sub-brand IVUJUS
 * (bordó/ocre), que vive en su propio sitio, no en usinadejusticia.org.ar.
 */
export type BadgeTone = 'navy' | 'neutral' | 'solid'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  navy: 'bg-navy-50 text-navy-700 border-navy-100',
  neutral: 'bg-grey-100 text-grey-700 border-grey-200',
  solid: 'bg-navy-600 text-white border-navy-600',
}

export function Badge({ tone = 'navy', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1',
        'font-body text-[11.5px] font-bold uppercase tracking-[0.08em]',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
