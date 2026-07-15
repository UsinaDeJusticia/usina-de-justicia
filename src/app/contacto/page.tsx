'use client'

import { useState } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Mail, Phone, Send, CheckCircle } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    // TODO: Conectar con API endpoint /api/contact
    // Decisión Fase 3 (Ola 5): se mantiene simulado. Conectar envío real
    // requiere elegir un servicio de email (Resend/SendGrid/etc.) y su API
    // key — pendiente para Emanuel.
    // Por ahora simula envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setEnviado(true)
    setEnviando(false)
  }

  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Contacto', href: '/contacto' }]} />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info de contacto */}
            <div className="lg:col-span-2">
              <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
                Usina de Justicia
              </p>
              <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
                Contactanos
              </h1>
              <p className="text-body-lg text-grey-700 mb-8 leading-relaxed">
                Estamos para ayudarte. Si sos víctima de un delito o necesitás
                orientación, no dudes en comunicarte con nosotros.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-body font-bold text-ink">Email</p>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-body text-navy-600 hover:text-navy-700 transition-colors duration-base ease-out"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                {siteConfig.contact.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-body font-bold text-ink">Teléfono</p>
                      <a
                        href={`tel:${siteConfig.contact.phone}`}
                        className="text-body text-navy-600 hover:text-navy-700 transition-colors duration-base ease-out"
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Redes */}
              <div className="mt-10 pt-8 border-t border-grey-200">
                <p className="text-body font-bold text-ink mb-4">
                  Seguinos en redes
                </p>
                <div className="flex gap-3">
                  {Object.entries(siteConfig.social).map(([network, url]) => (
                    <a
                      key={network}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xs border border-grey-200 text-body-sm text-grey-700 hover:border-navy-600 hover:text-navy-600 transition-colors duration-base ease-out capitalize"
                    >
                      {network === 'twitter' ? 'X' : network}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-3">
              {enviado ? (
                <div className="bg-success-bg border border-grey-200 rounded-xs p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" aria-hidden="true" />
                  <h2 className="font-display font-bold text-h3 text-ink mb-2">Mensaje enviado</h2>
                  <p className="text-body text-grey-700">
                    Gracias por contactarnos. Te responderemos a la brevedad.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-6"
                    onClick={() => {
                      setEnviado(false)
                      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
                    }}
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <div className="bg-ivory border border-grey-200 rounded-xs p-6 lg:p-8">
                  <h2 className="font-display font-bold text-h3 text-ink mb-6">Envianos tu consulta</h2>

                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="nombre" className="block text-body-sm font-bold text-grey-700 mb-1.5">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          required
                          value={formData.nombre}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xs border border-grey-300 bg-white text-body text-ink focus:outline-hidden focus:ring-2 focus:ring-navy-300 focus:border-navy-600 transition-colors duration-base ease-out"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-body-sm font-bold text-grey-700 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xs border border-grey-300 bg-white text-body text-ink focus:outline-hidden focus:ring-2 focus:ring-navy-300 focus:border-navy-600 transition-colors duration-base ease-out"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="telefono" className="block text-body-sm font-bold text-grey-700 mb-1.5">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xs border border-grey-300 bg-white text-body text-ink focus:outline-hidden focus:ring-2 focus:ring-navy-300 focus:border-navy-600 transition-colors duration-base ease-out"
                          placeholder="11 XXXX-XXXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="asunto" className="block text-body-sm font-bold text-grey-700 mb-1.5">
                          Asunto *
                        </label>
                        <select
                          id="asunto"
                          name="asunto"
                          required
                          value={formData.asunto}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xs border border-grey-300 bg-white text-body text-ink focus:outline-hidden focus:ring-2 focus:ring-navy-300 focus:border-navy-600 transition-colors duration-base ease-out"
                        >
                          <option value="">Seleccioná un asunto</option>
                          <option value="consulta-general">Consulta general</option>
                          <option value="asistencia-victimas">Asistencia a víctimas</option>
                          <option value="prensa">Prensa</option>
                          <option value="donaciones">Donaciones</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mensaje" className="block text-body-sm font-bold text-grey-700 mb-1.5">
                        Mensaje *
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        rows={5}
                        value={formData.mensaje}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xs border border-grey-300 bg-white text-body text-ink focus:outline-hidden focus:ring-2 focus:ring-navy-300 focus:border-navy-600 transition-colors duration-base ease-out resize-vertical"
                        placeholder="Contanos cómo podemos ayudarte..."
                      />
                    </div>

                    <Button type="button" variant="primary" size="lg" disabled={enviando} onClick={handleSubmit}>
                      {enviando ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
