import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/lib/site-config'

// Portado de design-system/home/HeroAccompany.jsx. Cálido, centrado, foco en
// el familiar que recién llega. Fondo con transición sólida navy-50 → blanco
// (no gradiente: dos bloques de color, la unión es un corte simple).
export function HeroAccompany() {
  return (
    <div className="text-center max-w-[880px] mx-auto">
      <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-700 mb-5">
        Ante la pérdida de un ser querido por un hecho de inseguridad
      </p>
      <h1 className="font-display font-extrabold text-navy-800 text-[clamp(2.75rem,6vw,5.375rem)] leading-[1.0] tracking-[-0.02em]">
        Usina de Justicia
        <br />
        te acompaña.
      </h1>
      <p className="text-[19px] leading-[1.7] text-grey-700 mt-7 max-w-[640px] mx-auto">
        Muchos de quienes conformamos Usina estuvimos allí, en ese lugar oscuro en el
        que ninguna víctima eligió ni debería estar.
      </p>
      <div className="flex flex-wrap gap-3 mt-9 justify-center">
        <Button href="/#quehacer" variant="primary" size="lg">
          ¿Qué hacer en primer lugar?
        </Button>
        <Button
          href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
          variant="ghost"
          size="lg"
          className="underline underline-offset-4"
        >
          Contactarnos ahora
        </Button>
      </div>
    </div>
  )
}
