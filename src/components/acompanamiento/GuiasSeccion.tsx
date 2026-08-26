import { guias } from './guias-data'
import { GuideCard } from './GuideCard'

// Sección "Guías para la etapa que estás viviendo" — el corazón de la
// ampliación pedida por Emanuel. Recorre `guias` (un array que va a crecer,
// hoy con un solo elemento) y renderiza una <GuideCard> por cada una, en vez
// de hardcodear el contenido de "la única guía que existe" en esta sección.
export function GuiasSeccion() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-grey-200">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="max-w-[720px] mb-11">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
            Recursos para participar activamente
          </p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5 mb-3.5">
            Guías para la etapa que estás viviendo
          </h2>
          <p className="text-body-lg text-grey-700">
            Una serie que va a seguir creciendo: guías en profundidad sobre cada etapa del
            proceso, escritas junto al equipo legal de Usina de Justicia.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {guias.map((guia) => (
            <GuideCard key={guia.slug} guia={guia} />
          ))}
        </div>
      </div>
    </section>
  )
}
