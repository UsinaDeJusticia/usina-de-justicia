# Copy de /necesito-ayuda — para revisión editorial

Fase 3, decisión D4 (página de máxima prioridad del sitio). No existe una
página equivalente en el sitio viejo: la información sale de dos páginas de
WordPress que sí describen el programa de acompañamiento (aunque como
listado de recursos y galería de casos, no como landing de ayuda), de
componentes de Home ya aprobados y de los datos de contacto reales.

**Cómo leer este documento:** cada bloque de copy va seguido de una nota
`Fuente:` que indica de dónde sale. Nada de lo que sigue fue inventado; donde
las fuentes no alcanzaban (costo del acompañamiento, plazos legales,
estadísticas), directamente no se escribió esa afirmación — ver la sección
"Qué NO se incluyó" al final.

Fuentes citadas:

- **[WP1]** `acompanamiento-a-la-victima.html` — página real "Acompañamiento
  a las Víctimas" (`usinadejusticia.org.ar/programas/acompanamiento-a-la-victima/`).
- **[WP2]** `acompanamos-a-las-victimas.html` — página real "Acompañamos a
  las familias" (`.../acompanamiento-a-la-victima/acompanamos-a-las-victimas/`).
- **[QueHacer]** `src/components/home/QueHacer.tsx` — pasos 01/02/03 ya
  aprobados en la Home.
- **[Pillars]** `src/components/home/Pillars.tsx` — descripción del pilar
  "Acompañamiento a las víctimas", ya aprobado en la Home.
- **[HeroAccompany]** `src/components/home/HeroAccompany.tsx` — hero de
  Home, ya aprobado.
- **[README]** `design-system/README.md` — ejemplos de voz de marca citados
  textualmente del corpus real.
- **[site-config]** `src/lib/site-config.ts` — datos de contacto reales.

---

## 1. Hero

**Eyebrow:**
> Ante la pérdida de un ser querido por un hecho de inseguridad

