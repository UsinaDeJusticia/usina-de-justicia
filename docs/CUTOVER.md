# Cutover — poner el sitio nuevo en el dominio real

**Estado:** preparado, sin ejecutar. Última actualización: 26-ago-2026.

Este documento es el runbook del único paso que falta para que el público
vea el sitio nuevo. Está pensado para seguirse en orden, con verificación
después de cada paso y un plan de vuelta atrás en cada uno.

---

## 1. Situación actual (verificada, no supuesta)

| Qué | Cómo está hoy |
|---|---|
| Hosting de WordPress | Hostinger (hPanel), LiteSpeed, PHP 8.3 |
| `usinadejusticia.org.ar` (apex) | Registros A a IPs de Hostinger. Sirve WordPress **directo**, sin redirigir |
| `www.usinadejusticia.org.ar` | CNAME al CDN de Hostinger (`…cdn.hstgr.net`) → mismo WordPress |
| Registrador del dominio | NIC Argentina, gestionado vía TAD |
| Zona DNS | **Muy probablemente en hPanel de Hostinger** (NIC solo delega los nameservers). El CNAME del CDN lo crea Hostinger automáticamente. **Confirmar antes de empezar** — ver paso A0 |
| API REST de WP | `https://usinadejusticia.org.ar/wp-json/wp/v2` → responde 200 |
| Proyecto en Vercel | `usina-de-justicia` (`prj_dXbCw3YdOwM8qSK7viJM0Ko5EjpA`), **sin dominio propio adjuntado todavía** |
| Protección de Vercel | SSO activo en `all_except_custom_domains` — al adjuntar el dominio real, queda público automáticamente. No hay que tocar nada |

### El problema que hace falta resolver

El sitio nuevo **le pide el contenido a WordPress en vivo**, y hoy WordPress
vive en el mismo dominio que va a pasar a servir el sitio nuevo. Si se mueve
el DNS sin más, el sitio nuevo se queda sin fuente de datos: se estaría
pidiendo el contenido a sí mismo.

Además, el contenido histórico tiene URLs absolutas al dominio actual:

- **215 de los 842 posts** tienen imágenes con
  `https://usinadejusticia.org.ar/wp-content/…` escrita dentro del cuerpo del
  post. Eso está guardado en la base de datos de WordPress, no se reescribe
  solo.
- Los **5 PDFs** de memorias y balances enlazados desde
  `/nosotros/transparencia`.
- El panel de administración (`/wp-admin`) que usa el equipo todos los días.

Por eso WordPress tiene que mudarse a un subdominio **antes** del switch, y
el sitio nuevo tiene que saber redirigir las URLs históricas.

---

## 2. Lo que ya está resuelto en el código

Todo esto ya está mergeado y **no cambia nada del comportamiento actual**
hasta que se active la variable:

- **Una sola perilla: `WP_HOST`.** De ella se derivan la URL de la API
  (`src/lib/wordpress.ts`), los dominios permitidos del optimizador de
  imágenes, la Content-Security-Policy y los redirects (`next.config.mjs`).
  Sin la variable, todo apunta al dominio actual exactamente como siempre.
- **Redirect `/wp-content/:path*`** al WordPress real: cubre de una sola
  regla los 215 posts, los 5 PDFs y cualquier archivo de la biblioteca de
  medios que no hayamos inventariado.
- **Redirect `/wp-admin` y `/wp-login.php`** (307, no 301) al WordPress real:
  quien entre al panel por el dominio de siempre sigue llegando.
- **El dominio histórico queda permitido** en CSP e imágenes aunque
  WordPress se mude, porque esas URLs viven dentro del contenido.

Verificado ejecutando la config con y sin la variable: sin `WP_HOST`, la
salida es idéntica a la de antes de este cambio.

---

## 3. Runbook

### Fase A — Preparación (nada visible cambia, todo reversible)

**A0. Confirmar dónde se administra el DNS.**
En hPanel de Hostinger → Dominios → `usinadejusticia.org.ar`. Si aparece un
editor de zona DNS con los registros (A, CNAME, MX…), **el DNS se administra
ahí** y TAD/NIC no se tocan en todo el cutover. Si en cambio los nameservers
apuntan a NIC, los cambios de las fases D y E se hacen en TAD.

