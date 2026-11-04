import type { Metadata } from 'next'
import { NoticiasListView } from './_components/NoticiasListView'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Noticias e historias de Usina de Justicia sobre los derechos de las víctimas, el acompañamiento a familias, la incidencia pública y la actividad institucional en Argentina.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/noticias' },
}

// Página estática (ISR): re-generada como máximo cada 5 minutos. Page 1 vive
// acá; las páginas 2+ están en /noticias/pagina/[n].
export const revalidate = 21600 // 6 h; publicaciones/ediciones invalidan por webhook

export default async function NoticiasPage() {
  return <NoticiasListView page={1} />
}
