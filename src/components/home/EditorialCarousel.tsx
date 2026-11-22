'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import styles from './EditorialCarousel.module.css'

const TRACK_ID = 'novedades-destacadas'
const DRAG_THRESHOLD = 6
const controlClass = 'grid size-11 place-items-center rounded-full border border-grey-200 text-navy-800 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600'

function getProgress(list: HTMLUListElement, count: number) {
  return Math.max(0, Math.min(count - 1, list.scrollLeft / (list.clientWidth || 1)))
}

export function EditorialCarousel({ children, count }: { children: ReactNode; count: number }) {
  const track = useRef<HTMLUListElement>(null)
  const worm = useRef<HTMLSpanElement>(null)
  const drag = useRef<{ id: number; startX: number; moved: boolean; button: HTMLButtonElement | null } | null>(null)
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)


  function scrollToItem(index: number) {
    const list = track.current
    const item = list?.children.item(index)
    if (!list || !item) return

    list.scrollTo({ left: list.scrollLeft + item.getBoundingClientRect().left - list.getBoundingClientRect().left })
  }

  const updateIndicator = useCallback(() => {
    const list = track.current
    if (!list) return

    const progress = getProgress(list, count)
    const fraction = progress % 1
    // The front moves towards the next dot first, then the back catches up.
    const offset = Math.floor(progress) + Math.max(0, 2 * fraction - 1)
    const length = 2 * Math.min(fraction, 1 - fraction)
    worm.current?.style.setProperty('--worm-offset', String(offset))
    worm.current?.style.setProperty('--worm-length', String(length))
    setActive(Math.round(progress))
  }, [count])

  useEffect(() => {
    setReady(true)
    const list = track.current
    if (!list || count <= 1) return

    const observer = new ResizeObserver(updateIndicator)
    observer.observe(list)
    return () => observer.disconnect()
  }, [count, updateIndicator])

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    switch (event.key) {
      case 'ArrowLeft': next = (index + count - 1) % count; break
      case 'ArrowRight': next = (index + 1) % count; break
      case 'Home': next = 0; break
      case 'End': next = count - 1; break
      default: return
    }
    event.preventDefault()
    event.currentTarget.parentElement?.querySelectorAll('button')[next]?.focus({ preventScroll: true })
    scrollToItem(next)
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return
    const button = (event.target as Element).closest('button')
    drag.current = { id: event.pointerId, startX: event.clientX, moved: false, button }
  }

  function scrub(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    const list = track.current
    if (!gesture || gesture.id !== event.pointerId || !list) return

    const rail = event.currentTarget
    if (!gesture.moved) {
      if (Math.abs(event.clientX - gesture.startX) < DRAG_THRESHOLD) return
      rail.setPointerCapture(event.pointerId)
      gesture.moved = true
      list.dataset.scrubbing = ''
    }

    const { left, width } = rail.getBoundingClientRect()
    const progress = Math.max(0, Math.min(count - 1, (event.clientX - left) / (width / count) - 0.5))
    const position = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? Math.round(progress) : progress
    list.scrollTo({ left: position * list.clientWidth, behavior: 'instant' })
    updateIndicator()
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    if (!gesture || gesture.id !== event.pointerId) return
    drag.current = null

    const list = track.current
    if (gesture.moved && list) {
      const nearest = Math.round(getProgress(list, count))
      delete list.dataset.scrubbing
      scrollToItem(nearest)
      return
    }

    // A browser can suppress the synthetic click immediately after a touch drag.
    if (event.type === 'pointerup' && gesture.button) {
      const releasedOn = document.elementFromPoint(event.clientX, event.clientY)?.closest('button')
      if (releasedOn === gesture.button) scrollToItem(Number(gesture.button.dataset.slide))
    }
  }

  return (
    <>
      <ul
        id={TRACK_ID}
        ref={track}
        aria-label="Publicaciones destacadas"
        tabIndex={count > 1 ? 0 : undefined}
        onScroll={count > 1 ? updateIndicator : undefined}
        className="relative m-0 flex list-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain p-0 motion-safe:scroll-smooth data-[scrubbing]:snap-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600"
      >
        {children}
      </ul>
      {count > 1 && (
        <div className={ready ? 'mt-4 flex flex-wrap items-center justify-between gap-2' : 'invisible mt-4 flex flex-wrap items-center justify-between gap-2'}>
          <p className="m-0 text-body-sm tabular-nums text-grey-700" aria-live="polite" aria-atomic="true">
            {active + 1} de {count}
          </p>
          <div
            role="group"
            aria-label="Elegir una publicación destacada"
            className={styles.dots}
            onPointerDown={startDrag}
            onPointerMove={scrub}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onLostPointerCapture={event => {
              if (event.target === event.currentTarget) finishDrag(event)
            }}
          >
            <span ref={worm} aria-hidden="true" className={styles.worm} />
            {Array.from({ length: count }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir al destacado ${index + 1} de ${count}`}
                aria-controls={TRACK_ID}
                aria-current={index === active ? true : undefined}
                data-slide={index}
                onClick={event => { if (event.detail === 0) scrollToItem(index) }}
                onKeyDown={event => moveFocus(event, index)}
                className={styles.dotButton}
              >
                <span aria-hidden="true" className={styles.dot} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Destacado anterior"
              aria-controls={TRACK_ID}
              onClick={() => scrollToItem((active + count - 1) % count)}
              className={controlClass}
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Destacado siguiente"
              aria-controls={TRACK_ID}
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
