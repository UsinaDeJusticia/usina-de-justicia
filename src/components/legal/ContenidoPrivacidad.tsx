import Link from 'next/link'
import { CONSERVACION_MESES } from '@/lib/encuentros'
import { CorreosInstitucionales } from '@/components/legal/CorreosInstitucionales'

// Domicilio y CUIT publicados en el schema de la organización
// (src/app/layout.tsx), confirmados con la inscripción ante la IGJ.
// No se inventan otros datos de contacto ni de tratamiento.
const DOMICILIO = 'Basavilbaso 1350, 3° Dto. 311, Ciudad Autónoma de Buenos Aires, Argentina'
const CUIT = '30-71540108-4'

export function ContenidoPrivacidad() {
  return (
    <>
      <h2>Responsable del tratamiento</h2>
      <p>
        Asociación Civil Usina de Justicia (CUIT {CUIT}), con domicilio en {DOMICILIO}, es
        responsable del tratamiento de los datos personales que se recogen a través de este sitio
        web (usinadejusticia.org.ar).
      </p>
      <p>
        Para cualquier consulta sobre esta política o sobre tus datos, escribinos a{' '}
        <CorreosInstitucionales />.
      </p>

      <h2>Datos que trata este sitio</h2>
      <p>
        El sitio trata únicamente los datos que se describen en esta página. No usa herramientas de
        analítica web, ni cookies de seguimiento, ni píxeles publicitarios, y no vende datos
        personales.
      </p>

      <h3>Formulario de contacto</h3>
      <p>
        En <Link href="/contacto">Contacto</Link> podés enviarnos una consulta. El formulario pide
        nombre completo, correo electrónico, asunto y mensaje. El teléfono es opcional. Esos datos
        los completás vos, de manera voluntaria.
      </p>
      <p>
        El mensaje se envía por correo electrónico a Usina de Justicia, a través del proveedor
        Resend, para que podamos responderte. El sitio no arma una base de datos propia con esas
        consultas. Los usamos solo para atender lo que nos escribiste: una consulta, un pedido de
        asistencia, un contacto de prensa o una pregunta sobre donaciones, según el asunto que
        elijas. No los usamos para boletines ni campañas.
      </p>

      <h3>Inscripción a encuentros abiertos</h3>
      <p>
        Cuando te inscribís en un encuentro desde la página <Link href="/encuentros">Encuentros abiertos</Link>{' '}
        te pedimos nombre, apellido, correo electrónico, teléfono de contacto y profesión u
        ocupación. Si querés, podés indicar la institución a la que pertenecés. No te pedimos
        número de documento ni información sobre experiencias personales.
      </p>
      <p>
        Usamos esos datos solo para gestionar tu participación en el encuentro: registrarte,
        enviarte tu enlace individual de acceso y avisarte de cambios en esa actividad. No los
        usamos para campañas, boletines ni otras comunicaciones sin tu autorización expresa e
        independiente.
      </p>
      <p>
        Los encuentros se realizan en Zoom. Al inscribirte, tus datos se registran en la reunión de
        Zoom de Usina de Justicia y Zoom Video Communications, Inc. los procesa como proveedor para
        enviarte la confirmación y el enlace de acceso; ese tratamiento puede implicar
        transferencia a servidores fuera de la Argentina. Nuestro sitio no guarda una copia propia
        de tu inscripción.
      </p>
      <p>
        Conservamos los datos de inscripción hasta {CONSERVACION_MESES} meses después de realizado
        el encuentro y luego los eliminamos de Zoom. Podés pedir antes su eliminación escribiendo a
        los correos indicados al final de esta página.
      </p>
      <p>
        Para limitar intentos repetidos contra el formulario de inscripción, el servidor puede
        tener en cuenta la dirección IP de manera transitoria y solo en memoria. Esas direcciones
        no se registran ni se usan para armar un perfil.
      </p>

      <h3>Donaciones</h3>
      <p>
        La página <Link href="/donar">Doná</Link> publica datos bancarios de la organización y un
        enlace para donar en MercadoPago. El pago en línea se completa en el sitio de MercadoPago.
        Este sitio no recibe ni almacena los datos de la tarjeta ni del pago.
      </p>

      <h3>Búsqueda</h3>
      <p>
        El buscador del sitio usa el texto que escribís solo para mostrar resultados en esa visita.
        No armamos un historial de búsquedas asociado a una persona.
      </p>

      <h2>Integración con TikTok</h2>
      <p>
        Usina de Justicia utiliza una herramienta interna de comunicación que se conecta con la API
        de publicación de contenido de TikTok (Content Posting API). Esa herramienta sirve
        únicamente para subir videos y fotos institucionales propios a la cuenta oficial de Usina
        de Justicia. El material se carga como borrador en la bandeja de esa cuenta, para que el
        equipo lo termine en la aplicación de TikTok. No se usa para publicar en cuentas de
        terceros ni para acceder a la cuenta de TikTok de quienes visitan este sitio.
      </p>
      <p>
        Los datos de TikTok a los que accede la herramienta son la información básica del perfil de
        la cuenta oficial (permiso <em>user.info.basic</em>) y el token de acceso necesario para
        autenticar la subida (permiso <em>video.upload</em>). Esos datos no se venden ni se
        comparten con terceros. Se usan solo para publicar el contenido institucional de Usina de
        Justicia en su cuenta oficial.
      </p>
      <p>
        Si más adelante se habilita la publicación directa desde la herramienta (permiso{' '}
        <em>video.publish</em>), seguirá limitada al mismo fin: el contenido institucional propio
        de la cuenta oficial de Usina de Justicia.
      </p>
      <p>
        El sitio web público no ofrece inicio de sesión con TikTok y no recoge datos de TikTok de
        las personas que lo visitan.
      </p>
      <p>
        El acceso de la aplicación se revoca desde la configuración de TikTok, en la sección de
        seguridad y permisos de las aplicaciones conectadas. Para pedir la eliminación de los datos
        vinculados a esta integración, escribinos a <CorreosInstitucionales />.
      </p>

      <h2>Encargados del tratamiento</h2>
      <p>
        Además de lo ya dicho, los datos del formulario de contacto los procesa Resend para
        entregar el correo a la organización, y los de la inscripción a un encuentro los procesa
        Zoom para enviar el enlace de acceso. No cedemos datos personales a otros terceros ni los
        usamos para una finalidad distinta de la que motivó su recolección.
      </p>

      <h2>Seguridad</h2>
      <p>
        Implementamos medidas de seguridad técnicas y organizativas para proteger los datos
        personales contra acceso no autorizado, pérdida o destrucción.
      </p>

      <h2>Tus derechos</h2>
      <p>
        En cumplimiento de la Ley 25.326 de Protección de Datos Personales, tenés derecho a
        acceder a tus datos en forma gratuita, en intervalos no inferiores a seis meses, salvo que
        acredites un interés legítimo (artículo 14, inciso 3), y a pedir su rectificación,
        actualización o supresión cuando sean inexactos o ya no correspondan (artículo 16).
      </p>
      <p>
        Para ejercer estos derechos, escribinos a <CorreosInstitucionales />. Vamos a responderte
        por ese medio.
      </p>
      <p>
        La Agencia de Acceso a la Información Pública (AAIP) es la autoridad de control de la Ley
        25.326. Tiene a su cargo atender las denuncias y reclamos de quienes consideren afectado su
        derecho por un incumplimiento de las normas de protección de datos personales. Podés
        consultarla en{' '}
        <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer">
          argentina.gob.ar/aaip
        </a>
        .
      </p>

      <h2>Cambios de esta política</h2>
      <p>
        Si actualizamos esta política, vamos a publicar la versión nueva en esta página e indicar
        la fecha de la última modificación.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier consulta sobre esta política de privacidad, escribinos a{' '}
        <CorreosInstitucionales />.
      </p>
    </>
  )
}
