import { MessageCircle, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/lib/site-config'

// CTA final de contacto. A diferencia de DonarCTA.tsx (Home), acá no se pide
// nada a cambio: es sólo el punto de contacto para quien necesita ayuda.
export function CTAFinal() {
  return (
    <section className="py-20 md:py-24 bg-navy-900 text-white">
      <div className="max-w-content mx-auto px-4 md:px-10 text-center">
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-300 mb-4">
          No tenés que atravesar esto solo
        </p>
        <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.1] max-w-[720px] mx-auto">
          Comunicate con nosotros, con el tiempo y la reserva que necesites.
        </h2>

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
            className="border-white text-white hover:bg-white/10"
          >
            <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
            {siteConfig.contact.phone}
          </Button>
        </div>

        <p className="mt-6 text-body-sm text-navy-200 inline-flex items-center gap-2 justify-center">
          <Mail className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
          <a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-white">
            {siteConfig.contact.email}
          </a>
        </p>
      </div>
    </section>
  )
}
