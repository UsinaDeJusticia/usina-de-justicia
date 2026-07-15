import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Términos de Uso',
  description: 'Términos y condiciones de uso del sitio web de Usina de Justicia.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/legal/terminos' },
}

export default function TerminosPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Legal', href: '/legal/terminos' },
            { label: 'Términos de Uso', href: '/legal/terminos' },
          ]}
        />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          <h1 className="font-display font-extrabold text-ink text-h1 mb-8">Términos de Uso</h1>
          <p className="text-body-sm text-grey-500 mb-8">
            Última actualización: marzo 2026
          </p>

          <div className="prose prose-lg max-w-none text-grey-700 prose-headings:font-display prose-headings:text-ink prose-h2:text-h3 prose-h2:mt-10 prose-h2:mb-4">
            <h2>Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar el sitio web de Usina de Justicia
              (usinadejusticia.org.ar), aceptás los presentes términos y
              condiciones de uso.
            </p>

            <h2>Propiedad intelectual</h2>
            <p>
              Todo el contenido publicado en este sitio web, incluyendo textos,
              imágenes, logos y documentos, es propiedad de Asociación Civil
              Usina de Justicia o de sus respectivos autores, y está protegido
              por las leyes de propiedad intelectual vigentes.
            </p>

            <h2>Uso permitido</h2>
            <p>
              El contenido de este sitio puede ser utilizado con fines
              informativos y educativos, siempre que se cite la fuente.
              Queda prohibida la reproducción con fines comerciales sin
              autorización previa.
            </p>

            <h2>Limitación de responsabilidad</h2>
            <p>
              La información proporcionada en este sitio es de carácter general
              y no constituye asesoramiento legal. Para consultas específicas,
              contactá a nuestro equipo.
            </p>

            <h2>Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Las modificaciones entrarán en vigencia desde su
              publicación en el sitio.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
