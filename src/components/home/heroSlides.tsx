import type { ReactNode } from 'react'
import { HeroEditorial } from './HeroEditorial'
import { HeroAccompany } from './HeroAccompany'
import type { Articulo } from '@/types'

export interface HeroSlide {
  key: string
  label: string
  bgClassName: string
  render: () => ReactNode
}

// Fuente única de las 2 variantes del hero (Editorial y Acompañamiento),
// compartida entre:
// - HeroRotator.tsx: placeholder estático que se sirve mientras el chunk
//   del rotador interactivo no cargó (SSR, no-JS o los primeros segundos).
// - HeroRotatorEnhanced.tsx: rotador interactivo (autoavance + controles),
//   cargado diferido tras la primera interacción o en idle.
//
// Ambas vistas montan sólo la variante activa y reservan el mismo espacio
// para sus controles; así el cambio del placeholder al rotador no provoca
// un salto de layout.
export function getHeroSlides(latestArticle?: Articulo | null): HeroSlide[] {
  return [
    {
      key: 'editorial',
      label: 'Editorial',
      bgClassName: 'bg-ivory border-b border-grey-200',
      render: () => <HeroEditorial latestArticle={latestArticle} />,
    },
    {
      key: 'acompany',
      label: 'Acompañamiento',
      bgClassName: 'bg-navy-50',
      render: () => <HeroAccompany />,
    },
  ]
}
