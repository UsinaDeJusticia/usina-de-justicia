import type { Metadata } from 'next'
import { getWPTags } from '@/lib/wordpress'
import { TagListView } from './_components/TagListView'

// ============================================
// GENERACIÓN ESTÁTICA: pre-renderizar los tags más usados
// ============================================

export async function generateStaticParams() {
  try {
    const tags = await getWPTags()
    // Solo pre-renderizar los 30 tags más usados para no exceder límites
    return tags.slice(0, 30).map((t) => ({ tag: t.slug }))
  } catch {
    return []
  }
}

// Página estática (ISR): re-generada como máximo cada 5 minutos. Page 1 de
// cada tag vive acá; las páginas 2+ están en /noticias/tag/[tag]/pagina/[n].
export const revalidate = 21600 // 6 h; publicaciones/ediciones invalidan por webhook

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const tags = await getWPTags()
  const tagData = tags.find((t) => t.slug === tag)

  if (!tagData) return { title: 'Etiqueta no encontrada' }

  return {
    title: `${tagData.nombre} — Noticias`,
    description: `Artículos etiquetados con "${tagData.nombre}" — Usina de Justicia`,
    // SEO oct-2026: las etiquetas son listados finos/duplicados (ej. infoveloz:
    // 2.946 impresiones, 1 clic). Fuera del índice, pero Google sigue los links.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/tag/${tag}`,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  return <TagListView tag={tag} page={1} />
}
