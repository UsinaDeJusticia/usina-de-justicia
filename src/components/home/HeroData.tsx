import { Button } from '@/components/ui/Button'

// Portado de design-system/home/HeroData.jsx. Dato primero, autoridad
// institucional, fondo navy-900 sólido.
const stats = [
  { value: '+1.800', label: 'víctimas de homicidio en 2025' },
  { value: '267', label: 'femicidios registrados' },
  { value: '38%', label: 'de expedientes llegan a sentencia' },
  { value: '3,1', label: 'años promedio hasta firmeza' },
]

export function HeroData() {
  return (
    <div>
      <div className="max-w-[900px]">
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-300 mb-5">
          Observatorio de víctimas · informe 2026
        </p>
        <h1 className="font-display font-extrabold text-white text-[clamp(2.375rem,4.8vw,4rem)] leading-[1.06] tracking-[-0.01em]">
          La mayoría de los homicidios en Argentina no encuentran una respuesta judicial.
        </h1>
        <p className="text-body-lg text-navy-200 mt-5 max-w-[680px]">
          Documentamos, analizamos y exigimos respuestas. El observatorio de Usina de
          Justicia reúne información pública y registros propios para monitorear el
          cumplimiento de la Ley 27.372 en las 24 jurisdicciones.
        </p>
        <div className="mt-7">
          <Button href="/#observatorio" variant="primary" size="lg" className="bg-white text-navy-800 hover:bg-navy-50">
            Explorar el observatorio →
          </Button>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-7 border-t border-white/12 pt-8">
        {stats.map((s) => (
          <div key={s.label}>
            {/* Acento cálido ámbar: números grandes sobre fondo oscuro, contraste AA sobrado */}
            <div className="font-display font-extrabold text-[2.75rem] leading-none text-warning">
              {s.value}
            </div>
            <div className="text-body-sm text-navy-200 mt-2 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
