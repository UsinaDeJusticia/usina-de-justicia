import Link from 'next/link'
import Image from 'next/image'
import { Heart, Mail } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const socialIcons: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  twitter: 'X',
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-500 text-white">
      {/* CTA Banner */}
      <div className="bg-accent-500">
        <div className="max-w-content mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-h4 font-semibold">Tu aporte hace la diferencia</h3>
            <p className="text-body-sm text-white/80 mt-1">
              Ayudanos a defender los derechos de las víctimas del delito
            </p>
          </div>
          <Link
            href="/donar"
            className="inline-flex items-center gap-2 bg-white text-accent-500 hover:bg-neutral-100 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Heart className="w-4 h-4" />
            Doná ahora
          </Link>
        </div>
      </div>

      {/* Contenido principal del footer */}
      <div className="max-w-content mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Columna 1: Logo + descripción */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt={siteConfig.name}
                width={160}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-body-sm text-white/70 leading-relaxed">
              Defendemos los derechos de las víctimas del delito en Argentina. 
              Trabajamos por una justicia que escuche, proteja y repare.
            </p>
            {siteConfig.contact.email && (
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-2 mt-4 text-body-sm text-white/80 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                {siteConfig.contact.email}
              </a>
            )}
          </div>

          {/* Columna 2: Institucional */}
          <div>
            <h4 className="text-body font-semibold mb-4">Institucional</h4>
            <ul className="space-y-3">
              {siteConfig.footerNav.institucional.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contenido */}
          <div>
            <h4 className="text-body font-semibold mb-4">Contenido</h4>
            <ul className="space-y-3">
              {siteConfig.footerNav.contenido.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Redes + Legal */}
          <div>
            <h4 className="text-body font-semibold mb-4">Seguinos</h4>
            <div className="flex flex-wrap gap-3 mb-8">
              {Object.entries(siteConfig.social).map(([network, url]) => (
                <a
                  key={network}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-body-sm transition-colors"
                  aria-label={`Seguinos en ${socialIcons[network] || network}`}
                >
                  {(socialIcons[network] || network).charAt(0)}
                </a>
              ))}
            </div>

            <h4 className="text-body font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {siteConfig.footerNav.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-content mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-body-sm text-white/50">
            © {currentYear} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p className="text-body-sm text-white/30">
            Hecho con compromiso por los derechos humanos
          </p>
        </div>
      </div>
    </footer>
  )
}