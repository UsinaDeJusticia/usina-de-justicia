import { CalendarDays, FileText, Users, Video } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatearFechaHora, type EncuentroPublico } from '@/lib/encuentros'

const A_CONFIRMAR = 'A confirmar'

export function DetalleEncuentro({ encuentro }: { encuentro: EncuentroPublico }) {
  const filas = [
    { icono: FileText, titulo: 'Tema', texto: encuentro.tema ?? A_CONFIRMAR },
    {
      icono: CalendarDays,
      titulo: 'Fecha y horario',
      texto: formatearFechaHora(encuentro.inicio) ?? A_CONFIRMAR,
    },
    { icono: Video, titulo: 'Modalidad', texto: 'Virtual, por Zoom' },
    {
      icono: Users,
      titulo: 'Participación gratuita',
      texto: 'Actividad abierta al público, con inscripción previa.',
    },
  ]

  return (
    <article className="bg-white border border-grey-200 rounded-xs p-6 md:p-8">
      <Badge tone="solid">Próximo encuentro</Badge>
      <h2 className="font-display font-extrabold text-ink text-[clamp(1.75rem,3.5vw,2.25rem)] leading-tight mt-4 mb-2">
        {encuentro.expositor}
      </h2>
      {encuentro.descripcion && (
        <p className="text-body text-grey-700 leading-relaxed mb-2">{encuentro.descripcion}</p>
      )}

      <dl className="mt-4 divide-y divide-grey-200 border-t border-grey-200">
        {filas.map(({ icono: Icono, titulo, texto }) => (
          <div key={titulo} className="flex items-start gap-4 py-4">
            <Icono className="w-6 h-6 text-navy-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="text-body font-bold text-ink">{titulo}</dt>
              <dd className="text-body text-grey-700 m-0">{texto}</dd>
            </div>
          </div>
        ))}
      </dl>
    </article>
  )
}
