import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Articulo } from '@/types'

// Portado de design-system/home/HeroEditorial.jsx.
// El panel derecho del diseño original usa una foto de stock (Unsplash) con
// una cita literaria superpuesta. Reemplazado por contenido editorial real:
// el artículo más reciente de WordPress (imagen destacada + título),
// según la instrucción de conectar HeroEditorial a getArticulos. Si no hay
// artículos disponibles, cae a un bloque navy sólido (nunca stock inventado).
interface HeroEditorialProps {
  latestArticle?: Articulo | null
}

export function HeroEditorial({ latestArticle }: HeroEditorialProps) {
  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-center">
      <div>
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-4">
          Asociación Civil · desde 2014
        </p>
        <h1 className="font-display font-extrabold text-navy-900 text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.015em]">
          Una justicia justa
          <br />
          <span className="text-navy-600">para las víctimas.</span>
        </h1>
        <p className="text-body-lg text-grey-700 mt-5 max-w-[520px]">
          Acompañamos a las familias que perdieron a un ser querido por un hecho de
          inseguridad, con contención emocional y asesoramiento legal. Trabajamos
          contra la impunidad y por los derechos de las víctimas en el proceso penal.
        </p>
        <div className="flex flex-wrap gap-3 mt-7">
          <Button href="/#quehacer" variant="primary" size="lg">
            Si perdiste a un ser querido →
          </Button>
          <Button href="/#observatorio" variant="ghost" size="lg" className="underline underline-offset-4">
            Ver el observatorio
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="relative aspect-[4/5] rounded-xs overflow-hidden shadow-md bg-navy-800">
          {latestArticle?.imagenDestacada ? (
            <Image
              src={latestArticle.imagenDestacada.url}
              alt={latestArticle.imagenDestacada.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
              priority
            />
          ) : null}
          {/* Bloque semitransparente navy para legibilidad del texto, nunca gradiente decorativo */}
          <div className="absolute inset-0 bg-[rgba(16,27,42,0.55)]" />
          <div className="absolute inset-0 flex flex-col justify-end p-7 text-white">
            {latestArticle ? (
              <>
                <p className="text-caption font-bold tracking-[0.14em] uppercase opacity-85">
                  {latestArticle.categoria.nombre}
                </p>
                <h2 className="font-display text-xl font-bold leading-snug mt-1.5">
                  <Link href={`/noticias/${latestArticle.slug}`} className="text-white no-underline hover:underline">
                    {latestArticle.titulo}
                  </Link>
                </h2>
              </>
            ) : (
              <>
                <p className="text-caption font-bold tracking-[0.14em] uppercase opacity-85">Testimonio</p>
                <blockquote className="font-display text-xl italic leading-snug mt-1.5 font-normal">
                  &ldquo;Murió en agosto, y cuando ese mes llegó a su fin, yo no hacía más que
                  pensar ¿cómo voy a poder pasar a septiembre quedándose él en agosto?&rdquo;
                </blockquote>
                <p className="text-caption mt-2.5 opacity-80">— David Grossman, citado por UJ</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