**A1. Bajar el TTL a 300 segundos.** ✅ **YA ESTABA (27-ago)**

El export de la zona lo confirma: `www` y el apex **ya tienen TTL 300**, y
las respuestas del CDN salen con TTL 60. Los pone así el propio CDN de
Hostinger. **No hay que esperar 24 horas**, que era el único paso del
runbook con reloj.

### La zona real, y qué NO se toca (export del 27-ago-2026)

La zona la sirven `athena` y `apollo.dns-parking.com` — o sea **Hostinger**,
no NIC. Eso cierra el paso A0: TAD y NIC no se tocan en todo el cutover.

Solo se modifican **dos** registros. Todo lo demás queda intacto, y estos
cinco en particular son críticos:

| Registro | Qué es | Qué pasa si se rompe |
|---|---|---|
| `@` MX ×5 (Google) | El correo de la organización | Usina se queda sin mail |
| `@` TXT `v=spf1 …google.com` | SPF | El correo saliente empieza a caer en spam |
| `_dmarc` TXT | Política DMARC | Ídem |
| `resend._domainkey` TXT | DKIM de Resend | **Deja de funcionar el formulario de contacto** |
| `send` MX + TXT (Amazon SES) | Rebotes de Resend | Ídem |
| `wp` A/AAAA | El WordPress real | El sitio nuevo se queda sin contenido |

**El apex no es un registro A: es un `ALIAS` al CDN** (`usinadejusticia.org.ar.cdn.hstgr.net`).
Hostinger usa ALIAS para poder apuntar el dominio pelado a un nombre, cosa
que un CNAME no puede hacer en la raíz de una zona. Cambiarlo no es "editar
la IP": hay que reemplazar el tipo de registro.

**`wp` tiene además un `ALIAS` al CDN**, encima de su A y su AAAA. Hoy no
está en uso —`wp.usinadejusticia.org.ar` resuelve a 147.93.37.235, la IP
directa del servidor, verificado por consulta— pero conviene saberlo por si
al desactivar el CDN algo se mueve ahí.

> #### Los CAA: el riesgo que casi nunca se mira
> La zona tiene 12 registros `CAA`, que son una lista blanca de qué
> autoridades pueden emitir un certificado para este dominio. Si la
> autoridad que usa Vercel no estuviera en esa lista, **el certificado SSL
> no se emitiría y el sitio quedaría inaccesible por HTTPS después del
> switch**, sin ningún mensaje de error obvio que apunte a la causa.
>
> Verificado: la lista incluye `letsencrypt.org` y `pki.goog`, en `issue` y
> en `issuewild`. Son las dos que usa Vercel. **No hay bloqueo.** No hay que
> tocar ningún CAA — pero si alguna vez el certificado no se emite, este es
> el primer lugar donde mirar.


En el editor de zona, bajar el TTL de los registros del apex y de `www` a
300 (5 minutos). **Hacer esto al menos 24 horas antes del switch.** El TTL
es cuánto tiempo el mundo recuerda la dirección vieja; con el valor por
defecto (suele ser 14400 = 4 horas), una vuelta atrás tardaría horas en
propagarse. Con 300, minutos.

*Verificación:* ninguna, no es visible. *Vuelta atrás:* no hace falta.

> ### El DNS se hace a mano en hPanel — la API no está disponible en esta cuenta
>
> Se evaluó automatizar el DNS y **no se pudo**: la API de Hostinger no está
> habilitada en el plan de esta cuenta (verificado por Emanuel en
> `hpanel.hostinger.com/api`). Queda documentado abajo por si el plan cambia.
>
> **Y no hay una segunda vía por SSH.** No es una cuestión de permisos: el
> SSH da una terminal *dentro del servidor* donde vive WordPress (archivos,
> base de datos, WP-CLI), mientras que la zona DNS vive en el panel de
> control de Hostinger, que es un sistema aparte. Desde adentro del servidor
> no hay nada que editar.
>
> Así que el reparto real es: **dos registros los cambia una persona a mano
> en hPanel**, y todo lo demás —`wp-config.php` por SSH, los dominios en
> Vercel por CLI, y todas las verificaciones— lo hace un agente.
>
> Como no hay backup por API, **el respaldo de la zona son dos cosas**: una
> captura de pantalla del editor de zona completo antes de tocar nada, y un
> volcado de los registros resolubles hecho por consulta DNS (solo lectura,
> no necesita credenciales). Ver el paso A1b.

