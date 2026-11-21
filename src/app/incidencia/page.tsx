import { WorkArea } from '@/components/layout/WorkArea'
import { generatePageMetadata } from '@/lib/metadata'

const title = 'Incidencia en políticas públicas'
const path = '/incidencia'
const description = 'Usina de Justicia participa en debates parlamentarios y presentaciones judiciales para defender los derechos de las víctimas del delito. Su trabajo incluye proyectos de ley, intervenciones como amicus curiae y el seguimiento de la aplicación de la Ley 27.372.'

export const metadata = generatePageMetadata({ title, path, description })

const links = [
  {
    label: 'Propuestas y presentaciones',
    href: '/noticias/categoria/incidencia',
    description: 'Publicaciones sobre proyectos de ley, amicus curiae y otras intervenciones de Usina de Justicia.',
  },
  {
    label: 'Informes y recursos',
    href: '/recursos',
    description: 'Documentos sobre derechos de las víctimas, justicia penal y políticas públicas.',
  },
  {
    label: 'Archivo de publicaciones',
    href: '/observatorio',
    description: 'Material histórico de Usina de Justicia sobre la justicia penal y los derechos de las víctimas.',
  },
]

export default function IncidenciaPage() {
  return <WorkArea title={title} path={path} description={description} links={links} />
}
