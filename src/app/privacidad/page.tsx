import type { Metadata } from 'next'
import { ContenidoPrivacidad } from '@/components/legal/ContenidoPrivacidad'
import { DocumentoLegal } from '@/components/legal/DocumentoLegal'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de privacidad de Usina de Justicia: responsable del tratamiento, datos de los formularios, integración con TikTok y derechos de la Ley 25.326.',
  alternates: { canonical: `${siteConfig.url}/privacidad` },
}

export default function PrivacidadPage() {
  return (
    <DocumentoLegal
      titulo="Política de Privacidad"
      actualizacion="16 de noviembre de 2026"
      breadcrumbs={[{ label: 'Política de Privacidad', href: '/privacidad' }]}
    >
      <ContenidoPrivacidad />
    </DocumentoLegal>
  )
}
