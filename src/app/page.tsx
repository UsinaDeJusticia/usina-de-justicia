import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const metadata = generatePageMetadata({
  title: 'Defensa de los derechos de las víctimas del delito',
  description: 'Usina de Justicia es una organización dedicada a defender los derechos de las víctimas del delito en Argentina.',
  path: '/',
})

export default function Home() {
  return (
    <div>
      <section className="bg-primary-500 text-white py-20">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-display mb-6">
            Defensa de los derechos de las víctimas del delito
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mb-8">
            Trabajamos para garantizar que las víctimas del delito tengan acceso a la justicia, 
            la protección y el acompañamiento que merecen.
          </p>
          <div className="flex gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-500 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Contactanos
            </Link>
            <Link
              href="/donar"
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
            >
              Donar
            </Link>
          </div>
        </div>
      </section>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 mb-4">Nuestra misión</h2>
          <p className="text-body-lg text-neutral-600 max-w-3xl">
            Usina de Justicia es una organización no gubernamental dedicada a la defensa 
            de los derechos de las víctimas del delito. Trabajamos para que cada víctima 
            tenga acceso efectivo a la justicia, reciba acompañamiento y pueda ejercer sus derechos.
          </p>
        </div>
      </section>

      <section className="py-section bg-neutral-50">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 mb-12 text-center">Nuestros programas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Asistencia a Víctimas', desc: 'Acompañamiento y orientación legal' },
              { title: 'Reformas Legislativas', desc: 'Trabajo por mejores leyes' },
              { title: 'Capacitación', desc: 'Formación para operadores jurídicos' },
              { title: 'Litigio Estratégico', desc: 'Casos paradigmáticos' },
            ].map((programa) => (
              <div key={programa.title} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h3 className="text-h4 mb-2">{programa.title}</h3>
                <p className="text-body text-neutral-600">{programa.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/programas" className="text-primary-500 font-medium hover:underline">
              Ver todos los programas →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 mb-8">Últimas noticias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-neutral-200 rounded-lg p-6">
              <p className="text-sm text-neutral-500 mb-2">Noticias</p>
              <h3 className="text-h4 mb-2">Próximamente...</h3>
              <p className="text-body text-neutral-600">Noticias y actualizaciones de nuestra organización.</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/blog" className="text-primary-500 font-medium hover:underline">
              Ver todas las noticias →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-500 text-white text-center">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-h1 mb-4">Apoyá nuestra causa</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Tu aporte nos permite continuar trabajando por la justicia para las víctimas del delito.
          </p>
          <Link
            href="/donar"
            className="inline-flex items-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            Donar ahora
          </Link>
        </div>
      </section>
    </div>
  )
}
