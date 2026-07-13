import { Button } from '@/components/ui/Button'

// Portado de design-system/home/Donar.jsx, con un desvío deliberado: el JSX
// de referencia incluye un mini-formulario de "monto rápido" (botones $1.000
// / $5.000 / $10.000 + input) que no está conectado a ningún medio de pago
// real. Publicar ese formulario en la home simularía una funcionalidad que
// no existe. La página /donar ya resuelve el flujo de donación real, así
// que esta sección queda como una única llamada a la acción hacia /donar
// — évita además el bug conocido de doble CTA de donación (esta es la
// única aparición de un CTA de "Donar" fuera de header/footer).
export function DonarCTA() {
  return (
    <section id="donar" className="py-20 md:py-24 bg-navy-900 text-white scroll-mt-16">
      <div className="max-w-content mx-auto px-4 md:px-10 grid lg:grid-cols-[1.3fr_1fr] gap-14 items-center">
        <div>
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-300">
            Sostené esta tarea
          </p>
          <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] mt-3.5 mb-4">
            No recibimos subsidio del Estado.
            <br />
            <span className="text-navy-300">Tu aporte hace posible el acompañamiento.</span>
          </h2>
          <p className="text-body text-navy-200 leading-[1.7] max-w-[560px]">
            Con tu donación sostenemos la asistencia jurídica, la contención emocional y
            la investigación que alimenta nuestras propuestas de política pública.
          </p>
        </div>

        <div className="bg-white text-ink p-7 rounded-xs text-center">
          <p className="text-caption font-bold tracking-[0.12em] uppercase text-navy-700 mb-3">
            Quiero donar
          </p>
          <p className="text-body-sm text-grey-700 leading-relaxed mb-6">
            Donación segura · deducible de Ganancias
          </p>
          <Button href="/donar" variant="primary" size="lg" className="w-full">
            Donar ahora
          </Button>
        </div>
      </div>
    </section>
  )
}
