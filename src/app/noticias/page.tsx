import type { Metadata } from 'next'
import { NoticiasListView } from './_components/NoticiasListView'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Historias, acompañamiento, incidencia, prensa, institucional y observatorio: todas las noticias de Usina de Justicia sobre los derechos de las víctimas del delito en Argentina.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/noticias' },
}

// Página estática (ISR): re-generada como máximo cada 5 minutos. Page 1 vive
// acá; las páginas 2+ están en /noticias/pagina/[n].
export const revalidate = 300

export default async function NoticiasPage() {
  return <NoticiasListView page={1} />
}
