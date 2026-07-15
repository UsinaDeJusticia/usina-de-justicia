# Guía: crear la entrada de Wikidata de Usina de Justicia

**Para:** Emanuel · **Tiempo estimado:** ~15 minutos · **Nivel:** no requiere
conocimiento técnico, solo copiar y pegar.

**Por qué importa:** según la decisión D7 del plan maestro (`docs/plan-maestro-usina-web.md`)
y la doctrina vigente en `docs/geo-schema.md`, una entrada verificable en
Wikidata es la palanca de mayor impacto para que los motores generativos
(ChatGPT, Perplexity, Google AI Overviews, Claude, etc.) identifiquen a Usina
de Justicia como una entidad real y confirmen los datos básicos (fundación,
fundadora, país) desde una fuente independiente y estructurada.

---

## 1. Crear una cuenta

1. Ir a <https://www.wikidata.org/>.
2. Arriba a la derecha, click en **"Create account"** (o "Iniciar sesión" si
   ya tenés una cuenta de Wikipedia/Wikimedia — es la misma cuenta para todos
   los proyectos Wikimedia).
3. Completar usuario, contraseña y (opcional) email. Confirmar.

No hace falta ninguna verificación especial para crear un ítem nuevo; alcanza
con tener la cuenta creada.

## 2. Crear un nuevo ítem ("Create a new Item")

1. Con la sesión iniciada, ir a <https://www.wikidata.org/wiki/Special:NewItem>
   (o: menú lateral izquierdo → "Create a new Item").
2. Vas a ver tres campos para el idioma español (el sitio detecta el idioma
   del navegador; si aparece en inglés, cambiar el selector de idioma arriba
   a la derecha a "español" o agregar el label/description en español
   igual, no es necesario cambiar toda la interfaz):
   - **Label (etiqueta):** `Usina de Justicia`
   - **Description (descripción):** `asociación civil argentina por los derechos de las víctimas de homicidio y femicidio`
   - **Also known as (alias):** dejar vacío.
3. Click en **"Create"**.

Esto crea el ítem con un identificador nuevo con formato `Q########` (el
"Q-ID") — todavía no lo vas a tener hasta después de guardar. Wikidata te
lleva a la página del ítem recién creado.

### Agregar también el label/descripción en inglés

En la misma página del ítem, en la caja de arriba a la izquierda donde están
label/description, hay un enlace **"+ agregar en otro idioma"** (o "add
label/description in another language"). Agregar:

- **Label (en):** `Usina de Justicia`
- **Description (en):** `Argentine civil association for the rights of homicide and femicide victims`

## 3. Completar los datos (tabla para copiar/pegar)

En la página del ítem, buscar la sección **"Statements"** (más abajo) y click
en **"add statement"** (o el botón `+`) para cada fila. En cada statement hay
un campo "Property" (buscar por nombre o por código `P###`) y un campo
"Value" (buscar el valor; si es otro ítem de Wikidata, aparece un
autocompletar — elegir la opción con el código `Q###` indicado abajo, no
cualquier resultado con nombre parecido).

| # | Propiedad (Property) | Código | Valor a escribir/buscar | Qué elegir |
|---|---|---|---|---|
| 1 | instance of | `P31` | `nonprofit organization` | La opción con código **Q163740** |
| 2 | country | `P17` | `Argentina` | La opción con código **Q414** |
| 3 | inception | `P571` | `12 November 2014` | Elegir precisión "day" (no "year") en el selector de fecha |
| 4 | founded by | `P112` | `Diana Cohen Agrest` | La opción con código **Q23907251** — verificar que sea esa exacta antes de confirmar, puede haber otros resultados con nombre similar |
| 5 | official website | `P856` | `https://www.usinadejusticia.org.ar` | Campo de texto libre (URL), no autocompletar |
| 6 | headquarters location | `P159` | `Buenos Aires` | La opción con código **Q1486** (la ciudad, no la provincia) |

**Importante — lo que NO hay que completar todavía:** no agregues una
dirección postal exacta ni un ítem de "coordinate location". La sede social
registrada exacta está pendiente de confirmación (ver `docs/geo-schema.md`
§3) — completar solo hasta el nivel de ciudad (Buenos Aires) como está en la
tabla.

Guardar cada statement con el botón de tilde (✓) que aparece a la derecha
después de completar el campo de valor.

## 4. Cómo agregar referencias

Cada statement de la tabla anterior debería llevar al menos una referencia
(fuente externa que respalde el dato) para que la entrada sea considerada
confiable. Con el statement ya guardado:

1. Debajo del statement, click en **"add reference"**.
2. En "Property" de la referencia, buscar y elegir **"reference URL"** (`P854`).
3. En "Value", pegar una de estas dos URLs (usar la que mejor corresponda al
   dato — para fundación/fundadora/10 años, cualquiera de las dos sirve):
   - `https://www.lanacion.com.ar/politica/la-usina-de-justicia-conmemoro-10-anos-de-lucha-en-defensa-de-las-victimas-y-contra-el-abolicionismo-nid12112024/`
   - `https://www.infobae.com/sociedad/2024/11/16/usina-de-justicia-a-10-anos-de-transformar-el-dolor-en-lucha-se-sigue-privilegiando-a-unas-victimas-en-desmedro-de-otras/`
4. Click en el tilde (✓) para guardar la referencia.
5. Repetir para los statements de `inception` (P571) y `founded by` (P112) al
   mínimo — son los dos datos más citados por esas notas. Para `official
   website`, `country` y `headquarters location` una referencia es deseable
   pero no crítica (son datos verificables directamente en el sitio).

No hace falta usar plantillas de cita complejas — el campo "reference URL"
simple es suficiente y es lo estándar en Wikidata para este tipo de entidad.

## 5. Qué hacer con el Q-ID resultante

Una vez guardado el ítem, la URL de la página tiene la forma
`https://www.wikidata.org/wiki/Q#######` — ese número (`Q` + dígitos) es el
**Q-ID** de Usina de Justicia.

**Pasos siguientes:**

1. Copiar esa URL completa (o solo el Q-ID).
2. Pasársela al agente/sesión de Claude Code que esté trabajando en el repo,
   con un mensaje del tipo: *"Ya creé la entrada de Wikidata, el Q-ID es
   Q#######"*.
3. El agente va a conectarlo en el código: hay un `TODO` esperando
   exactamente esto en `src/app/layout.tsx`, en el array `sameAs` del
   schema `NGO` (buscar el comentario `agregar sameAs a la entrada de
   Wikidata de Usina cuando exista`). Se agrega la URL
   `https://www.wikidata.org/wiki/Q#######` a ese array — un cambio de una
   línea, sin riesgo.

No hace falta que hagas nada más en el código vos mismo — con el Q-ID alcanza.
