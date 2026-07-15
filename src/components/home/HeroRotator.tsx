'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { getHeroSlides } from './heroSlides'
import type { Articulo } from '@/types'

// Envoltorio de hidratación diferida del hero (Perf Home, gate G4).
//
// El HTML que se sirve (SSR y también el caso sin JS) es siempre el
// placeholder estático de acá abajo: la variante Editorial visible, con
// exactamente el mismo contenido que el primer slide del rotador completo
// (incluido el párrafo de definición institucional, ver Ola D / GEO). El
// rotador completo (variantes Acompañamiento + Observatorio + matchMedia +
// setInterval + tablist, ~1.6s de hidratación medidos por Lighthouse) vive
// en HeroRotatorEnhanced.tsx y se descarga + monta recién cuando el hilo
// principal queda libre (`requestIdleCallback`, con fallback `setTimeout` a
// los 2s) o en la primera interacción del visitante — lo que ocurra
// primero. Así ese trabajo sale del camino crítico de TBT.
//
// OJO CLS (dos vueltas hasta llegar acá, documentadas para que no se
// repita el error):
// 1. La primera versión de este placeholder sólo reservaba el alto de la
//    variante Editorial; al montar el rotador completo (que en ese momento
//    apilaba las 3 variantes con CSS grid y se quedaba con el alto de la
//    más alta de las 3) la página entera se corría — CLS 0.072 → 1.842.
// 2. El segundo intento apiló acá también las 3 variantes (ocultas con
//    opacity-0) para igualar ese alto máximo — el alto ya no cambiaba,
//    pero el CLS seguía en 1.842: las 2 variantes ocultas metían su texto
//    real al árbol de layout desde el primer paint, y cuando las fuentes
//    web terminaban de cargar (font swap) ese texto oculto reflowaba junto
//    con el visible, TRIPLICANDO el salto de layout del font-swap normal.
// La solución real (ver también HeroRotatorEnhanced.tsx): en vez de
// igualar alturas, que nunca haya una variante "de más" en el DOM. Acá se
// monta sólo la Editorial (como HeroRotatorEnhanced monta sólo la variante
// activa) — mismo contenido, mismo alto, en los dos estados.
const IDLE_FALLBACK_MS = 2000
const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'wheel'] as const

interface HeroRotatorProps {
  latestArticle?: Articulo | null
}

export function HeroRotator({ latestArticle }: HeroRotatorProps) {
  const [Enhanced, setEnhanced] = useState<ComponentType<HeroRotatorProps> | null>(null)

  useEffect(() => {
    let activated = false

    const activate = () => {
      if (activated) return
      activated = true
      teardown()
      import('./HeroRotatorEnhanced').then((mod) => {
        setEnhanced(() => mod.HeroRotatorEnhanced as ComponentType<HeroRotatorProps>)
      })
    }

    const idleHandle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(activate, { timeout: IDLE_FALLBACK_MS })
        : window.setTimeout(activate, IDLE_FALLBACK_MS)

    INTERACTION_EVENTS.forEach((evt) => window.addEventListener(evt, activate, { passive: true, once: true }))

    function teardown() {
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle as number)
      } else {
        window.clearTimeout(idleHandle as number)
      }
      INTERACTION_EVENTS.forEach((evt) => window.removeEventListener(evt, activate))
    }

    return teardown
  }, [])

  if (Enhanced) {
    return <Enhanced latestArticle={latestArticle} />
  }

  const editorial = getHeroSlides(latestArticle)[0]

  return (
    <section className="relative isolate">
      <div className="grid">
        <div className={editorial.bgClassName + ' col-start-1 row-start-1 py-16 md:py-20'}>
          <div className="max-w-content mx-auto px-4 md:px-10">{editorial.render()}</div>
        </div>
      </div>

      {/* Renglón reservado del tamaño del tablist real (ver
          HeroRotatorEnhanced), invisible y afuera del árbol de
          accesibilidad: todavía no hay JS para hacerlo funcionar, así que
          no se exponen botones sin acción a lectores de pantalla. Sólo
          existe para que el alto no cambie cuando el tablist real
          aparezca al montar el rotador. */}
      <div
        aria-hidden="true"
        className={'invisible relative z-20 flex items-center justify-center gap-2.5 pb-6 -mt-1 ' + editorial.bgClassName}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-navy-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-navy-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-navy-600" />
      </div>
    </section>
  )
}
