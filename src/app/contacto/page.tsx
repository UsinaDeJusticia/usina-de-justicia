'use client'

import { useState } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
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
    // Por ahora simula envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setEnviado(true)
    setEnviando(false)
  }

  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Contacto', href: '/contacto' }]} />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info de contacto */}
            <div className="lg:col-span-2">
              <h1 className="text-h1 lg:text-display mb-4">Contactanos</h1>
              <p className="text-body-lg text-neutral-600 mb-8">
                Estamos para ayudarte. Si sos víctima de un delito o necesitás
                orientación, no dudes en comunicarte con nosotros.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-body font-medium text-neutral-900">Email</p>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-body text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                {siteConfig.contact.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-body font-medium text-neutral-900">Teléfono</p>
                      <a
                        href={`tel:${siteConfig.contact.phone}`}
                        className="text-body text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Redes */}
              <div className="mt-10 pt-8 border-t border-neutral-200">
                <p className="text-body font-medium text-neutral-900 mb-4">
                  Seguinos en redes
                </p>
                <div className="flex gap-3">
                  {Object.entries(siteConfig.social).map(([network, url]) => (
                    <a
                      key={network}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg border border-neutral-200 text-body-sm text-neutral-600 hover:border-primary-500 hover:text-primary-500 transition-colors capitalize"
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
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-h3 text-neutral-900 mb-2">Mensaje enviado</h2>
                  <p className="text-body text-neutral-600">
                    Gracias por contactarnos. Te responderemos a la brevedad.
                  </p>
                  <button
                    onClick={() => {
                      setEnviado(false)
                      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
                    }}
                    className="mt-6 text-body-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-xl p-6 lg:p-8">
                  <h2 className="text-h3 mb-6">Envianos tu consulta</h2>

                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="nombre" className="block text-body-sm font-medium text-neutral-700 mb-1.5">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          required
                          value={formData.nombre}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-body focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-body-sm font-medium text-neutral-700 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-body focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="telefono" className="block text-body-sm font-medium text-neutral-700 mb-1.5">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-body focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                          placeholder="11 XXXX-XXXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="asunto" className="block text-body-sm font-medium text-neutral-700 mb-1.5">
                          Asunto *
                        </label>
                        <select
                          id="asunto"
                          name="asunto"
                          required
                          value={formData.asunto}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-body focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
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
                      <label htmlFor="mensaje" className="block text-body-sm font-medium text-neutral-700 mb-1.5">
                        Mensaje *
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        rows={5}
                        value={formData.mensaje}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-body focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors resize-vertical"
                        placeholder="Contanos cómo podemos ayudarte..."
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={enviando}
                      className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      {enviando ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar mensaje
                        </>
                      )}
                    </button>
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