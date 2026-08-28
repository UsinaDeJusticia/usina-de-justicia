# Sugerencias de la Comisión — análisis

**Documento analizado:** `SUGERENCIAS PARA EL SITIO WEB DE USINA` (4 páginas,
693 palabras, última edición 27-ago-2026), más el audio de Diana Cohen Agrest
del mismo día.

**Estado:** análisis terminado, sin implementar. Cada punto espera decisión.

---

## Regla número uno

> **Lo que la Comisión manda son sugerencias, no instrucciones de
> implementación.** Se analizan todas, se implementan las que no degraden el
> posicionamiento en buscadores ni la respuesta de los modelos de lenguaje, y
> las que sí lo hagan se devuelven con una contrapropuesta que consiga el
> mismo objetivo por otro camino.

Esto no es una posición defensiva. El sitio existe para que una familia que
acaba de perder a alguien encuentre a Usina cuando busca. Todo lo demás está
al servicio de eso. Una sugerencia que mejora la estética pero saca del
buscador a `/necesito-ayuda` es, en términos de la misión, un retroceso — y
hay que decirlo con esas palabras, no con jerga técnica.

---

## Advertencia de calendario, antes que cualquier punto

El sitio **cambió de dominio hace tres días**. Google está en este momento
volviendo a rastrear y reindexar las ~880 páginas, y procesando los redirects
de las direcciones viejas. Search Console todavía no tiene datos suficientes.

Hacer ahora un segundo cambio estructural —mover URLs, reorganizar el
menú— **encima de una migración que todavía se está asentando** hace dos
cosas malas a la vez: multiplica el ruido, y hace imposible saber después qué
causó qué si algo baja.

Por eso el análisis separa las sugerencias en dos grupos:

- **Cambios de contenido y de texto** — no tocan ninguna URL ni el menú. Se
  pueden hacer ya, sin esperar nada.
- **Cambios de estructura** — mueven URLs o cambian el menú. **Conviene
  esperar entre tres y cuatro semanas**, hasta que Search Console muestre la
  migración estabilizada. No es una excusa para no hacerlos: es el orden que
  hace que se puedan medir.

---

## Resumen

| # | Sugerencia | Veredicto |
|---|---|---|
| 1 | Describir qué es Usina al principio, con hitos | ✅ Adoptar — mejora SEO y GEO |
| 2 | Tres pilares: Acompañamiento, Incidencia, Capacitación | ✅ **Ya está así** |
| 3 | OEA e IVUJUS como secciones propias con logo | ⚠️ Adaptar — sección propia no; enlace destacado sí |
| 4 | Cambiar la barra superior a 5 ítems genéricos | ❌ **El de mayor riesgo del documento** — contrapropuesta abajo |
| 5 | Sacar la foto del convenio con Panamá de la portada | ✅ Adoptar — sin impacto |
| 6 | Observatorio dentro de Acompañamiento | ⚠️ Adaptar — enlazar sí, mover la URL no |
| 7 | Sacar la oración sobre Santa Fe y CABA | ✅ Adoptar — es una corrección factual |
| 8 | Sacar Informe Anual, Amicus y Base de sentencias del Observatorio | ⚠️ Adaptar — mover, no eliminar |
| 9 | "Si perdiste a un ser querido" a Acompañamiento | ⚠️ Aclarar — si es "además", sí; si es "en vez de", no |
| 10 | "Conocer el programa" / "Ver incidencia" → "Ver más" | ❌ No adoptar — retroceso medible en SEO y accesibilidad |
| 11 | Agregar la ley 15.232 en Acompañamiento | ✅ Adoptar — de las mejores del documento |
| 12 | Reordenar el contenido de Acompañamiento | ✅ Adoptar |
| 13 | Nueva descripción de Incidencia | ⚠️ Adaptar — conserva la idea, pierde los términos buscables |
| 14 | Quitar OEA e IVUJUS de Incidencia | ⏸ Depende del punto 3 |
| 15 | Nueva descripción de Capacitación | ⚠️ Adaptar — ídem 13 |
| 16 | Agregar los logos de redes sociales al pie | ✅ **Ya están** — el problema es que no se ven |
| 17 | Replicar el menú en el pie de página | ✅ Adoptar |
| 18 | Quitar la palabra "apartidaria" | ✅ Adoptar si lo deciden — pero son 6 lugares, no uno |

