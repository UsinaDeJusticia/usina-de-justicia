import type { ReactNode } from 'react'
import { HeroEditorial } from './HeroEditorial'
import { HeroAccompany } from './HeroAccompany'
import { HeroData } from './HeroData'
import type { Articulo } from '@/types'

export interface HeroSlide {
  key: string
  label: string
  bgClassName: string
  render: () => ReactNode
}

// Fuente única de las 3 variantes del hero (design-system/home:
// HeroEditorial, HeroAccompany, HeroData), compartida entre:
// - HeroRotator.tsx: placeholder estático que se sirve mientras el chunk
//   del rotador interactivo no cargó (SSR, no-JS, o los primeros ~segundos
//   de vida de la página).
// - HeroRotatorEnhanced.tsx: rotador interactivo (autoplay + tablist),
//   cargado diferido vía next/dynamic(ssr:false).
//
// Las dos vistas deben producir EXACTAMENTE la misma estructura/alto para
// la variante Editorial (grid con las 3 variantes apiladas, sólo la
// primera visible): si el marcado difiere, el swap de una a otra genera un
// layout shift al montar el rotador (esto pasó y se corrigió: ver el
// comentario en HeroRotator.tsx).
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
    {
      key: 'data',
      label: 'Observatorio',
      bgClassName: 'bg-navy-900',
      render: () => <HeroData />,
    },
  ]
}
