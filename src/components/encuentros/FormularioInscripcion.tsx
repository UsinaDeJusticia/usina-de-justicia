'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  LIMITES,
  validarInscripcion,
  type Campo,
  type EstadoInscripcion,
} from '@/lib/encuentros'

type Errores = Partial<Record<Campo | 'confirmacion', string>>

const VACIO = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  profesion: '',
  institucion: '',
  // Campo trampa contra envíos automatizados (ver /api/contact).
  sitioWeb: '',
}

const CAMPOS_VISIBLES: Array<{
  campo: Campo
  etiqueta: string
  tipo: string
  autoComplete: string
  obligatorio: boolean
  ayuda?: string
}> = [
  { campo: 'nombre', etiqueta: 'Nombre', tipo: 'text', autoComplete: 'given-name', obligatorio: true },
  { campo: 'apellido', etiqueta: 'Apellido', tipo: 'text', autoComplete: 'family-name', obligatorio: true },
  { campo: 'email', etiqueta: 'Correo electrónico', tipo: 'email', autoComplete: 'email', obligatorio: true },
  {
    campo: 'telefono',
    etiqueta: 'Teléfono de contacto',
    tipo: 'tel',
    autoComplete: 'tel',
    obligatorio: true,
    ayuda: 'Con característica. Ej.: 11 1234-5678 o +54 9 11 1234-5678.',
  },
  {
    campo: 'profesion',
    etiqueta: 'Profesión u ocupación',
    tipo: 'text',
    autoComplete: 'organization-title',
    obligatorio: true,
    ayuda: 'Por ejemplo: estudiante, abogada, comerciante, jubilado, empleada.',
  },
  {
    campo: 'institucion',
    etiqueta: 'Institución u organización',
    tipo: 'text',
    autoComplete: 'organization',
    obligatorio: false,
    ayuda: 'Opcional. Completalo solo si participás en representación de una.',
  },
]

const MENSAJE_ESTADO: Record<Exclude<EstadoInscripcion, 'abiertas'>, string> = {
  proximamente:
    'La inscripción se habilitará cuando confirmemos la fecha y el horario del encuentro.',
  cerradas: 'La inscripción para este encuentro está cerrada.',
  sin_encuentro: 'No hay un encuentro con inscripción abierta en este momento.',
}

const inputBase =
  'w-full px-4 py-3 rounded-xs border bg-white text-body text-ink focus:outline-hidden focus:ring-2 focus:ring-navy-300 focus:border-navy-600 transition-colors duration-base ease-out disabled:bg-grey-50 disabled:cursor-not-allowed'