---

## Estado de ejecución (27-ago-2026)

Emanuel aprobó arrancar con el bloque "ahora mismo". Lo implementado va en la
rama `feature/sugerencias-comision`.

### Hecho

| # | Qué se hizo | Archivo |
|---|---|---|
| 1 | El párrafo del hero **nombra la entidad**: antes describía la tarea sin decir nunca de quién era, y obligaba a Google y a los asistentes a deducir el sujeto | `src/components/home/HeroEditorial.tsx` |
| 7 | Quitada la oración sobre Santa Fe y CABA | `src/components/home/Observatorio.tsx` |
| 11 | Ley 15.232 sumada al marco legal, **enlazando la nota real** de WordPress (ago-2021) en vez de describir la norma de memoria | `src/app/acompanamiento/page.tsx` |
| 13 y 14 | Descripciones combinadas: la frase de la Comisión ordena la idea, y se conservan `amicus curiae`, `Ley 27.372` y "el único curso de Victimología Penal del país" | `src/components/home/Pillars.tsx` |
| 15 | Agregado **Noticias** al pie: era la única sección del menú principal que no estaba enlazada ahí | `src/lib/site-config.ts` |
| 16 | Íconos de redes de 16 a 20 px y de gris claro a azul | `src/components/layout/Footer.tsx` |
| 17 | "apartidaria" / "apartisan" quitada de los seis lugares, verificado con grep negativo | 6 archivos |

### Cerrado sin código

**Punto 5 — la foto del convenio con Panamá ya no está.** El hero editorial
muestra la **última nota publicada en WordPress** (`HeroEditorial` recibe
`latestArticle` desde `src/app/page.tsx`), así que esa imagen rotó sola: hoy
muestra "Reunión consultiva para víctimas". Verificado contra la portada de
producción. Se descartó agregar un mecanismo para fijar o excluir notas: es
código nuevo para un problema que se resuelve solo.

Dato útil que apareció de paso: esa "foto de Panamá" probablemente venga del
post *"Usina de Justicia llevará a la OEA un proyecto histórico…"*, que habla
de la **56ª Asamblea General de la OEA en Panamá** — no de un convenio con el
país. Vale confirmarlo con la Comisión antes de darlo por cerrado del todo.

### Corrido de bloque

**Punto 12 no se puede hacer todavía.** Pide un orden dentro de Acompañamiento
que incluye mover ahí "Si perdiste a un ser querido" (punto 9, pendiente de
que la Comisión aclare si sale de la portada) y el Observatorio (punto 6, que
espera datos de Search Console). Sin esas dos definiciones no queda nada que
ordenar. **Pasa al bloque de "cuando respondan".**

### Sobre el punto 3, que sigue abierto

Al verificar el enlace de la Ley 15.232 aparecieron **tres notas reales sobre
la OEA**, todas de junio de 2026: el proyecto de Convención Interamericana,
su presentación en la 56ª Asamblea General, y el convenio con el Instituto
Dominicano de Derecho Procesal —que menciona a IVUJUS como "entidad
reconocida por la OEA"—. Es material concreto y publicado.

Eso **no responde** la pregunta que Emanuel le hizo a la Comisión, pero la
acota: ya no es "¿existe algo?" sino "¿alcanza esto para una sección propia,
o hay más?".

### Verificación

`pnpm test` 72/72 · `pnpm build` y `tsc --noEmit` limpios · grep negativo de
"apartidaria" en cero · los siete cambios comprobados contra el servidor
construido, en la portada y en `/acompanamiento` · hero medido a 1280 y a
390 px sin desborde horizontal, y revisado a ojo, porque es la parte más
visible del sitio y el archivo ya tuvo un problema de salto de layout.

---

## Análisis punto por punto

### 1. Describir qué es Usina al principio ✅

