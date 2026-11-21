import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { generatePageMetadata } from '@/lib/metadata'
import { FeaturedUpdates } from '@/components/home/FeaturedUpdates'
import { QueHacer } from '@/components/home/QueHacer'
import { Pillars } from '@/components/home/Pillars'
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

export default function Home() {
  return (
    <>
      <section aria-labelledby="portada-titulo" className="bg-navy-900 text-white">
        <div className="mx-auto grid max-w-content gap-7 px-4 py-12 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center md:gap-12 md:px-10 md:py-20">
          <div>
            <h1 id="portada-titulo" className="m-0 max-w-[15ch] text-balance font-display text-[clamp(2.6rem,6.2vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
              Una justicia justa para las víctimas.
            </h1>
            <p className="mb-0 mt-5 max-w-[52ch] text-body-lg leading-relaxed text-navy-100 md:mt-7">
              Usina de Justicia es una asociación civil argentina. Acompañamos a familias de víctimas de homicidio y femicidio, defendemos sus derechos y promovemos la formación en victimología.
            </p>
          </div>

          <div className="rounded-xl bg-ivory p-6 text-navy-900 md:p-9">
            <h2 className="m-0 text-balance font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Si perdiste a un ser querido
            </h2>
            <p className="mb-5 mt-3 max-w-[38ch] text-body leading-relaxed text-grey-700">
              Te ofrecemos contención emocional y asesoramiento jurídico gratuitos.
            </p>
            <Link
              href="/necesito-ayuda"
              className="inline-flex min-h-12 items-center gap-3 rounded-xs bg-navy-700 px-4 py-2 font-bold text-white no-underline hover:bg-navy-900 hover:text-white hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-600"
            >
              Necesito ayuda <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <Pillars />
      <FeaturedUpdates />
      <QueHacer />
      <Testimonios />
      <Trayectoria />
      <DonarCTA />
    </>
  )
}