<details>
<summary>Si algún día la API se habilita (referencia)</summary>

> Hostinger expone la zona
> por su API pública (`developers.hostinger.com`), con token generado desde
> hPanel:
>
> | Qué | Endpoint |
> |---|---|
> | Leer la zona entera (= backup) | `GET /api/dns/v1/zones/{dominio}` |
> | Probar sin aplicar (= dry-run) | `POST /api/dns/v1/zones/{dominio}/validate` |
> | Borrar un registro puntual (filtra por `name` + `type`) | `DELETE /api/dns/v1/zones/{dominio}` |
> | Crear/actualizar registros | `PUT /api/dns/v1/zones/{dominio}` |
>
> Es preferible al editor de hPanel por tres motivos: deja un **backup JSON
> de la zona completa** antes de tocar nada, tiene un **paso de validación**
> previo, y apunta a un registro puntual por nombre y tipo en vez de a lo
> que uno cliquee.
>
> **Dos cosas que NO hay que hacer por ahí.** El `PUT` acepta
> `overwrite: true`, que **reemplaza la zona entera**: eso se llevaría
> puestos los 5 MX de Google Workspace, el SPF y el subdominio `wp.`. Va
> siempre `overwrite: false`. Y existe un
> `POST /api/dns/v1/zones/{dominio}/reset` que restaura los registros por
> defecto: **no se usa nunca en este runbook.**
>
> El interruptor del CDN **no** está en esa API: eso sí es hPanel a mano.

</details>

**A1b. Respaldo de la zona, sin credenciales.**
Antes de cambiar ningún TTL: captura de pantalla del editor de zona
completo, con todos los registros visibles. Es la vuelta atrás.

Y un volcado por consulta DNS, que se puede automatizar y no necesita
acceso a ninguna cuenta:

```
dig +noall +answer usinadejusticia.org.ar A MX TXT NS
dig +noall +answer www.usinadejusticia.org.ar A CNAME
dig +noall +answer wp.usinadejusticia.org.ar A CNAME
```

Guardarlo en un archivo con fecha, fuera del repositorio.

Los dos respaldos se complementan: la captura muestra la zona tal como la
administra Hostinger (incluidos registros que quizá no se consulten nunca),
y el volcado muestra qué está resolviendo el mundo de verdad en este momento
— que es contra lo que se compara después del switch.

> **Atajo con WP-CLI.** Hostinger incluye acceso SSH con WP-CLI preinstalado
> en los planes Premium y superiores (verificar con `wp --info` una vez
> conectado). Los pasos A3-backup, D1 y la instalación del plugin se pueden
> automatizar por ahí, y además permite arreglar en el origen las URLs de los
> 215 posts con `wp search-replace` en vez de depender solo del redirect.
> Prompt listo para pasarle a un agente: `docs/cutover-prompt-opencode.md`.
> Lo que WP-CLI **no** puede hacer: crear el subdominio ni tocar el DNS —
> eso es hPanel, no WordPress.

**A2. Crear el subdominio `wp.usinadejusticia.org.ar`.**
En hPanel → Dominios → Subdominios. Crear `wp`, y **apuntar su carpeta al
mismo directorio donde ya vive WordPress** (normalmente `public_html`), no a
una carpeta nueva. Hostinger ofrece esa opción como "carpeta personalizada"
al crear el subdominio.

Esperar a que Hostinger emita el certificado SSL del subdominio (suele ser
automático, unos minutos).

