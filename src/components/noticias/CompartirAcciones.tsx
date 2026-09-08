'use client'

// ============================================
// src/components/noticias/CompartirAcciones.tsx
// Las dos acciones de compartir que SÍ necesitan JavaScript, aisladas acá
// para que el resto del bloque (CompartirNota.tsx) siga siendo un componente
// de servidor sin una línea de JS.
//
//  1. "Compartir" del sistema (Web Share API). Es la que abre el menú nativo
//     del celular, y por lejos la más útil de todas: desde ahí se llega a
//     Instagram, Telegram, Signal, Mensajes, Notas — todo lo que un enlace
//     `https://` no puede alcanzar por su cuenta. Solo aparece donde existe.
//
//  2. "Copiar enlace", para pegar donde sea (una historia de Instagram, un
//     grupo de WhatsApp ya abierto, un correo escrito a mano).
//
// Ninguna de las dos carga nada de terceros ni manda una request: son APIs
// del navegador. El costo es un componente cliente chico, y React ya viene
// en la página igual porque Header y Footer también son de cliente.
// ============================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { botonCompartirClasses } from './compartir-estilos'

type Estado = 'inicial' | 'copiado' | 'error'

interface CompartirAccionesProps {
  /** URL canónica absoluta de la nota. */
  url: string
  /** Título de la nota, ya decodificado. */
  titulo: string
}

/** Cuánto queda visible la confirmación de copiado antes de volver al estado normal. */
const MS_CONFIRMACION = 2500

export function CompartirAcciones({ url, titulo }: CompartirAccionesProps) {
  const [estado, setEstado] = useState<Estado>('inicial')
  const [hayCompartirNativo, setHayCompartirNativo] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  // `navigator` no existe mientras Next renderiza en el servidor, así que la
  // detección va después del montaje. Consecuencia buscada: el botón nativo
  // aparece únicamente donde de verdad funciona (celulares, y algunos
  // escritorios) en vez de ofrecer algo que al tocarlo no hace nada.
  useEffect(() => {
    setHayCompartirNativo(typeof navigator.share === 'function')
  }, [])

  // Si alguien navega a otra nota con la confirmación en pantalla, el
  // setState pendiente caería sobre un componente ya desmontado.
  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current)
    }
  }, [])

  const avisar = useCallback((siguiente: Estado) => {
    setEstado(siguiente)
    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setEstado('inicial'), MS_CONFIRMACION)
  }, [])

  const copiar = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      avisar('copiado')
    } catch {
      // Puede fallar por permisos del navegador o por un contexto no seguro
      // (http). Se avisa en vez de dejar el botón mudo: sabiendo que no se
      // copió, la persona puede tomar la URL de la barra de direcciones.
      avisar('error')
    }
  }, [url, avisar])

  const compartirNativo = useCallback(async () => {
    try {
      await navigator.share({ title: titulo, text: titulo, url })
    } catch {
      // Cerrar el menú del sistema sin elegir nada lanza AbortError. No es un
      // fallo: es alguien cambiando de idea. No se informa nada.
    }
  }, [titulo, url])

  return (
    <>
      {hayCompartirNativo && (
        <button
          type="button"
          onClick={compartirNativo}
          aria-label="Compartir con otra aplicación"
          title="Más opciones"
          className={botonCompartirClasses}
        >
          <Share2 className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={copiar}
        aria-label="Copiar el enlace de la nota"
        title="Copiar enlace"
        className={botonCompartirClasses}
      >
        {estado === 'copiado' ? (
          <Check className="w-[18px] h-[18px]" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Copy className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden="true" />
        )}
      </button>

      {/*
        La confirmación se anuncia y se ve. `aria-live="polite"` la lee un
        lector de pantalla sin interrumpir; el texto visible cubre a quien
        solo ve el ícono cambiar por un instante. Con `min-h` fijo para que
        aparecer y desaparecer no mueva la fila.
      */}
      <span
        aria-live="polite"
        className="text-body-sm text-grey-600 min-h-5 flex items-center"
      >
        {estado === 'copiado' && 'Enlace copiado'}
        {estado === 'error' && 'No se pudo copiar'}
      </span>
    </>
  )
}
