import { FileText, Download, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import documentSizes from './document-sizes.json'

// Sizes are a snapshot of WordPress attachment metadata, keyed by upload path.
const sizesByPath: Record<string, number> = documentSizes
const wordpressHosts = new Set(['usinadejusticia.org.ar', 'www.usinadejusticia.org.ar', 'wp.usinadejusticia.org.ar'])
const sizeFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })

function fileDetails(url: string | null): string[] {
  if (!url) return []
  try {
    const file = new URL(url, 'https://www.usinadejusticia.org.ar')
    const path = decodeURIComponent(file.pathname)
    if (!path.toLowerCase().endsWith('.pdf')) return []
    const bytes = wordpressHosts.has(file.hostname) ? sizesByPath[path] : undefined
    if (!bytes) return ['PDF']
    const size = bytes >= 1_000_000
      ? sizeFormat.format(bytes / 1_000_000) + ' MB'
      : sizeFormat.format(bytes / 1_000) + ' kB'
    return ['PDF', size]
  } catch {
    return []
  }
}

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
    <div className="flex flex-col items-start gap-3 rounded-xs border border-grey-200 bg-white p-5 hover:border-navy-300 hover:shadow-md motion-safe:transition-[border-color,box-shadow] motion-safe:duration-base ease-out sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-start gap-4 sm:items-center">
        <div className="w-10 h-10 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-body text-ink wrap-anywhere">{titulo}</h3>
          <p className="text-body-sm text-grey-600 wrap-anywhere">{[meta, ...fileDetails(url)].join(' · ')}</p>
        </div>
      </div>
      {url ? (
        <Button
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
          className="ml-14 min-h-11 shrink-0 sm:ml-0"
          aria-label={'Descargar ' + titulo}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Descargar
        </Button>
      ) : (
        <span className="ml-14 inline-flex shrink-0 items-center gap-1.5 text-body-sm font-bold text-grey-600 sm:ml-0">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Próximamente
        </span>
      )}
    </div>
  )
}
