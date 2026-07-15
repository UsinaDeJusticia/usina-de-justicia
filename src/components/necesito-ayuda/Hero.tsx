import { MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/lib/site-config'

// Hero de /necesito-ayuda. Mismo tono que HeroAccompany.tsx (Home) pero con
// foco exclusivo en la acción inmediata: comunicarse. Fondo navy-50 → blanco,
// sin imágenes de stock, siguiendo la regla del design system de fondos
// sobrios para contenido sensible.
//
// Fuentes del copy (ver docs/COPY-necesito-ayuda.md para el detalle):
// - Eyebrow y título: voz de marca citada en design-system/README.md
//   ("Ante la pérdida de un ser querido por un hecho de inseguridad, Usina
//   de Justicia te acompaña").
// - Párrafo principal: cita casi textual de la página WP real
//   "Acompañamiento a las Víctimas" (acompanamiento-a-la-victima.html).
// - Último párrafo: QueHacer.tsx (Home), ya aprobado.
export function Hero() {
  return (
    <section className="bg-navy-50 border-b border-grey-200">
      <div className="max-w-content mx-auto px-4 md:px-10 py-20 md:py-28">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-700 mb-5">
            Ante la pérdida de un ser querido por un hecho de inseguridad
          </p>
          <h1 className="font-display font-extrabold text-navy-800 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] tracking-[-0.02em]">
            Usina de Justicia te acompaña.
          </h1>
          <p className="text-body-lg text-grey-700 leading-[1.7] mt-7 max-w-[680px] mx-auto">
            La muerte de un ser querido producida por un acto de violencia es una de las
            experiencias más traumáticas que puedan ser vividas, para la que nadie está
            preparado. No hay apoyo, justicia, restitución o acto compasivo que pueda
            devolvernos al ser querido perdido para siempre. Una justicia justa, que le
            otorgue al delincuente la ejecución de la pena que le corresponde, puede, en
            cierta forma, mitigar el dolor y permitir realizar el duelo que se necesite,
            para poder luego continuar con tu vida.
          </p>
          <p className="text-body text-grey-700 mt-5 max-w-[560px] mx-auto">
            Nadie debería enfrentar esto solo. Te acompañamos paso a paso, con tiempo y
            reserva.
          </p>

          <div className="flex flex-wrap gap-3 mt-9 justify-center">
            <Button
              href={siteConfig.contact.whatsapp}
              variant="primary"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
              Escribinos por WhatsApp
            </Button>
            <Button
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
              variant="secondary"
              size="lg"
            >
              <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
              Llamanos
            </Button>
          </div>

          <p className="mt-5 text-body-sm text-grey-700">
            También podés escribirnos a{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-navy-600">
              {siteConfig.contact.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
