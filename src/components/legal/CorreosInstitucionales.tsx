import { siteConfig } from '@/lib/site-config'

/** Correo de contacto de la organización. El único que ya usa el sitio. */
export const CORREO_PRINCIPAL = siteConfig.contact.email

/** Contacto secundario, para la misma organización. No reemplaza al principal. */
export const CORREO_SECUNDARIO = 'tecnologia@usinadejusticia.org.ar'

export function CorreosInstitucionales() {
  return (
    <>
      <a href={`mailto:${CORREO_PRINCIPAL}`}>{CORREO_PRINCIPAL}</a> (correo principal) o a{' '}
      <a href={`mailto:${CORREO_SECUNDARIO}`}>{CORREO_SECUNDARIO}</a> (correo secundario)
    </>
  )
}
