'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export function EditorialCarousel({ children, count }: { children: ReactNode; count: number }) {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  function scrollToItem(index: number) {
    const list = track.current
    const item = list?.children.item(index)
    if (!list || !item) return

    list.scrollTo({ left: list.scrollLeft + item.getBoundingClientRect().left - list.getBoundingClientRect().left })
  }

  function updateActive() {
    const list = track.current
    if (!list) return

    const left = list.getBoundingClientRect().left
    let nearest = 0
    let smallestDistance = Infinity
    Array.from(list.children).forEach((item, index) => {
      const distance = Math.abs(item.getBoundingClientRect().left - left)
      if (distance < smallestDistance) {
        nearest = index
        smallestDistance = distance
      }
    })
    setActive(nearest)
  }

  const controlClass = 'grid size-11 place-items-center rounded-full border border-grey-200 text-navy-800 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600'

  return (
    <>
      <ul
        id="novedades-destacadas"
        ref={track}
        aria-label="Publicaciones destacadas"
        tabIndex={count > 1 ? 0 : undefined}
        onScroll={count > 1 ? updateActive : undefined}
        className="relative m-0 flex list-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain p-0 motion-safe:scroll-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600"
      >
        {children}
      </ul>
      {count > 1 && (
        <div className={ready ? 'mt-4 flex items-center justify-between gap-4' : 'invisible mt-4 flex items-center justify-between gap-4'}>
          <p className="m-0 text-body-sm tabular-nums text-grey-700" aria-live="polite" aria-atomic="true">
            {active + 1} de {count}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Destacado anterior"
              aria-controls="novedades-destacadas"
              onClick={() => scrollToItem((active + count - 1) % count)}
              className={controlClass}
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Destacado siguiente"
              aria-controls="novedades-destacadas"
              onClick={() => scrollToItem((active + 1) % count)}
              className={controlClass}
            >
              <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