*Verificación:*
```
https://wp.usinadejusticia.org.ar/wp-json/wp/v2/posts?per_page=1
```
Tiene que devolver JSON (un post). Y una imagen cualquiera:
```
https://wp.usinadejusticia.org.ar/wp-content/uploads/2021/02/ZOE-NEREA-CORTEZ-1-e1613752084152.png
```
tiene que abrir.

*Vuelta atrás:* borrar el subdominio. El sitio en vivo nunca se enteró.

**A3. Adjuntar `www` en Vercel.** ✅ **HECHO (26-ago)**
`vercel domains add www.usinadejusticia.org.ar usina-de-justicia`.

`www.usinadejusticia.org.ar` es el **canónico** (todo el sitio declara
`https://www.usinadejusticia.org.ar` en sus etiquetas canonical).

**El dominio pelado se adjunta recién en la fase D**, no acá: adjuntarlo
antes no aporta nada y dispara una verificación de propiedad que todavía no
hace falta.

Vercel muestra el dominio como "Invalid Configuration" porque el DNS todavía
no apunta ahí. **Es lo esperado en este paso.**

Valor exacto que pidió Vercel (`vercel domains inspect`), para la fase C:

```
A    www    76.76.21.21
```

No pidió ningún TXT de verificación de propiedad.

*Vuelta atrás:* quitar el dominio del proyecto.

*Vuelta atrás:* quitar los dominios del proyecto.

---

### Fase B — El sitio nuevo empieza a leer del subdominio

**B1.** En Vercel → Settings → Environment Variables, agregar:

| Key | Value | Environments |
|---|---|---|
| `WP_HOST` | `wp.usinadejusticia.org.ar` | Production **y** Preview |

**B2.** Redesplegar (Deployments → el último → Redeploy). Sin redeploy la
variable no se aplica.

*Verificación:* el sitio en la URL de Vercel
(`usina-de-justicia.vercel.app`) tiene que seguir mostrando las noticias con
sus imágenes. Si las noticias cargan, la API por el subdominio anda.

*Vuelta atrás:* borrar la variable `WP_HOST` y redesplegar. Un minuto.

> **Verificación objetiva, mejor que mirar las imágenes.** La cabecera de
> seguridad del sitio se arma desde la misma variable, así que sirve de
> prueba directa:
>
> ```
> curl -sI https://usina-de-justicia.vercel.app/ | grep -i content-security-policy
> ```
>
> Tiene que aparecer `https://wp.usinadejusticia.org.ar` en `img-src`,
> `media-src` y `connect-src`, **y el host viejo tiene que seguir estando
> ahí también**. Los dos conviven a propósito (`LEGACY_WP_HOST` en
> `next.config.mjs`): así ningún paso intermedio del cutover puede dejar
> imágenes bloqueadas.

> **No confundir con un error:** después del `search-replace`, las **imágenes
> destacadas** de las noticias siguen viniendo del host viejo. Es correcto y
> esperado. La imagen destacada no está escrita en el cuerpo del post —
> WordPress la arma a partir de la opción `siteurl`, que sigue siendo la
> vieja y **tiene que seguir siéndolo hasta la fase D**. Se normaliza sola
> con los `define` del paso D1. Como el host viejo sigue permitido por la
> CSP, entretanto no se rompe nada.

> **Este es el paso que más conviene no apurar.** Es la única verificación
> real de que WordPress responde bien por el subdominio, y se hace **sin
> ningún riesgo** porque el dominio público todavía no se movió.

---

### Fase C — El switch de `www` (acá el público empieza a ver el sitio nuevo)

**C1.** En el editor de zona DNS: cambiar el registro de `www` para que
apunte a Vercel.

Al desactivar el CDN, Hostinger reemplazó solo los registros que
administraba. Estado real tras ese paso (export del 27-ago 00:37 UTC):

```
@     1800 IN A     147.93.37.235
@     1800 IN AAAA  2a02:4780:13:991:0:1652:e8c3:6
www    300 IN CNAME usinadejusticia.org.ar.
```

Los cambios, y la vuelta atrás de cada uno:

