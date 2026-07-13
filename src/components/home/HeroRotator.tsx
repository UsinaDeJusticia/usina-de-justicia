'use client'

import { useCallback, useEffect, useState } from 'react'
import { HeroEditorial } from './HeroEditorial'
import { HeroAccompany } from './HeroAccompany'
import { HeroData } from './HeroData'
import type { Articulo } from '@/types'

// Rotador de las 3 variantes de hero (design-system/home: HeroEditorial,
// HeroAccompany, HeroData), montado como carrusel con crossfade.
//
// - Auto-avance cada 9s, se detiene con hover/foco/interacción manual.
// - Crossfade con los tokens de motion de marca (--duration-slow=320ms,
//   --ease-out) — sin slide/bounce/parallax.
// - `prefers-reduced-motion: reduce` desactiva la rotación por completo:
//   se muestra fija la primera variante (Editorial) sin controles, porque
//   no hay nada que "navegar" si no rota.
// - Cada slide tiene su propio fondo sólido (nunca gradiente): ivory,
//   navy-50 y navy-900 respectivamente.
const AUTOPLAY_MS = 9000

interface Slide {
  key: string
  label: string
  bgClassName: string
  render: () => React.ReactNode
}

interface HeroRotatorProps {
  latestArticle?: Articulo | null
}

export function HeroRotator({ latestArticle }: HeroRotatorProps) {
  const slides: Slide[] = [
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

  const [reducedMotion, setReducedMotion] = useState(false)
  const [detectedMotionPref, setDetectedMotionPref] = useState(false)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setReducedMotion(mq.matches)
      setDetectedMotionPref(true)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (reducedMotion || paused) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, paused, active, slides.length])

  const goTo = useCallback((index: number) => {
    setActive(index)
  }, [])

  // Evitar un "flash" de la variante rotativa antes de conocer la preferencia
  // real de motion del usuario en el primer render del cliente.
  if (!detectedMotionPref) {
    return (
      <section className={slides[0].bgClassName + ' py-16 md:py-20'}>
        <div className="max-w-content mx-auto px-4 md:px-10">{slides[0].render()}</div>
      </section>
    )
  }

  if (reducedMotion) {
    return (
      <section className={slides[0].bgClassName + ' py-16 md:py-20'}>
        <div className="max-w-content mx-auto px-4 md:px-10">{slides[0].render()}</div>
      </section>
    )
  }

  return (
    <section
      className="relative isolate"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
    >
      <div className="grid">
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            id={`hero-panel-${slide.key}`}
            role="tabpanel"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${slides.length}: ${slide.label}`}
            aria-hidden={i !== active}
            inert={i !== active ? true : undefined}
            className={
              slide.bgClassName +
              ' col-start-1 row-start-1 py-16 md:py-20 transition-opacity duration-slow ease-out ' +
              (i === active ? 'opacity-100 relative z-10' : 'opacity-0 pointer-events-none')
            }
          >
            <div className="max-w-content mx-auto px-4 md:px-10">{slide.render()}</div>
          </div>
        ))}
      </div>

      {/* Indicadores accesibles: navegables por teclado (Tab + flechas) */}
      <div
        role="tablist"
        aria-label="Variantes destacadas de la portada"
        className={
          'relative z-20 flex items-center justify-center gap-2.5 pb-6 -mt-1 ' +
          (slides[active].key === 'data' ? 'bg-navy-900' : slides[active].bgClassName)
        }
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            goTo((active + 1) % slides.length)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            goTo((active - 1 + slides.length) % slides.length)
          }
        }}
      >
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            role="tab"
            id={`hero-tab-${slide.key}`}
            aria-selected={i === active}
            aria-controls={`hero-panel-${slide.key}`}
            aria-label={`Mostrar variante ${i + 1} de ${slides.length}: ${slide.label}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => goTo(i)}
            className={
              'w-2.5 h-2.5 rounded-full transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 ' +
              (i === active
                ? slides[active].key === 'data'
                  ? 'bg-white'
                  : 'bg-navy-600'
                : slides[active].key === 'data'
                  ? 'bg-white/30 hover:bg-white/50'
                  : 'bg-navy-200 hover:bg-navy-400')
            }
          />
        ))}
      </div>
    </section>
  )
}
