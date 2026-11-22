'use client'

import { useEffect, useState } from 'react'

interface GuideIndexProps {
  title: string
  items: { id: string; label: string }[]
}

export function GuideIndex({ title, items }: GuideIndexProps) {
  const [activeId, setActiveId] = useState<string | undefined>()

  useEffect(() => {
    const sections = items.flatMap(({ id }) => document.getElementById(id) ?? [])
    const firstSection = sections[0]
    const guide = firstSection?.closest('article')
    if (!firstSection || !guide) return

    let frame: number | null = null

    const updateActive = () => {
      frame = null
      // Use the same offset as the native anchors so a jump marks its destination.
      const readingLine = parseFloat(getComputedStyle(firstSection).scrollMarginTop) + 1
      let current: string | undefined

      if (guide.getBoundingClientRect().bottom > readingLine) {
        for (const section of sections) {
          if (section.getBoundingClientRect().top > readingLine) break
          current = section.id
        }
      }

      setActiveId(current)
    }

    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(updateActive)
    }

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(guide)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [items])

  return (
    <div className="border-b border-grey-200 px-6 py-5 md:px-10 lg:col-start-2 lg:row-start-1 lg:border-0 lg:px-8 lg:py-12">
      <nav aria-label={`Índice de la guía: ${title}`} className="lg:sticky lg:top-24">
        <p className="mb-2 text-[11px] font-bold tracking-[0.14em] uppercase text-grey-700">En esta guía</p>
        <ul className="m-0 grid list-none gap-1 p-0 sm:grid-cols-2 lg:grid-cols-1">
          {items.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={id === activeId ? 'location' : undefined}
                className="group flex min-h-11 items-center gap-2.5 rounded-xs px-2 py-2 text-body-sm font-bold text-grey-700 no-underline hover:bg-navy-50 hover:text-navy-700 hover:no-underline focus-visible:outline-2 focus-visible:outline-navy-600 aria-[current=location]:bg-navy-50 aria-[current=location]:text-navy-800"
              >
                <span
                  aria-hidden="true"
                  className="h-0.5 w-3.5 shrink-0 origin-left scale-x-50 rounded-full bg-grey-400 motion-safe:transition-transform motion-safe:duration-fast ease-out group-focus-visible:scale-x-100 group-focus-visible:bg-navy-600 group-aria-[current=location]:scale-x-100 group-aria-[current=location]:bg-navy-600 pointer-fine:group-hover:scale-x-100 pointer-fine:group-hover:bg-navy-600"
                />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