| Registro | Antes | Después |
|---|---|---|
| `@` A | `147.93.37.235` · TTL 1800 | `76.76.21.21` · TTL 300 |
| `@` AAAA | `2a02:4780:13:991:0:1652:e8c3:6` · TTL 1800 | **BORRADO** |
| `www` | `CNAME` → `usinadejusticia.org.ar.` · TTL 300 | `A` → `76.76.21.21` · TTL 300 |

`76.76.21.21` es el valor literal que devolvió `vercel domains inspect`.

> #### ⚠️ El registro AAAA hay que BORRARLO, no cambiarlo
> Es la dirección IPv6 del servidor de Hostinger. Vercel no ofrece una
> dirección IPv6 para este método, así que no hay con qué reemplazarla.
>
> **Si se deja, buena parte del tráfico sigue viendo el sitio viejo**: los
> clientes con IPv6 —hoy, casi todos los celulares— prefieren IPv6 sobre
> IPv4, así que irían al `AAAA` (WordPress) ignorando el registro A nuevo.
> Y desde una conexión solo-IPv4 se vería todo bien, sin ningún síntoma.
>
> Es el tipo de error que se descubre por reportes de usuarios días
> después, no en el smoke test.

`www` se pasa a registro `A` explícito en vez de dejarlo como `CNAME` al
apex. Resolvería igual, pero Vercel verifica la configuración del dominio y
un `A` es exactamente lo que pidió: no vale la pena arriesgar un "Invalid
Configuration" por ahorrarse una edición.

> #### La importación de zona es la vuelta atrás, no la herramienta de cambio
> El editor de hPanel permite importar un archivo de zona. **No se usa para
> hacer estos cambios**: una importación probablemente reemplace la zona
> entera, y un error mínimo en el archivo se lleva puestos los MX de Google
> (sin correo) o el DKIM de Resend (sin formulario de contacto). Tres
> ediciones chicas son más seguras que una operación grande sobre todo.
>
> **Para revertir, en cambio, es ideal**: importar el export guardado
> devuelve la zona entera a un estado que generó el propio Hostinger, de
> una sola vez.

> ### ⛔ No cambiar los nameservers a Vercel
> Vercel ofrece, como alternativa, delegarle el dominio entero
> (`ns1/ns2.vercel-dns.com`). **No hay que hacerlo.** La zona actual tiene
> **5 registros MX de Google Workspace y un SPF `include:_spf.google.com`**:
> mover los nameservers deja a la organización **sin correo**, incluido
> `info@usinadejusticia.org.ar`, que es la casilla a la que llegan los
> mensajes del formulario de contacto. Y también se llevaría puesto el
> subdominio `wp.`, es decir, la fuente de contenido del sitio nuevo.
> El registro A puntual deja el resto de la zona intacto.

> **Importante:** el CDN de Hostinger **está activo** para `www` — medido, no
> supuesto: `www.usinadejusticia.org.ar` es hoy un CNAME a
> `www.usinadejusticia.org.ar.cdn.hstgr.net` (147.79.72.184 / 147.79.79.145),
> y el apex resuelve a 88.223.87.33 / 147.79.79.206, también del CDN. El
> subdominio `wp.` en cambio va directo al servidor (147.93.37.235).
> Hay que **desactivar el CDN para `www` antes** de cambiar el registro, o
> Hostinger vuelve a poner su propio CNAME y pisa el cambio.

> **Los dos registros se mueven en dos tiempos, no de golpe.** Primero `www`,
> se verifica que el sitio nuevo responde bien ahí, y recién después el apex.
> Mientras tanto el apex sigue mostrando el sitio viejo, que es el estado
> actual: no se pierde nada. Así, cuando llega el turno del apex, ya no queda
> ninguna incógnita sobre si Vercel enruta y emite el certificado.
>
> Esto reemplaza a una prueba previa que resultó imposible: se intentó probar
> el apex antes de mover el DNS, forzando la conexión a la IP de Vercel con
> `curl --resolve` y `-k`. **No funciona**, y el motivo vale anotarlo: `-k`
> solo desactiva la validación del certificado del lado del cliente, pero
> Vercel corta el handshake TLS antes de eso, porque no tiene ningún
> certificado emitido para un dominio que todavía no verificó. No hay nada
> que ignorar. Un control forzando `usina-de-justicia.vercel.app` por esa
> misma IP sí devolvió 200, lo que confirma que la IP y la conectividad
> estaban bien.

