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

  const { nombre, email, asunto, mensaje, telefono } = body

  if (!isNonEmptyString(nombre) || !isNonEmptyString(email) || !isNonEmptyString(mensaje)) {
    return NextResponse.json(
      { sent: false, error: 'Nombre, email y mensaje son obligatorios.' },
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
        // Requiere un dominio verificado en Resend para salir desde
        // contacto@usinadejusticia.org.ar — hasta que Emanuel lo verifique,
        // Resend rechaza el envío o lo hace desde su dominio de pruebas.
        from: `Formulario de contacto — Usina de Justicia <contacto@${new URL(siteConfig.url).hostname}>`,
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
      const detail = await resendResponse.text().catch(() => '')
      console.error('[/api/contact] Resend devolvió un error:', resendResponse.status, detail)
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
