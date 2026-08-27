# Cómo publicar en el sitio

Guía para quien carga contenido. No hace falta saber nada de programación.

---

## Lo esencial

**Seguís usando el panel de WordPress de siempre.** Lo único que cambió es la
dirección: ahora es **`wp.usinadejusticia.org.ar/wp-admin`**.

Escribís y publicás como siempre. El sitio público lo levanta solo, en menos de
cinco minutos. No hay que avisarle a nadie ni tocar nada más.

---

## La única regla nueva

**Elegí siempre al menos una de estas seis categorías:**

| Categoría | Dónde aparece el post |
|---|---|
| **Historias** | `/noticias/categoria/historias` |
| **Acompañamiento** | `/noticias/categoria/acompanamiento` |
| **Incidencia** | `/noticias/categoria/incidencia` |
| **Prensa** | `/noticias/categoria/prensa` |
| **Institucional** | `/noticias/categoria/institucional` |
| **Observatorio** | `/noticias/categoria/observatorio` |

> **Cuando dudes: la correcta es siempre la de nombre más corto.**
>
> En el buscador de categorías conviven las viejas, con nombres parecidos y más
> largos: "Historias de los miembros de UJ", "Acompañamiento a víctimas de
> homicidio y femicidio", "Incidencia en Políticas Públicas", "Medios y
> entrevistas a Miembros de Usina de Justicia". Quedaron a propósito, para no
> romper nada del contenido histórico.

**No hay que marcar en ningún lado que el post va en "Noticias".** Todo lo
publicado aparece en `/noticias` automáticamente — esa sección es el listado
completo, en orden cronológico. La categoría solo decide en qué **sección
temática** aparece además.

Si elegís únicamente una categoría vieja, el post igual aparece en `/noticias`,
pero en ninguna sección. No se pierde: queda menos visible.

---

## La imagen destacada importa

Es la que se ve en la tarjeta del listado y la que aparece cuando alguien
comparte el link en WhatsApp o redes. Un post sin imagen destacada se ve pobre
en las dos situaciones.

---

## El extracto también

Si el post no tiene extracto, el sitio usa el título como descripción para
buscadores. Funciona, pero un extracto propio de una o dos oraciones rinde
mucho mejor: es el texto que Google muestra debajo del título en los
resultados.

---

## Cuánto tarda en verse

Hasta **cinco minutos**. El sitio le pregunta a WordPress por contenido nuevo
cada tanto; no espera a que alguien lo avise.

Si publicaste y no aparece después de cinco minutos, recargá la página del
sitio con **Ctrl + Shift + R** antes de preocuparte: puede ser tu navegador
mostrándote una copia guardada.

---

## Si alguien dice que ve el sitio viejo

Es su navegador, no el sitio. El WordPress anterior le decía al navegador que
guardara las páginas por varios días, y el navegador obedece sin volver a
preguntar.

**Se arregla con `Ctrl + Shift + R`** (o `Cmd + Shift + R` en Mac), una sola
vez. Si no, que entre desde el celular con datos móviles o en una ventana de
incógnito.

Afecta solo a quien haya visitado el sitio en los días previos al cambio, desde
ese mismo navegador.

---

## Preguntas que ya surgieron

**¿Puedo seguir usando Elementor?**
Sí, para las páginas del WordPress viejo. Pero tené en cuenta que **el sitio
público ya no las muestra**: sus páginas institucionales están hechas aparte.
Lo que sí llega al sitio público son las **entradas** (posts).

**¿Y las páginas viejas de WordPress?**
Siguen existiendo en `wp.`, pero quien entre ahí es enviado al sitio público.
Es a propósito: si estuvieran visibles, habría dos versiones del sitio
compitiendo entre sí en Google.

**¿Se puede hacer que aparezca al instante en vez de esperar cinco minutos?**
Sí. Está escrito el plugin que lo hace (`wp-plugin/usina-headless/`), falta
configurarlo. Con eso la publicación se refleja en segundos.