**C2. El dominio pelado.** Se mueve el mismo día que `www`, después de
verificarlo, no en una fase aparte.

> **Por qué cambió esto.** El plan original movía primero `www` y dejaba el
> dominio pelado para después. Emanuel señaló lo obvio: **casi nadie escribe
> el "www"**. Mover solo `www` dejaría a la mayor parte del tráfico real
> viendo el sitio viejo, que es justo lo que el cutover quiere terminar. El
> punto de parada de esta fase sigue existiendo, pero ahora está después de
> mover los dos, no en el medio.

Los dos pasos del apex van **juntos y en este orden**, porque el primero hace
que WordPress redirija al subdominio y eso sería visible mientras el apex
siga siendo la puerta de entrada:

**C2a.** En `wp-config.php`, antes de `require_once ABSPATH . 'wp-settings.php';`:

```php
define('WP_HOME','https://wp.usinadejusticia.org.ar');
define('WP_SITEURL','https://wp.usinadejusticia.org.ar');
```

Le dice a WordPress cuál es su dirección. No toca la base de datos: **la
vuelta atrás es borrar las dos líneas.** Copiar el archivo antes.

**El orden importa y no es intercambiable.** Si se mueve el DNS del apex
*antes* de poner estos `define`, WordPress sigue creyendo que vive en el
apex y manda ahí a todo el que entre por `wp.` — incluido el panel. El
resultado sería `wp-admin` inalcanzable y la API del sitio nuevo rota, las
dos cosas a la vez. Con este orden, la única consecuencia intermedia es que
durante unos minutos quien entre al apex ve el sitio viejo servido desde la
URL `wp.`, que es inofensivo.

**C2b.** En el DNS, cambiar los registros del apex a `A` → `76.76.21.21`.

**C3.** Esperar a que Vercel valide los dos dominios y emita los
certificados SSL (unos minutos). En Settings → Domains tienen que pasar de
"Invalid Configuration" a válidos.

*Verificación — smoke test:*

| Qué probar | Qué tiene que pasar |
|---|---|
| `https://usinadejusticia.org.ar/` | **Redirige a `https://www.usinadejusticia.org.ar/`** |
| `https://usinadejusticia.org.ar/noticias` | Redirige a la misma ruta con `www` |
| `https://wp.usinadejusticia.org.ar/wp-admin` | El panel de WordPress, sin rebotar |
| Publicar un post de prueba | Aparece en el sitio nuevo en ≤5 minutos |

| Qué probar | Qué tiene que pasar |
|---|---|
| `https://www.usinadejusticia.org.ar/` | Home del sitio nuevo, con candado de HTTPS |
| `/noticias` | Listado con las noticias reales y sus imágenes |
| Entrar a una noticia cualquiera | Se ve el texto **y las imágenes de adentro** |
| `/nosotros/equipo` | Las 6 fotos de la Comisión Directiva |
| `/nosotros/transparencia` | Los PDFs abren |
| `/donar` | El botón de MercadoPago lleva al link correcto |
| `/contacto` | Mandar un mensaje de prueba y que llegue el mail |
| `/necesito-ayuda` | Los botones de teléfono y WhatsApp se ven bien |
| Una URL vieja, ej. `/2023/06/15/algo` | Redirige a `/noticias/algo` |
| Una URL inventada | Muestra el 404 propio, no un error del servidor |

| Una imagen vieja dentro de un post | Sigue viéndose (la sirve el redirect de `/wp-content`) |

*Vuelta atrás, en este orden:* devolver los registros de `www` y del apex a
sus valores anteriores (están en el backup JSON de la zona, paso A1) y
borrar las dos líneas de `wp-config.php`. Con el TTL en 300, minutos.

