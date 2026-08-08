import type { Guia } from '@/types'

// Contenido de la serie "Guías para la etapa que estás viviendo" — fuente
// única y trazada: docs/COPY-acompanamiento-guias.md. Cada guía sale de:
// 1. [LUCRE-DOC] — "La Ejecución de la Pena en la provincia de Buenos Aires",
//    documento propio de Usina ya redactado para compartirse.
// 2. [REUNION-SINTESIS] — únicamente los 10 puntos ya abstraídos de la
//    síntesis final de una reunión interna (30-jul-2026), sin ningún dato
//    de caso, nombre o cifra no verificable.
// Es un array a propósito: la serie va a crecer y esta página no debe
// hardcodear "la única guía que existe".
export const guias: Guia[] = [
  {
    slug: 'ejecucion-de-la-pena-pba',
    numeroSerie: 1,
    titulo: 'Tus derechos durante la ejecución de la pena — Provincia de Buenos Aires',
    bajada:
      'Cuando la condena queda firme, empieza una etapa nueva y menos conocida del proceso: la ejecución de la pena. Esta guía resume qué pasa en esa etapa y qué herramientas tenés para participar activamente.',
    secciones: [
      {
        id: 'que-es',
        titulo: 'Qué es la ejecución de la pena',
        parrafos: [
          'La ejecución de la pena es la etapa donde se controla el cumplimiento de la condena. Empieza cuando la sentencia queda firme, es decir, cuando ya se agotaron todas las instancias de apelación. A partir de ese momento interviene el juez de ejecución penal.',
          'El juez de ejecución no modifica el monto de la pena impuesta en la sentencia: solo controla cómo se cumple.',
          'Mientras la sentencia todavía no está firme (hay una apelación en trámite), quien controla el cumplimiento es el mismo tribunal que dictó la condena — no el juez de ejecución.',
        ],
      },
      {
        id: 'egresos',
        titulo: 'Los egresos: qué son y de qué tipo',
        parrafos: ['Durante la condena, la persona detenida puede solicitar distintos tipos de egresos.'],
        listas: [
          {
            titulo: 'Egresos transitorios (implican volver a la cárcel)',
            items: [
              'Salidas transitorias: de 12, 24, 48 o 72 horas. Su finalidad es afianzar lazos afectivos reales.',
              'Semilibertad: para trabajar o estudiar.',
            ],
          },
          {
            titulo: 'Egresos definitivos',
            items: [
              'Libertad asistida: se puede pedir desde seis meses antes del vencimiento de la condena o de la fecha de libertad condicional.',
              'Libertad condicional: se puede pedir cumplidas dos terceras partes de la condena.',
            ],
          },
        ],
        notaFinal:
          'Qué mirar antes de que se resuelva un egreso: para que se otorgue se evalúan, entre otros, el tiempo cumplido de condena, la conducta (sin sanciones disciplinarias) y el pronóstico de reinserción social, según los informes del Servicio Penitenciario.',
      },
    ],
    acciones: [
      {
        id: 'datos-contacto',
        texto:
          'Dejá tus datos de contacto (teléfono, domicilio, correo electrónico) en el tribunal cuando se dicte la sentencia, y pedí expresamente cómo querés ser notificada o notificado.',
      },
      {
        id: 'presentacion-juzgado',
        texto:
          'Presentate en el juzgado de ejecución y pedí que tomen un acta de tu presentación. Si tus datos cambian, actualizalos ahí mismo.',
      },
      {
        id: 'resguardo-datos',
        texto:
          'Pedí el resguardo y la reserva de tus datos como víctima desde el momento en que la causa pasa a ejecución. No hace falta abogado para esta presentación.',
      },
      {
        id: 'cambios-alojamiento',
        texto:
          'Prestá atención a los cambios de alojamiento de la persona condenada y pedí que te expliquen el motivo.',
      },
      {
        id: 'oponerse-formalmente',
        texto:
          'Podés oponerte formalmente a una salida transitoria, una libertad asistida o una libertad condicional, cuestionando si se cumple la finalidad real, el pronóstico de reinserción o la falta de supervisión.',
      },
      {
        id: 'pedir-audiencia',
        texto:
          'Podés pedir que se convoque una audiencia para que todas las partes den sus fundamentos antes de que se resuelva.',
      },
      {
        id: 'supervisiones',
        texto: 'Podés solicitar supervisiones y constataciones sobre el cumplimiento de las condiciones del egreso.',
      },
      {
        id: 'denunciar-incumplimiento',
        texto:
          'Podés denunciar si la persona condenada incumple las reglas fijadas o no informa un cambio de domicilio — eso puede llevar a que se revoque el beneficio.',
      },
      {
        id: 'tiempo-no-se-descuenta',
        texto: 'Si un egreso se revoca, el tiempo que estuvo afuera no se descuenta de la condena.',
      },
      {
        id: 'patrocinio-letrado',
        texto:
          'Tenés derecho a patrocinio letrado (Ley de Víctimas) y a que la notificación te llegue a vos directamente, no solo a tu abogado o abogada.',
      },
    ],
    preguntas: [
      {
        pregunta: '¿Quién controla que se cumpla la condena si la sentencia todavía no quedó firme?',
        respuesta:
          'El mismo tribunal que dictó la condena — no interviene un juez de ejecución hasta que la sentencia queda firme (se agotaron las apelaciones).',
      },
      {
        pregunta: '¿El juez de ejecución puede reducir o modificar la condena?',
        respuesta:
          'No. Solo controla cómo se cumple. El monto de la pena que fijó la sentencia no se modifica en esta etapa.',
      },
      {
        pregunta: '¿Qué pasa si la persona condenada no cumple las condiciones de una salida?',
        respuesta:
          'Se puede informar al juez para que ordene una supervisión y, si corresponde, se puede pedir que se suspenda o revoque el beneficio. La falta de recursos para controlar no es excusa válida para otorgarlo.',
      },
      {
        pregunta: '¿Qué evalúa el juez antes de otorgar una salida transitoria o una libertad?',
        respuesta:
          'Principalmente tres cosas: el tiempo cumplido de condena, la conducta (sin sanciones disciplinarias) y el pronóstico de reinserción social según los informes del Servicio Penitenciario.',
      },
    ],
    autor: {
      nombre: 'Lucrecia Zárate',
      credencial: 'Abogada y criminóloga, miembro de Usina de Justicia',
      contexto: 'A partir de un encuentro del equipo de Acompañamiento de Usina de Justicia, el 30 de julio de 2026.',
      fotoConfirmada: false,
    },
  },
]
