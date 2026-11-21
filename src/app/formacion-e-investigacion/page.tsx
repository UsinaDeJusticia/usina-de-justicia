import { WorkArea } from '@/components/layout/WorkArea'
import { generatePageMetadata } from '@/lib/metadata'
import { siteConfig } from '@/lib/site-config'

const title = 'Formación e investigación'
const path = '/formacion-e-investigacion'
const description = 'El Instituto de Victimología de Usina de Justicia (IVUJUS) promueve la formación, la investigación y la difusión en victimología penal y derechos de las víctimas.'

export const metadata = generatePageMetadata({ title, path, description })

const links = [
  {
    label: 'Conocer el IVUJUS',
    href: siteConfig.externalLinks.ivujus,
    description: 'Conocé el trabajo y el equipo del Instituto de Victimología de Usina de Justicia.',
  },
  {
    label: 'Cursos y diplomatura',
    href: 'https://ivujus.org.ar/es/formacion',
    description: 'Consultá la oferta de formación y el archivo de jornadas y capacitaciones.',
  },
  {
    label: 'Publicaciones del instituto',
    href: 'https://ivujus.org.ar/es/publicaciones',
    description: 'Explorá los libros, documentos y otros materiales del IVUJUS.',
  },
  {
    label: 'Eventos académicos',
    href: 'https://ivujus.org.ar/es/simposios',
    description: 'Encontrá información sobre congresos, simposios y jornadas.',
  },
]

export default function FormacionInvestigacionPage() {
  return <WorkArea title={title} path={path} description={description} links={links} />
}
