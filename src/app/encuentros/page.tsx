import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { DetalleEncuentro } from '@/components/encuentros/DetalleEncuentro'
import { FormularioInscripcion } from '@/components/encuentros/FormularioInscripcion'
import { encuentroActual } from '@/data/encuentro-actual'
import { encuentroPublico, estadoInscripcion } from '@/lib/encuentros'
import { siteConfig } from '@/lib/site-config'

// La página no consulta servicios externos: se regenera cada 5 minutos solo
// para que el cierre automático de inscripciones (por fecha) se refleje sin
// redeploy. El endpoint igual valida el cierre al minuto exacto.
export const revalidate = 300

const DESCRIPCION =
  'Un espacio de diálogo para fortalecer los derechos de las víctimas. Cada mes invitamos a ' +
  'especialistas, profesionales y ciudadanos a conversar sobre justicia, seguridad y derechos de las víctimas.'

export const metadata: Metadata = {
  title: 'Encuentros abiertos',
  description: DESCRIPCION,
  alternates: { canonical: `${siteConfig.url}/encuentros` },
}

export default function EncuentrosPage() {
  const estado = estadoInscripcion(encuentroActual)
  // Solo campos públicos: el ID de la reunión de Zoom no llega al navegador.
  const encuentro = encuentroActual ? encuentroPublico(encuentroActual) : null

  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Encuentros abiertos', href: '/encuentros' }]} />
      </div>

      <section className="pt-8 pb-16 md:pt-12 md:pb-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <header className="max-w-3xl mb-10 md:mb-12">
            <p className="flex items-center gap-3 text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-3">
              Encuentros abiertos
              <span className="h-px w-12 bg-navy-300" aria-hidden="true" />
            </p>
            <h1 className="font-display font-extrabold text-ink text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] mb-4">
              Encuentros abiertos
            </h1>
            <p className="text-body-lg text-grey-700 font-medium mb-3">
              Un espacio de diálogo para fortalecer los derechos de las víctimas.
            </p>
            <p className="text-body text-grey-700 leading-relaxed">
              Cada mes invitamos a especialistas, profesionales y ciudadanos a conversar sobre
              temas clave vinculados a la justicia, la seguridad y los derechos de las víctimas.
            </p>
          </header>

          {encuentro ? (
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              <DetalleEncuentro encuentro={encuentro} />
              <FormularioInscripcion encuentroId={encuentro.id} estado={estado} />
            </div>
          ) : (
            <div className="max-w-2xl bg-ivory border border-grey-200 rounded-xs p-6 md:p-8">
              <h2 className="font-display font-bold text-h3 text-ink mb-2">
                Próximamente, un nuevo encuentro
              </h2>
              <p className="text-body text-grey-700 m-0">
                En este momento no hay un encuentro con inscripción abierta. Estamos preparando la
                próxima convocatoria: volvé a visitar esta página o seguinos en redes para enterarte
                cuando se abra la inscripción.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
