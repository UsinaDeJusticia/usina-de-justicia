import { FileText, Download, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface DocumentCardProps {
  /** Título del documento (o del post que lo contiene). */
  titulo: string
  /** Línea secundaria: descripción fija ("Memoria y Balance certificado") o metadato (fecha, etc). */
  meta: string
  /** Link real al archivo. `null` = documento anunciado pero sin archivo adjunto todavía ("Próximamente"). */
  url: string | null
}

// Extraído de nosotros/transparencia/page.tsx (patrón original: ícono
// FileText + fila con título/meta + botón "Descargar" o estado "Próximamente"
// con ícono Clock cuando no hay archivo). Reusado por /recursos.
export function DocumentCard({ titulo, meta, url }: DocumentCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 bg-white border border-grey-200 rounded-xs hover:border-navy-300 hover:shadow-md transition-all duration-base ease-out">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-body text-ink truncate">{titulo}</h3>
          <p className="text-body-sm text-grey-600 truncate">{meta}</p>
        </div>
      </div>
      {url ? (
        <Button
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
          className="shrink-0"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Descargar
        </Button>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-grey-500 text-body-sm font-bold shrink-0">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Próximamente
        </span>
      )}
    </div>
  )
}