export function FormularioInscripcion({
  encuentroId,
  estado,
}: {
  encuentroId: string
  estado: EstadoInscripcion
}) {
  const [datos, setDatos] = useState(VACIO)
  const [confirmacion, setConfirmacion] = useState(false)
  const [errores, setErrores] = useState<Errores>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<'inscripto' | 'ya_inscripto' | null>(null)

  // Hasta que React hidrata, el formulario queda desactivado: un envío
  // nativo (sin JavaScript todavía) haría un GET con los datos personales
  // en la URL, que quedaría en el historial y en los registros de acceso.
  const [hidratado, setHidratado] = useState(false)
  useEffect(() => setHidratado(true), [])

  const abierta = estado === 'abiertas'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value }))
    if (errores[name as Campo]) setErrores((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!abierta || enviando) return
    setErrorGeneral(null)

    const validacion = validarInscripcion({ ...datos, confirmacion })
    if (!validacion.ok) {
      setErrores(validacion.errores)
      return
    }

    setEnviando(true)
    try {
      const respuesta = await fetch('/api/encuentros/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datos, confirmacion, encuentroId }),
      })
      const cuerpo = (await respuesta.json().catch(() => null)) as
        | { ok: true; estado: 'inscripto' | 'ya_inscripto' }
        | { ok: false; error?: string; errores?: Errores }
        | null

      if (respuesta.ok && cuerpo?.ok) {
        setResultado(cuerpo.estado)
        return
      }
      // Error: los datos quedan en el formulario, nunca se simula éxito.
      if (cuerpo && !cuerpo.ok && cuerpo.errores) setErrores(cuerpo.errores)
      setErrorGeneral(
        (cuerpo && !cuerpo.ok && cuerpo.error) ||
          'No pudimos completar tu inscripción. Tus datos siguen en el formulario: volvé a intentarlo en unos minutos.'
      )
    } catch {
      setErrorGeneral(
        'No pudimos conectarnos para completar tu inscripción. Revisá tu conexión: tus datos siguen en el formulario.'
      )
    } finally {
      setEnviando(false)
    }
  }

  if (resultado) {
    return (
      <div
        className="bg-success-bg border border-grey-200 rounded-xs p-6 md:p-8 text-center"
        role="status"
      >
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" aria-hidden="true" />
        <h2 className="font-display font-bold text-h3 text-ink mb-2">
          {resultado === 'inscripto' ? '¡Listo, ya estás inscripto/a!' : 'Ya estabas inscripto/a'}
        </h2>
        <p className="text-body text-grey-700 mb-2">
          {resultado === 'inscripto'
            ? `Te enviamos un correo a ${datos.email} con tu enlace individual para ingresar al encuentro.`
            : `Ya hay una inscripción con ${datos.email} para este encuentro. Tu enlace individual está en el correo de confirmación que recibiste.`}
        </p>
        <p className="text-body-sm text-grey-700 m-0">
          Si no lo encontrás, revisá la carpeta de correo no deseado. El enlace es personal: no lo
          compartas.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-grey-200 rounded-xs p-6 md:p-8">
      <h2 className="font-display font-bold text-h3 text-ink mb-2">Inscribite para participar</h2>
      <p className="text-body text-grey-700 mb-6">
        Completá el formulario para recibir tu invitación y participar del encuentro.
      </p>

      {!abierta && (
        <div
          className="flex items-start gap-3 p-4 mb-6 rounded-xs bg-info-bg border border-navy-200 text-body-sm text-ink"
          role="status"
        >
          <AlertCircle className="w-5 h-5 text-navy-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="m-0">{MENSAJE_ESTADO[estado as Exclude<EstadoInscripcion, 'abiertas'>]}</p>
        </div>
      )}

      <form noValidate method="post" onSubmit={handleSubmit}>
        <fieldset disabled={!abierta || !hidratado || enviando} className="space-y-5 border-0 p-0 m-0 min-w-0">
          <legend className="sr-only">Datos para la inscripción</legend>
          <div className="grid sm:grid-cols-2 gap-5">
            {CAMPOS_VISIBLES.map(({ campo, etiqueta, tipo, autoComplete, obligatorio, ayuda }) => {
              const error = errores[campo]
              const idAyuda = ayuda ? `${campo}-ayuda` : undefined
              const idError = error ? `${campo}-error` : undefined
              return (
                <div key={campo} className={campo === 'email' || campo === 'institucion' ? 'sm:col-span-2' : undefined}>
                  <label htmlFor={campo} className="block text-body-sm font-bold text-grey-700 mb-1.5">
                    {etiqueta}
                    {obligatorio ? <span aria-hidden="true"> *</span> : <span className="font-normal"> (opcional)</span>}
                  </label>
                  <input
                    id={campo}
                    name={campo}
                    type={tipo}
                    autoComplete={autoComplete}
                    required={obligatorio}
                    maxLength={LIMITES[campo]}
                    value={datos[campo]}
                    onChange={handleChange}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={[idError, idAyuda].filter(Boolean).join(' ') || undefined}
                    className={`${inputBase} ${error ? 'border-danger' : 'border-grey-300'}`}
                  />
                  {error && (
                    <p id={idError} className="text-body-sm text-danger mt-1.5 mb-0">
                      {error}
                    </p>
                  )}
                  {ayuda && (
                    <p id={idAyuda} className="text-[13px] text-grey-600 mt-1 mb-0">
                      {ayuda}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Campo trampa: fuera de pantalla, sin foco, ignorado por lectores de pantalla. */}
          <input
            type="text"
            name="sitioWeb"
            value={datos.sitioWeb}
            onChange={(e) => setDatos((prev) => ({ ...prev, sitioWeb: e.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] w-px h-px opacity-0"
          />

          <div>
            <label className="flex items-start gap-3 text-body-sm text-grey-700 cursor-pointer">
              <input
                type="checkbox"
                name="confirmacion"
                checked={confirmacion}
                onChange={(e) => {
                  setConfirmacion(e.target.checked)
                  if (errores.confirmacion) setErrores((prev) => ({ ...prev, confirmacion: undefined }))
                }}
                aria-invalid={errores.confirmacion ? true : undefined}
                aria-describedby={errores.confirmacion ? 'confirmacion-error' : undefined}
                className="mt-1 h-4 w-4 shrink-0 accent-navy-600"
              />
              <span>
                Confirmo que los datos proporcionados son correctos y que deseo inscribirme en este
                encuentro. *
              </span>
            </label>
            {errores.confirmacion && (
              <p id="confirmacion-error" className="text-body-sm text-danger mt-1.5 mb-0">
                {errores.confirmacion}
              </p>
            )}
          </div>

          <p className="text-[13px] text-grey-600 m-0">
            Usamos tus datos solo para gestionar tu participación en este encuentro. La inscripción
            se procesa a través de Zoom, que te envía el enlace de acceso. No los usamos para
            campañas ni boletines. Más información en nuestra{' '}
            <Link href="/legal/privacidad" className="text-navy-600 underline hover:text-navy-700">
              política de privacidad
            </Link>
            .
          </p>

          {errorGeneral && (
            <div
              className="flex items-start gap-3 p-4 rounded-xs bg-warning-bg border border-warning text-body-sm text-ink"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <p className="m-0">{errorGeneral}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full">
            {enviando ? (
              'Enviando inscripción…'
            ) : (
              <>
                Confirmar inscripción
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </Button>

          <p className="flex items-center gap-2 text-[13px] text-grey-600 m-0">
            <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
            Recibirás por correo tu enlace individual para ingresar al encuentro.
          </p>
        </fieldset>
      </form>
    </div>
  )
}