Fuente: [README], voz de marca citada textualmente ("Ante la pérdida de un
ser querido por un hecho de inseguridad, Usina de Justicia te acompaña").

**Título (H1):**
> Usina de Justicia te acompaña.

Fuente: [README] / [HeroAccompany] (mismo título que la Home, coherencia de
marca).

**Párrafo principal:**
> La muerte de un ser querido producida por un acto de violencia es una de
> las experiencias más traumáticas que puedan ser vividas, para la que nadie
> está preparado. No hay apoyo, justicia, restitución o acto compasivo que
> pueda devolvernos al ser querido perdido para siempre. Una justicia justa,
> que le otorgue al delincuente la ejecución de la pena que le corresponde,
> puede, en cierta forma, mitigar el dolor y permitir realizar el duelo que
> se necesite, para poder luego continuar con tu vida.

Fuente: [WP1], cita casi textual del blockquote de la página real (se
corrigió solo un error de puntuación del original — un punto seguido de
minúscula tras "acto de violencia" — sin tocar el contenido).

**Párrafo de cierre:**
> Nadie debería enfrentar esto solo. Te acompañamos paso a paso, con tiempo
> y reserva.

Fuente: [QueHacer], texto introductorio ya aprobado en la Home.

**CTAs:** "Escribinos por WhatsApp" (WhatsApp), "Llamanos" (tel) y mención
del email. Fuente: [site-config] (teléfono/WhatsApp +54 11 6422-2228, email
info@usinadejusticia.org.ar).

---

## 2. ¿Qué hacer en primer lugar?

Eyebrow y encabezado idénticos a la Home ("Si perdiste a un ser querido" /
"¿Qué hacer en primer lugar?"). Fuente: [QueHacer].

**Bajada:**
> No hay un orden obligatorio ni un plazo para pedir ayuda. Esto es lo que
> hacemos, paso a paso, cuando una familia se comunica con nosotros.

Fuente: síntesis editorial del tono de [QueHacer] ("Nadie debería enfrentar
esto solo. Te acompañamos paso a paso...") — no introduce datos nuevos, sólo
adapta la bajada de sección al contexto de esta página (en la Home es una
sección más; acá es el contenido central).

### Paso 01 — Comunicate con nosotros
> Te escuchamos sin apuro. Llamanos, escribinos por WhatsApp o mandanos un
> correo electrónico, por el canal que prefieras.
>
> Desde ese primer contacto te asignamos una referente de acompañamiento que
> sigue tu caso.

Fuente: [QueHacer] paso 01 (texto base), con el canal WhatsApp explicitado
porque es un canal real de contacto ([site-config]).

### Paso 02 — Contención y primer asesoramiento
> Una psicóloga y una abogada del equipo te acompañan en las primeras
> decisiones: velatorio, pericias, expediente, medios.
>
> No hace falta que resuelvas todo esto solo ni de inmediato.

Fuente: [QueHacer] paso 02, texto base sin cambios; la segunda oración es
síntesis del tono general (ningún dato nuevo).

### Paso 03 — Acompañamiento sostenido
> Te acompañamos durante todo el proceso penal y la ejecución de la pena,
> con asistencia jurídica y grupos de pares.
>
> Seguimos el caso con vos, tenga o no sentencia firme todavía.

Fuente: [QueHacer] paso 03, texto base sin cambios; la segunda oración está
sostenida por [WP2], que organiza a las familias acompañadas en dos
categorías reales: "Familias que acompañamos con Sentencia Firme" y
"Familias que acompañamos con contención legal, emocional y difusión en
redes sin sentencia".

---

## 3. Qué ofrece Usina de Justicia

Eyebrow "Acompañamiento a las víctimas" (nombre del programa, [Pillars]).

Cinco tarjetas:

1. **Una referente de acompañamiento** — "Desde el primer contacto, alguien
   del equipo sigue tu caso de principio a fin." Fuente: [QueHacer] paso 01.
2. **Asesoramiento y asistencia jurídica** — "Durante todo el proceso penal,
   incluida la ejecución de la pena." Fuente: [QueHacer] pasos 02-03,
   [Pillars] ("asesoramiento jurídico").
3. **Contención psicológica** — "Una psicóloga del equipo te acompaña desde
   las primeras decisiones." Fuente: [QueHacer] paso 02, [Pillars]
   ("Contención emocional").
4. **Grupos de pares** — "Encuentro con otras familias que atravesaron la
   pérdida de un ser querido." Fuente: [QueHacer] paso 03 ("grupos de
   pares").
5. **Difusión y visibilización del caso** — "Acompañamiento en la
   comunicación y difusión en redes, cuando la familia lo necesita."
   Fuente: [WP2], categoría real "Familias que acompañamos con contención
   legal, emocional y difusión en redes sin sentencia".

### Otros recursos oficiales

> Además del acompañamiento de Usina de Justicia, existen líneas y
> organismos estatales de asistencia a víctimas:
> - Línea 149 — Centro de Asistencia a la Víctima de Delitos (CENAVID)
> - Línea 144 — Atención por violencia de género
> - Centro Integral de la Mujer (CIM)
> - Centros de Acceso a la Justicia en todo el país (CAJ)
> - Centro de Atención a la Víctima — Ciudad Autónoma de Buenos Aires (CAV)
> - Centro de Atención a la Víctima — Provincia de Buenos Aires

Fuente: [WP1], sección "Datos de interés" de la página real. Se listan sólo
los nombres (sin los links originales, que en su mayoría apuntan a URLs del
sitio WP viejo o de organismos externos no verificadas para este commit; si
se quiere linkear cada recurso, conviene confirmar antes las URLs vigentes).

No se incluyó la descripción larga del "Centro de Atención y Asistencia a la
Víctima" (creado por leyes porteñas 1.216/1.224) ni la del CIM que trae
[WP1]: son organismos estatales de CABA, no un servicio de Usina, y el
párrafo agrega detalle jurídico (excepciones por tipo de delito, etc.) que
no aporta a una persona en crisis buscando a quién recurrir — se resume en
el nombre del recurso.

---

## 4. Preguntas frecuentes

1. **¿Con quién me comunico primero?** — "Con el equipo de acompañamiento de
   Usina de Justicia, por teléfono, WhatsApp o correo electrónico. Desde ese
   primer contacto te asignamos una referente que sigue tu caso." Fuente:
   [QueHacer] paso 01, [site-config].
2. **¿Qué tipo de ayuda ofrece Usina de Justicia?** — "Contención
   psicológica, asesoramiento y asistencia jurídica durante el proceso
   penal, acompañamiento durante la ejecución de la pena y grupos de pares
   con otras familias." Fuente: [QueHacer] pasos 02-03.
3. **¿Me acompañan también si el caso todavía no tiene sentencia?** — "Sí.
   [...] desde el momento del hecho y durante todo el proceso, tenga o no
   sentencia firme." Fuente: [WP2], las dos categorías reales de familias
   acompañadas (con sentencia firme / sin sentencia, con contención legal,
   emocional y difusión en redes).
4. **¿Qué pasa con los primeros trámites, como el velatorio o el
   expediente?** — "En los primeros días te acompañamos en esas decisiones:
   una psicóloga y una abogada del equipo te ayudan con el velatorio, las
   pericias, la apertura del expediente y el trato con los medios." Fuente:
   [QueHacer] paso 02.
5. **¿Qué derechos tengo como familiar de una víctima?** — resumen de
   varios incisos del Artículo 5 de la Ley 27.372 (denuncia inmediata, trato
   digno, protección de intimidad y seguridad, derecho a ser informada/o y
   escuchada/o, derecho a querella). Fuente: [WP1], sección "Derechos de las
   Víctimas — Ley 27.372" (incisos a-o transcriptos de la página real).
6. **¿A quién puedo recurrir si necesito asistencia oficial inmediata?** —
   lista de Línea 149, Línea 144, CAJ, CAV CABA y CAV Provincia de Buenos
   Aires. Fuente: [WP1], "Datos de interés".
7. **¿El acompañamiento termina cuando hay condena?** — "No. Usina de
   Justicia sigue acompañando a las familias durante la ejecución de la
   pena, con asistencia jurídica y grupos de pares." Fuente: [QueHacer] paso
   03, [WP2] (categoría "con Sentencia Firme").

**Por qué son 7 y no más:** se descartaron preguntas para las que ninguna
fuente daba una respuesta verificable (ver abajo). El rango pedido era 4-8;
7 cubre lo sostenible sin forzar contenido.

---

## 5. CTA final

> No tenés que atravesar esto solo. Comunicate con nosotros, con el tiempo y
> la reserva que necesites.

Fuente: síntesis del tono de [QueHacer] ("Nadie debería enfrentar esto
solo... con tiempo y reserva"). Botones a WhatsApp, teléfono y email —
mismos datos de [site-config]. No hay pedido de donación en esta sección (ni
en ningún otro punto de la página): la página es exclusivamente de ayuda,
no de fundraising.

---

## Qué NO se incluyó, y por qué

- **Costo del acompañamiento.** Ninguna de las dos páginas WP ni QueHacer/
  Pillars/site-config dicen si el servicio es gratuito, arancelado, o
  depende del caso. No hay FAQ de "¿tiene costo?" — sería una afirmación
  inventada.
- **Plazos legales concretos** (cuánto tarda un expediente, una pericia,
  una sentencia). Ninguna fuente los da; no se escribió ningún plazo.
- **Horarios de atención** del equipo de acompañamiento. No están en
  ninguna fuente.
- **Estadísticas** (cantidad de familias acompañadas, tasa de sentencias
  firmes, etc.). [WP2] es una galería de casos individuales, no una
  estadística agregada verificable — no se calculó ni infirió un número.
- **URLs de los recursos oficiales** (Línea 149, CAJ, CAV, etc.): se
  listaron los nombres reales tomados de [WP1], pero no se linkearon a las
  URLs capturadas en el HTML porque varias apuntan al dominio WP viejo o a
  organismos externos que conviene reverificar antes de publicar como link
  clickeable en la página de mayor prioridad del sitio.
- **Texto completo del Centro de Atención y Asistencia a la Víctima (CABA)**
  y del CIM: existen en [WP1] pero describen organismos estatales de CABA,
  no el programa de Usina — se resumieron a su nombre en la lista de
  recursos oficiales para no generar confusión sobre quién presta el
  servicio.