*"Ir siempre de lo general a lo particular. Describir qué es Usina de Justicia
(…) Aquí podría agregarse la trayectoria con los hitos más importantes."*
Y el audio de Diana: *"habría que empezar por decir qué es Usina de Justicia,
y después poner los tres pilares."*

**Es la mejor sugerencia del documento, y sirve para las dos cosas.**

Para buscadores: una definición explícita al principio, con las palabras que
la gente escribe, es exactamente lo que Google usa para entender de qué trata
una página.

Para los modelos de lenguaje es todavía más importante. Cuando alguien le
pregunta a un asistente "qué es Usina de Justicia", el modelo necesita
encontrar una definición en prosa, no deducirla de un menú. Hoy esa definición
existe en `/nosotros` y en los datos estructurados, pero **no en la portada**.

**Huecos del documento que hay que completar antes:** dice *"fundada en ___"*
sin el año, y *"el libro de Usina (Nuevos paradigmas)"* sin el título completo
ni el año. El sitio ya afirma **12 de noviembre de 2014** — hay que confirmar
que es correcto y completar el resto. No se inventa ningún dato.

### 2. Los tres pilares ✅ ya está

*"Tres pilares: Acompañamiento, Incidencia en políticas públicas, Capacitación
e Investigación."*

**El sitio ya tiene exactamente esos tres**, con ese orden y esos nombres
(`src/components/home/Pillars.tsx`), bajo el título "Nuestros tres pilares".
No hay nada que cambiar. Vale decírselo: coincide con lo que ya pensaron.

### 3. OEA e IVUJUS como secciones propias ⚠️

*"Deberían ir debajo de los tres pilares, como secciones destacadas, con sus
logos, y que dirijan a sus respectivas páginas."*

**Dos problemas distintos, con respuestas distintas.**

**IVUJUS** tiene sitio propio, `ivujus.org.ar`. En la fase de migración se
decidió a propósito **redirigir 22 direcciones de IVUJUS a ese sitio** en vez
de duplicarlas acá, precisamente para que las dos marcas no compitan entre sí
por las mismas búsquedas. Crear ahora una sección de IVUJUS dentro del sitio
de Usina desharía esa decisión y volvería a partir la autoridad entre dos
dominios.

*Contrapropuesta:* un bloque destacado con el logo que **enlace** a
`ivujus.org.ar`. Se consigue la visibilidad que buscan sin duplicar contenido.

**OEA es un tema abierto que hay que resolver antes de construir nada.** En
agosto quedó registrado que la "presentación ante la OEA" que figuraba en la
documentación interna **no existía como tal**. Sí existen posts reales sobre
el proyecto de Convención Interamericana para las Víctimas de Delito.

Crear una sección entera sobre algo cuyo contenido no está claro es
exactamente el problema de "páginas sin contenido" que ya se analizó en este
proyecto. **Hay que preguntarle a la Comisión qué material concreto existe**
antes de decidir.

### 4. Cambiar la barra superior ❌

*"Cambiaría lo que está (acompañamiento, incidencia, etc.) (…) y pondría cosas
más genéricas: Nosotros, Transparencia institucional, Donar, Noticias,
Contacto."*

**Este es el punto de mayor riesgo de todo el documento, y conviene explicarlo
sin tecnicismos.**

El menú aparece en las ~880 páginas del sitio. Para un buscador, un enlace
repetido en todas las páginas es la señal más fuerte que existe sobre qué
partes del sitio son importantes. Hoy el menú sostiene `/acompanamiento`,
`/observatorio`, la sección de incidencia y `/recursos`.

Sacarlas del menú les quita esa señal **de golpe y en todo el sitio**, y son
justamente las páginas por las que Usina querría aparecer cuando alguien busca
"acompañamiento a víctimas de homicidio" o "datos de homicidios en Argentina".
"Nosotros" y "Contacto" no compiten por ninguna búsqueda relevante.

Hay además un problema de recorrido, ya medido en este proyecto: el menú es lo
que mantiene esas secciones **a un clic** desde cualquier página.