> ### ⏸ Punto de parada válido
> Después de esta fase el cutover está hecho: **el sitio nuevo está en vivo
> para el público en los dos dominios**, y WordPress sigue funcionando
> entero en `wp.`, con su panel y su API intactos.
>
> Todo lo que viene después (fase E) es mejora, no cierre. Si el día del
> cutover algo se complica, **parar acá es una buena decisión**, no una a
> medias.

---

### El redirect del apex ya está resuelto en código

No hace falta configurar el redirect del dominio pelado en el panel de
Vercel: `next.config.mjs` tiene una regla que manda cualquier pedido que
llegue al apex al canónico con `www`, conservando la ruta (308).

Se hizo así, y no con la opción del panel, por una razón concreta: **se
puede verificar antes del cutover**. La opción del panel recién se puede
probar cuando el DNS ya se movió, que es exactamente el peor momento para
descubrir un error. La regla en código se probó con un build real y
peticiones con distintas cabeceras `Host`: el apex da 308 al canónico
conservando la ruta, `www` responde 200 sin redirigir, y un subdominio
cualquiera no matchea.

Ese último caso no es paranoia: Next pasa el valor del matcher a una
expresión regular **sin anclarla**, así que un `usinadejusticia.org.ar` sin
`^...$` también habría matcheado como substring dentro de
`www.usinadejusticia.org.ar` — y el canónico se habría redirigido a sí mismo
en un bucle infinito. El valor va anclado y con los puntos escapados por eso.

---

### Fase E — Después del cutover (sin apuro, días siguientes)

1. **Plugin de revalidación instantánea.** Instalar `wp-plugin/usina-headless/`
   (ver su README) y configurarlo. Recién ahora puede funcionar: hasta el
   cutover, el endpoint que necesita no existía en ese dominio. Con esto las
   publicaciones se ven al instante en vez de esperar hasta 5 minutos.
2. **Google Search Console.** Dar de alta el dominio y enviar
   `https://www.usinadejusticia.org.ar/sitemap.xml` (842 URLs).
3. **Google Business Profile.** Verificar que los datos coincidan con los del
   sitio (dirección, teléfono, sitio web) — la consistencia de esos datos es
   parte de lo que hace que la marca aparezca bien en las búsquedas.
4. **Subir el TTL** de vuelta a su valor normal (3600 o 14400) una vez que
   pasaron unos días sin problemas.
5. **Endurecer HSTS.** Agregar `includeSubDomains` en `next.config.mjs`.
   **Recién cuando el subdominio de WordPress esté estable y con HTTPS
   funcionando**, porque esa directiva pasa a aplicar también a él y un error
   ahí deja el panel inaccesible por meses (los navegadores lo cachean).
6. **Revocar las credenciales de agente** sobre WordPress.
7. **Monitorear** los logs de Vercel los primeros días
   (Deployments → Runtime Logs) por errores 5xx.

---

## 4. Resumen de quién hace qué

| Fase | Quién | Dónde |
|---|---|---|
| A0–A2 | Emanuel | hPanel de Hostinger |
| A3 | Emanuel | Dashboard de Vercel |
| B1–B2 | Emanuel (o el agente, si tiene acceso) | Dashboard de Vercel |
| C1 | Emanuel | Editor de zona DNS |
| C2 + smoke test | Emanuel + agente | Navegador / logs de Vercel |
| D1 | Emanuel | `wp-config.php` en Hostinger |
| D2 | Emanuel | Editor de zona DNS |
| E | Emanuel + agente | Varios |

El agente no tiene acceso al hosting, al DNS ni al registrador: **todas las
acciones de infraestructura las ejecuta Emanuel.** El agente prepara el
código, verifica cada paso con herramientas y acompaña en vivo.

---

## 5. Criterios para abortar

Volver atrás (y no seguir hasta entender qué pasó) si:

- Después de la fase B las noticias dejan de cargar en el preview.
- Después de la fase C alguna página del smoke test da error 500.
- El formulario de contacto deja de mandar mails.
- Las imágenes dentro de las noticias dejan de verse.

Ninguna de estas situaciones es grave **si se detecta rápido**, y por eso el
TTL bajo del paso A1 es la red de seguridad más importante de todo el
runbook.
