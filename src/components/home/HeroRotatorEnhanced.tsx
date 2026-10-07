'use client'

import { useCallback, useEffect, useState } from 'react'
import { getHeroSlides } from './heroSlides'
import type { Articulo } from '@/types'

// Rotador completo de las 2 variantes del hero. Separado de HeroRotator.tsx a
// propósito: este componente sólo se carga y se monta en el cliente, vía
// importación diferida, después de que HeroRotator decide que el hilo
// principal está libre (ver ese archivo) — así su costo de hidratación
// (media query, temporizador y controles) no compite con el LCP/TBT inicial.
//
// Como este árbol nunca se hidrata (nunca hay HTML de servidor equivalente:
// Next lo monta directo con ReactDOM en el cliente), puede leer
// matchMedia('prefers-reduced-motion') de forma síncrona en el estado
// inicial sin riesgo de mismatch — a diferencia de la versión anterior, que
// vivía en un client component SSR-eado y necesitaba un estado
// "detectedMotionPref" para evitar un flash de la variante rotativa.
//
// - Auto-avance cada 9s, con pausas por interacción y un control visible.
// - Fade-in al cambiar de variante, con los tokens de motion de marca
//   (--duration-slow=320ms, --ease-out) — sin slide/bounce/parallax.
// - `prefers-reduced-motion: reduce` desactiva la rotación por completo:
//   se muestra fija la primera variante (Editorial) sin controles, porque
//   no hay nada que "navegar" si no rota.
// - Cada slide tiene su propio fondo sólido (nunca gradiente).
//
// OJO CLS: acá sólo se monta la variante ACTIVA (nunca las 3 al mismo
// tiempo). Una versión anterior apilaba las 3 con CSS grid
// (col-start-1/row-start-1) y ocultaba las inactivas con opacity-0 — con
// eso el contenedor medía el alto de la variante MÁS alta de las 3, y
// además esas 2 variantes ocultas metían de entrada su texto real al
// árbol de layout: cuando las fuentes web terminaban de cargar (font swap)
// ese texto oculto también reflowaba, multiplicando por 3 el salto de
// layout. Montar sólo la activa evita las dos cosas: el alto siempre es el
// de una única variante, y no hay texto oculto reflowando de más.
const AUTOPLAY_MS = 9000

interface HeroRotatorEnhancedProps {
  latestArticle?: Articulo | null
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function HeroRotatorEnhanced({ latestArticle }: HeroRotatorEnhancedProps) {
  const slides = getHeroSlides(latestArticle)

  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [manuallyPaused, setManuallyPaused] = useState(false)
  // Arranca en `false` para que, al montar (o al cambiar de variante), el
  // fade-in se dispare desde opacity-0 en vez de aparecer ya visible.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (reducedMotion || paused || manuallyPaused) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, paused, manuallyPaused, active, slides.length])

  useEffect(() => {
    setVisible(false)
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [active])

  const goTo = useCallback((index: number) => {
    setActive(index)
  }, [])

  if (reducedMotion) {
    return (
      <section className={slides[0].bgClassName + ' py-16 md:py-20'}>
        <div className="max-w-content mx-auto px-4 md:px-10">{slides[0].render()}</div>
      </section>
    )
  }

  const activeSlide = slides[active]

  return (
    <section
      aria-label="Contenido destacado de la portada"
      className="relative isolate"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={(event) => {
        if (event.target instanceof HTMLButtonElement && event.target.dataset.carouselToggle !== undefined) return
        setPaused(true)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
    >
      <div className="grid">
        <div
          key={activeSlide.key}
          className={
            activeSlide.bgClassName +
            ' col-start-1 row-start-1 py-16 md:py-20 transition-opacity duration-slow ease-out ' +
            (visible ? 'opacity-100' : 'opacity-0')
          }
        >
          <div className="max-w-content mx-auto px-4 md:px-10">{activeSlide.render()}</div>
        </div>
      </div>

      {/* Botones nativos: selección de variante y pausa accesibles por teclado. */}
      <div
        role="group"
        aria-label="Variantes destacadas de la portada"
        className={
          'relative z-20 flex items-center justify-center gap-2.5 pb-6 -mt-1 ' +
          slides[active].bgClassName
        }
      >
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            aria-pressed={i === active}
            aria-label={`Mostrar variante ${i + 1} de ${slides.length}: ${slide.label}`}
            onClick={() => goTo(i)}
            className={
              'w-2.5 h-2.5 rounded-full transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 ' +
              (i === active ? 'bg-navy-600' : 'bg-navy-200 hover:bg-navy-400')
            }
          />
        ))}
        <button
          type="button"
          data-carousel-toggle
          aria-pressed={manuallyPaused}
          aria-label={manuallyPaused ? 'Reanudar el carrusel' : 'Pausar el carrusel'}
          onClick={() => setManuallyPaused((value) => !value)}
          className="absolute right-4 md:right-10 px-2 py-1 text-body-sm font-semibold text-navy-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2"
        >
          {manuallyPaused ? 'Reanudar' : 'Pausar'}
        </button>
      </div>
    </section>
  )
}
