import Link from 'next/link'
import { CorreosInstitucionales } from '@/components/legal/CorreosInstitucionales'

export function ContenidoTerminos() {
  return (
    <>
      <h2>Aceptación de los términos</h2>
      <p>
        Al acceder y utilizar el sitio web de Usina de Justicia (usinadejusticia.org.ar), aceptás
        los presentes términos y condiciones de uso. Si no estás de acuerdo, te pedimos que no
        utilices el sitio. El tratamiento de los datos personales se rige por la{' '}
        <Link href="/privacidad">Política de Privacidad</Link>.
      </p>

      <h2>Uso del sitio</h2>
      <p>
        El sitio informa sobre el trabajo de Asociación Civil Usina de Justicia y permite escribirnos,
        consultar materiales públicos y, cuando hay convocatoria, inscribirse en encuentros
        abiertos. Quien lo usa se compromete a hacerlo de buena fe, a brindar datos veraces cuando
        completa un formulario y a no emplear el sitio para actividades ilícitas ni para afectar su
        funcionamiento.
      </p>
      <p>
        La información publicada es de carácter general e institucional. No constituye
        asesoramiento legal sobre un caso concreto. Para una consulta específica, escribinos por{' '}
        <Link href="/contacto">Contacto</Link>.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, imágenes, logos, piezas audiovisuales y documentos publicados en este sitio son
        propiedad de Asociación Civil Usina de Justicia o de sus respectivos autores, y están
        protegidos por las leyes de propiedad intelectual vigentes en la República Argentina.
      </p>
      <p>
        El contenido puede utilizarse con fines informativos y educativos, siempre que se cite la
        fuente y no se altere su sentido. Quedan prohibidas la reproducción con fines comerciales y
        el uso del nombre o del logo de Usina de Justicia sin autorización previa de la
        organización.
      </p>

      <h2>Enlaces a terceros</h2>
      <p>
        El sitio incluye enlaces a páginas de terceros, entre ellas el sitio de donaciones de
        MercadoPago, el sitio de IVUJUS y las redes sociales de la organización. Esos sitios tienen
        sus propios términos y políticas de privacidad. Usina de Justicia no controla su contenido
        ni responde por él. La inclusión de un enlace no implica respaldo de todo lo que ese sitio
        publique.
      </p>

      <h2>Limitación de responsabilidad</h2>
      <p>
        Procuramos que la información del sitio sea clara y esté actualizada, pero no garantizamos
        que esté libre de errores ni que el sitio funcione sin interrupciones. En la máxima medida
        permitida por la ley argentina, Usina de Justicia no responde por daños derivados del uso
        del sitio, de la imposibilidad de acceder a él o de la confianza depositada en un sitio de
        terceros enlazado desde estas páginas.
      </p>
      <p>
        Nada de lo publicado reemplaza la consulta con un abogado o con el organismo competente
        cuando la situación lo requiere.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia
        relacionada con el uso del sitio se somete a los tribunales ordinarios de la Ciudad
        Autónoma de Buenos Aires, salvo norma de orden público que disponga otro fuero.
      </p>

      <h2>Modificaciones</h2>
      <p>
        Nos reservamos el derecho de modificar estos términos. Las modificaciones entran en vigencia
        desde su publicación en esta página, donde se indica la fecha de la última actualización.
      </p>

      <h2>Contacto</h2>
      <p>
        Para consultas sobre estos términos, escribinos a <CorreosInstitucionales />.
      </p>
    </>
  )
}
