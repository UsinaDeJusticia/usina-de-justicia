import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'

// ============================================
// POST /api/contact
// Envío real del formulario de /contacto vía la API HTTP de Resend
// (https://resend.com/docs/api-reference/emails/send-email) — sin SDK,
// mismo estilo minimalista que /api/revalidate (fetch nativo, sin deps
// nuevas). Requiere la variable de entorno RESEND_API_KEY, seteada por
// Emanuel en el entorno de Claude Code (nunca en el repo ni en el chat).
//
// Decisión de diseño: si RESEND_API_KEY no está configurada, este
// endpoint responde 503 con un mensaje claro — NUNCA simula un envío
// exitoso. El frontend (src/app/contacto/page.tsx) muestra en ese caso un
// estado de error con el email de contacto real como alternativa, en vez
// de un falso "mensaje enviado" que dejaría a alguien esperando una
// respuesta que nunca va a llegar.
// ============================================

interface ContactBody {
  nombre?: string
  email?: string
  telefono?: string
  asunto?: string
  mensaje?: string
  /**
   * Campo trampa. No se muestra en el formulario y una persona nunca lo
   * completa; un robot que rellena todo lo que encuentra, sí. Se llama
   * `sitioWeb` justamente porque suena a campo legítimo.
   */
  sitioWeb?: string
}

const ASUNTOS: Record<string, string> = {
  'consulta-general': 'Consulta general',
  'asistencia-victimas': 'Asistencia a víctimas',
  prensa: 'Prensa',
  donaciones: 'Donaciones',
  otro: 'Otro',
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export async function POST(request: Request) {
  let body: ContactBody
  try {
    body = (await request.json()) as ContactBody
  } catch {
    return NextResponse.json(
      { sent: false, error: 'Cuerpo de la solicitud inválido.' },
      { status: 400 }
    )
  }

  const { nombre, email, asunto, mensaje, telefono, sitioWeb: campoTrampa } = body

  if (!isNonEmptyString(nombre) || !isNonEmptyString(email) || !isNonEmptyString(mensaje)) {
    return NextResponse.json(
      { sent: false, error: 'Nombre, email y mensaje son obligatorios.' },
      { status: 400 }
    )
  }

  // Campo trampa: está oculto en el formulario, así que una persona nunca lo
  // completa y un robot que rellena todo lo que encuentra, sí. Se responde
  // 200 a propósito, sin enviar nada: si devolviéramos un error, quien
  // automatiza el abuso se daría cuenta y ajustaría el script.
  if (isNonEmptyString(campoTrampa)) {
    return NextResponse.json({ sent: true })
  }

  // Topes de longitud antes de gastar la llamada a Resend. Sin esto, un
  // mensaje de varios megabytes viaja entero al proveedor y consume la cuota
  // igual. Los valores son holgados para un formulario de contacto real.
  const excedidos = [
    ['nombre', nombre, 120],
    ['email', email, 254],
    ['asunto', typeof asunto === 'string' ? asunto : '', 200],
    ['mensaje', mensaje, 5000],
    ['teléfono', typeof telefono === 'string' ? telefono : '', 40],
  ].find(([, valor, tope]) => (valor as string).length > (tope as number))

  if (excedidos) {
    return NextResponse.json(
      { sent: false, error: `El campo ${excedidos[0]} es demasiado largo.` },
      { status: 400 }
    )
  }

  // Validación de forma, no de existencia: sirve para descartar basura
  // evidente antes de llamar al proveedor. Un email sintácticamente válido
  // puede no existir igual, y eso no lo resuelve ningún regex.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { sent: false, error: 'El email no parece válido.' },
      { status: 400 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // No inventamos un envío que no ocurrió: 503 explícito, sin loguear
    // datos personales del formulario.
    console.error(
      '[/api/contact] RESEND_API_KEY no está configurada — no se puede enviar el mensaje.'
    )
    return NextResponse.json(
      {
        sent: false,
        error:
          'El envío automático todavía no está activado. Escribinos directamente a ' +
          siteConfig.contact.email,
      },
      { status: 503 }
    )
  }

  const asuntoLabel = (asunto && ASUNTOS[asunto]) || 'Consulta general'

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // El dominio verificado en Resend es el apex "usinadejusticia.org.ar"
        // (sin "www."). siteConfig.url usa el subdominio "www." para el
        // sitio público — son dominios distintos para la verificación DKIM/SPF
        // de Resend, así que se saca el "www." acá en vez de derivarlo
        // directo del hostname del sitio (bug real: la primera versión de
        // este endpoint mandaba desde "www.usinadejusticia.org.ar", que
        // Resend rechazaba con 403 por no estar verificado ese subdominio).
        from: `Formulario de contacto — Usina de Justicia <contacto@${new URL(siteConfig.url).hostname.replace(/^www\./, '')}>`,
        to: [siteConfig.contact.email],
        reply_to: email,
        subject: `[${asuntoLabel}] Nuevo mensaje de ${nombre}`,
        text: [
          `Nombre: ${nombre}`,
          `Email: ${email}`,
          telefono ? `Teléfono: ${telefono}` : null,
          `Asunto: ${asuntoLabel}`,
          '',
          mensaje,
        ]
          .filter(Boolean)
          .join('\n'),
      }),
    })

    if (!resendResponse.ok) {
      // Solo el código. El cuerpo del error de Resend suele repetir el campo
      // que falló —o sea, el email de quien escribió— y este archivo dice
      // explícitamente que no se loguean datos personales del formulario.
      console.error('[/api/contact] Resend devolvió un error:', resendResponse.status)
      return NextResponse.json(
        {
          sent: false,
          error:
            'No pudimos enviar tu mensaje en este momento. Escribinos directamente a ' +
            siteConfig.contact.email,
        },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('[/api/contact] Error de red hacia Resend:', error)
    return NextResponse.json(
      {
        sent: false,
        error:
          'No pudimos enviar tu mensaje en este momento. Escribinos directamente a ' +
          siteConfig.contact.email,
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ sent: true })
}

export async function GET() {
  return NextResponse.json({ sent: false }, { status: 405 })
}
