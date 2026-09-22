import { generatePageMetadata } from '@/lib/metadata'
import { getArticulos, getCategoryIdsBySection } from '@/lib/wordpress'
import { HeroRotator } from '@/components/home/HeroRotator'
import { QueHacer } from '@/components/home/QueHacer'
import { Pillars } from '@/components/home/Pillars'
import { Observatorio } from '@/components/home/Observatorio'
import { Testimonios } from '@/components/home/Testimonios'
import { Trayectoria } from '@/components/home/Trayectoria'
import { DonarCTA } from '@/components/home/DonarCTA'

export const metadata = generatePageMetadata({
  title: 'Asociación Civil por los derechos de las víctimas de homicidio y femicidio',
  description:
    'Usina de Justicia es una asociación civil que defiende los derechos de las víctimas de homicidio y femicidio en Argentina. Acompañamos familias, promovemos reformas legislativas y trabajamos por una justicia con perspectiva de víctima.',
  path: '/',
  // hreflang recíproco con la landing /en (v1 mínima, ver src/app/en/page.tsx).
  languages: { en: '/en' },
  // Home vive en el mismo segmento que el layout raíz que define el title
  // template — el único caso en que ese template NO se aplica (ver el
  // comentario de `appendSiteName` en src/lib/metadata.ts) — así que necesita
  // el sufijo agregado acá para no quedar sin él.
  appendSiteName: true,
})

export default async function Home() {
  // El panel editorial del hero muestra el artículo más reciente de
  // WordPress. Si la API falla, HeroEditorial cae a un contenido
  // institucional fijo (ver componente) — la home nunca se rompe por esto.
  //
  // "En los medios" queda afuera a propósito: es cobertura de terceros, no
  // contenido nuestro, y no debería poder convertirse en la pieza
  // destacada de la portada solo por ser lo último publicado.
  let latestArticle: Awaited<ReturnType<typeof getArticulos>>['data'][number] | null = null
  try {
    let excludeIds: number[] = []
    try {
      excludeIds = await getCategoryIdsBySection('en-los-medios')
    } catch {
      // Si falla, seguimos sin excluir — peor caso: una mención externa
      // protagoniza el hero una vez, hasta la próxima revalidación.
    }
    const response = await getArticulos({ perPage: 1, categoriesExclude: excludeIds })
    latestArticle = response.data[0] ?? null
  } catch {
    // Si falla la API, la home sigue funcionando sin la nota destacada.
  }

  return (
    <>
      <HeroRotator latestArticle={latestArticle} />
      <QueHacer />
      <Pillars />
      <Observatorio />
      <Testimonios />
      <Trayectoria />
      <DonarCTA />
    </>
  )
}
