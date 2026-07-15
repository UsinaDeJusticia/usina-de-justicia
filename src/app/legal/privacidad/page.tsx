import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos personales de Usina de Justicia.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/legal/privacidad' },
}

export default function PrivacidadPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Legal', href: '/legal/privacidad' },
            { label: 'Política de Privacidad', href: '/legal/privacidad' },
          ]}
        />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          <h1 className="font-display font-extrabold text-ink text-h1 mb-8">Política de Privacidad</h1>
          <p className="text-body-sm text-grey-500 mb-8">
            Última actualización: marzo 2026
          </p>

          <div className="prose prose-lg max-w-none text-grey-700 prose-headings:font-display prose-headings:text-ink prose-h2:text-h3 prose-h2:mt-10 prose-h2:mb-4 prose-a:text-navy-600 hover:prose-a:text-navy-700">
            <h2>Responsable del tratamiento</h2>
            <p>
              Asociación Civil Usina de Justicia, con domicilio en la Ciudad Autónoma
              de Buenos Aires, Argentina, es responsable del tratamiento de los datos
              personales recopilados a través de este sitio web.
            </p>

            <h2>Datos que recopilamos</h2>
            <p>
              Recopilamos los datos personales que nos proporcionás voluntariamente
              a través de nuestro formulario de contacto: nombre, correo electrónico,
              teléfono y el contenido de tu mensaje.
            </p>

            <h2>Finalidad del tratamiento</h2>
            <p>
              Los datos recopilados se utilizan exclusivamente para responder a
              consultas, brindar asistencia y enviar información institucional
              cuando sea solicitada.
            </p>

            <h2>Tus derechos</h2>
            <p>
              En cumplimiento de la Ley 25.326 de Protección de Datos Personales,
              tenés derecho a acceder, rectificar, actualizar y suprimir tus datos
              personales. Para ejercer estos derechos, contactanos a{' '}
              <a href="mailto:info@usinadejusticia.org.ar">info@usinadejusticia.org.ar</a>.
            </p>

            <h2>Seguridad</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tus datos personales contra acceso no autorizado, pérdida
              o destrucción.
            </p>

            <h2>Contacto</h2>
            <p>
              Para cualquier consulta sobre esta política de privacidad, escribinos
              a <a href="mailto:info@usinadejusticia.org.ar">info@usinadejusticia.org.ar</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