*Contrapropuesta:* conservar las secciones temáticas y sumar Transparencia
institucional, agrupando si el menú queda largo. Y una observación: **Donar ya
está** como botón destacado en la barra, más visible que un ítem de menú;
ponerlo también en el listado lo vuelve redundante.

*Y una condición:* si aun así deciden avanzar, que sea **después** de que
Search Console tenga datos. En unas semanas vamos a saber, con números
reales, qué páginas traen visitas — y eso convierte esta discusión en una
decisión informada en vez de una opinión contra otra.

### 5. Sacar la foto del convenio con Panamá ✅

Decisión editorial pura, sin ninguna consecuencia para buscadores. Adoptar.

### 6. Observatorio dentro de Acompañamiento ⚠️

`/observatorio` es hoy una dirección propia, está en el mapa del sitio, y
declara datos estructurados de tipo `Dataset` — el formato que Google usa
para el buscador de conjuntos de datos. "Observatorio de víctimas" es además
un término por el que se busca.

Mover esa página adentro de `/acompanamiento` significa cambiar su dirección,
poner un redirect, y perder posicionamiento durante semanas.

*Contrapropuesta:* dejar la dirección donde está y **enlazarla de forma
prominente desde Acompañamiento**. La sugerencia busca que se entienda que el
Observatorio es parte del acompañamiento — eso se consigue con la
navegación, sin mover nada.

### 7. Sacar la oración sobre Santa Fe y CABA ✅

*"Porque al lado hay un cuadro con fuentes de Usina y del Ministerio de
Seguridad de la Nación, es decir que no es sólo Santa Fe y CABA."*

**Corrección factual del equipo, que es la fuente.** Se adopta. Y es sano:
afirmar de menos siempre es preferible a afirmar de más, sobre todo en datos.

### 8. Sacar Informe Anual, Amicus y Base de sentencias del Observatorio ⚠️

El razonamiento es correcto: un observatorio es para datos sobre víctimas, y
los amicus son otra cosa.

**Pero "sacar" y "borrar" no son lo mismo.** Si esos elementos enlazan hoy a
páginas reales, quitar el enlace no borra la página: la deja aislada, sin
nada que la enlace, y con el tiempo el buscador la considera menos relevante.

*Contrapropuesta:* moverlos a donde corresponde —los amicus a Incidencia— y
que sigan enlazados desde ahí. El resultado visual es el que piden; la
diferencia es que el contenido no queda huérfano.

### 9. "Si perdiste a un ser querido" a Acompañamiento ⚠️ hay que aclarar

Esto es `/necesito-ayuda`, y es **probablemente la página más importante del
sitio**: es la que encuentra alguien que acaba de perder a un familiar y no
sabe qué hacer. Tiene preguntas frecuentes con datos estructurados, que es lo
que hace que Google la muestre destacada.

La sugerencia puede leerse de dos maneras y **cambia mucho cuál sea**:

- *"Que además esté enlazada desde Acompañamiento"* → **sí, adoptar.**
- *"Que salga de la portada y quede solo dentro de Acompañamiento"* → **no.**
  Alguien en crisis entra a la portada, no navega. Sumarle un clic a esa
  persona es el peor cambio posible de todo el documento.

**Hay que preguntarlo explícitamente.**

### 10. "Ver más" en lugar de los textos actuales ❌

*"Cambiaría 'Conocer el programa' por 'Ver más'"*, ídem "Ver incidencia" e
"Ir a IVUJUS".

**Se entiende la intención —uniformar— pero el costo es concreto y doble.**

Para buscadores, el texto de un enlace le dice a Google de qué trata la página
de destino. "Conocer el programa" aporta; "Ver más" no aporta nada.

Para accesibilidad es peor. Quien usa un lector de pantalla puede pedir la
lista de enlaces de la página: con este cambio, escucharía **"Ver más, Ver
más, Ver más"**, sin forma de distinguirlos. El sitio hoy tiene 90 o más de
100 en accesibilidad; esto lo baja de forma medible.

*Contrapropuesta:* uniformar el patrón sin perder la descripción — "Ver
acompañamiento", "Ver incidencia", "Ver capacitación". Se ve tan prolijo como
"Ver más" y no pierde nada.

