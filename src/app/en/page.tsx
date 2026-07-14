import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/lib/site-config'

// v1 provisoria — pendiente el contenido real de la presentación ante la OEA
// (decisión D5 del plan maestro). No agregar logros/cifras institucionales
// en inglés más allá de lo ya verificado en español en este repo.
//
// Fuentes de cada dato usado en esta página (todo ya publicado en español
// en este mismo repo, ninguno inventado para esta landing):
// - Fundación el 12 de noviembre de 2014 y el origen en 2011 (asesinato de
//   Ezequiel, hijo de Diana Cohen Agrest, en un robo): src/app/nosotros/page.tsx
//   (hitos 2011/2014) y design-system/README.md.
// - Misión / objetivos institucionales: src/app/nosotros/page.tsx (array `objetivos`).
// - Datos de contacto: src/lib/site-config.ts (siteConfig.contact).

export const metadata: Metadata = {
  title: "Usina de Justicia — Victims' Rights Association (Argentina)",
  description:
    'Usina de Justicia is an Argentine civil association that has accompanied families of homicide and femicide victims since 2014.',
  alternates: {
    canonical: 'https://www.usinadejusticia.org.ar/en',
    languages: { es: '/' },
  },
  robots: { index: true, follow: true },
}

const objetivos = [
  'Accompanying the families of homicide and femicide victims, providing emotional support and legal counsel.',
  "Promoting victims' rights and their participation in criminal proceedings and sentence enforcement, on equal footing with the defendant and the public prosecutor.",
  'Advocating for public policies that improve the prevention of serious criminal conduct.',
]

export default function EnglishLandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-16 md:pb-20 pt-8 md:pt-10">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Usina de Justicia
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Standing with victims of homicide and femicide in Argentina
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Usina de Justicia is an apartisan Argentine civil association
            (&ldquo;Asociación Civil&rdquo;), officially founded on November 12, 2014. We
            accompany the families of homicide and femicide victims and work toward a
            justice system that takes their rights into account.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink mb-6">Our origin</h2>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Usina de Justicia was born out of tragedy. In 2011, Diana Cohen Agrest — a
            Doctor in Philosophy (University of Buenos Aires) and a columnist for
            national print media — received news that her son Ezequiel, a 26-year-old
            student about to graduate, had been killed in a robbery. That grief became a
            decision: to study why the criminal justice system had failed to prevent it,
            and to fight for justice. Three years later, on November 12, 2014, Usina de
            Justicia was formally established as a civil association.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink mb-8">What we do</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {objetivos.map((texto) => (
              <div key={texto} className="p-6 bg-white border border-grey-200 rounded-xs">
                <p className="text-body text-grey-700 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTAs */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10 text-center">
          <h2 className="font-display font-bold text-h2 text-ink mb-4">
            Get in touch or support our work
          </h2>
          <p className="text-body-lg text-grey-700 max-w-narrow mx-auto mb-8 leading-relaxed">
            Our team can be reached at{' '}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-navy-600 font-bold hover:text-navy-700 transition-colors duration-base ease-out"
            >
              {siteConfig.contact.email}
            </a>{' '}
            or by phone at {siteConfig.contact.phone}. These pages are currently only
            available in Spanish.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/donar" variant="primary" size="lg">
              Donate
            </Button>
            <Button href="/contacto" variant="secondary" size="lg">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
