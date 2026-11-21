import type { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import type { BreadcrumbItem } from '@/types'

// Misma cáscara que el resto de las páginas institucionales cortas
// (migas + columna angosta + prosa). El texto vive en los contenidos
// de privacidad y términos para no duplicarlo entre /privacidad y
// /legal/privacidad (y el par de términos).
export function DocumentoLegal({
  titulo,
  actualizacion,
  breadcrumbs,
  children,
}: {
  titulo: string
  actualizacion: string
  breadcrumbs: BreadcrumbItem[]
  children: ReactNode
}) {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          <h1 className="font-display font-extrabold text-ink text-h1 mb-8">{titulo}</h1>
          <p className="text-body-sm text-grey-500 mb-8">Última actualización: {actualizacion}</p>

          <div className="prose prose-lg max-w-none text-grey-700 prose-headings:font-display prose-headings:text-ink prose-h2:text-h3 prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-[1.2rem] prose-h3:font-bold prose-h3:leading-snug prose-h3:mt-8 prose-h3:mb-3 prose-a:text-navy-600 hover:prose-a:text-navy-700">
            {children}
          </div>
        </div>
      </section>
    </>
  )
}