### 11. Agregar la ley 15.232 ✅

*"Dado que la mayoría de los delitos de inseguridad ocurren en el ámbito
provincial."*

**Excelente sugerencia, y de las que más rinden.** Es contenido real, con un
número de ley concreto que la gente busca tal cual, y refuerza la autoridad de
Usina sobre un tema donde efectivamente participó. Adoptar sin reservas.

### 12. Reordenar el contenido de Acompañamiento ✅

Adoptar, con la salvedad del punto 6: que "Observatorio de víctimas" dentro de
ese orden sea un **enlace** a `/observatorio`, no una mudanza.

### 13 y 15. Nuevas descripciones de Incidencia y Capacitación ⚠️

Las dos propuestas son más lindas de leer y **las dos pierden exactamente lo
que hace que una página aparezca en una búsqueda**.

| Hoy dice | Proponen | Qué se pierde |
|---|---|---|
| "Amicus curiae, proyectos de ley y participación activa en la aplicación de la Ley 27.372" | "Participación técnica en debates parlamentarios, diplomacia internacional y presentaciones judiciales" | "amicus curiae" y "Ley 27.372" — dos términos que se buscan tal cual |
| "A través de IVUJUS, el único curso de Victimología Penal del país y formación a magistrados" | "Investigar para entender, capacitar para transformar. Formación práctica para generar un impacto social real, sostenible y medible" | "el único curso de Victimología Penal del país", una afirmación concreta y verificable |

La segunda columna no contiene ni un solo término por el que alguien busque.
"Impacto social real, sostenible y medible" no lo escribe nadie en Google.

*Contrapropuesta:* combinar. Usar la frase nueva como encabezado —que es
donde funciona bien— y conservar los términos concretos en la descripción.
Se puede tener las dos cosas.

### 14. Quitar OEA e IVUJUS de Incidencia ⏸

Queda pendiente del punto 3.

### 16. Logos de redes sociales ✅ ya están

**El pie de página ya tiene Facebook, X e Instagram**
(`src/components/layout/Footer.tsx`), y esos perfiles ya alimentan los datos
estructurados de la organización — cosa que sirve para que un modelo de
lenguaje confirme que la cuenta y la organización son la misma entidad.

Que la sugerencia exista significa que **no los vieron**. Eso no es un
problema de contenido sino de visibilidad, y merece revisarse: si tres
personas de la Comisión no encontraron los íconos, un visitante tampoco.

### 17. Replicar el menú en el pie ✅

Buena práctica, sin contraindicación. Adoptar.

### 18. Quitar "apartidaria" ✅ con una advertencia

Es una decisión institucional y no técnica, así que la toman ellos.

**Pero no es un cambio en un solo lugar: la palabra aparece en seis**, entre
ellos la versión en inglés del sitio y el archivo de instrucciones para
agentes. Si se cambia, se cambia en todos — que el sitio se contradiga a sí
mismo es peor que cualquiera de las dos opciones.

---

## Lo que necesitamos que la Comisión confirme

1. **El año de fundación** y el título completo del libro, para el punto 1.
   No se completa ningún dato por deducción.
2. **Punto 9:** ¿"Si perdiste a un ser querido" sale de la portada, o solo se
   suma a Acompañamiento? Es la aclaración más importante de la lista.
3. **Punto 3:** ¿qué contenido concreto existe hoy sobre la OEA?
4. **Punto 18:** ¿la Comisión decide quitar "apartidaria" de todo el sitio?

---

## Orden propuesto

**Ahora — sin tocar ninguna dirección:** los puntos 1, 5, 7, 11, 12, 13, 15,
17 y 18. Son todos contenido y texto. Ninguno pone en riesgo la migración que
se está asentando.

**En tres o cuatro semanas — con datos de Search Console a la vista:** los
puntos 4, 6 y 8, que mueven direcciones o cambian el menú. Para entonces
vamos a poder decidir con números en vez de con opiniones.

**Cuando la Comisión responda:** los puntos 3, 9 y 14.

**No se implementa:** el punto 10, salvo que decidan asumir el costo después
de leer el motivo.
