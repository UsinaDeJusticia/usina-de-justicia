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

**A1. Bajar el TTL a 300 segundos.**
En el editor de zona, bajar el TTL de los registros del apex y de `www` a
300 (5 minutos). **Hacer esto al menos 24 horas antes del switch.** El TTL
es cuánto tiempo el mundo recuerda la dirección vieja; con el valor por
defecto (suele ser 14400 = 4 horas), una vuelta atrás tardaría horas en
propagarse. Con 300, minutos.

*Verificación:* ninguna, no es visible. *Vuelta atrás:* no hace falta.

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

**A3. Adjuntar los dominios en Vercel.**
Vercel → proyecto `usina-de-justicia` → Settings → Domains. Agregar:
- `www.usinadejusticia.org.ar` — este es el **canónico** (todo el sitio
  declara `https://www.usinadejusticia.org.ar` en sus etiquetas canonical).
- `usinadejusticia.org.ar` — configurarlo como **redirect a www**.

Vercel va a mostrar "Invalid Configuration" porque el DNS todavía no apunta
ahí. **Es lo esperado en este paso.** Anotar los valores exactos de DNS que
muestra Vercel (típicamente un CNAME `cname.vercel-dns.com` para `www` y un
registro A para el apex) — se usan en la fase D.

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

> **Este es el paso que más conviene no apurar.** Es la única verificación
> real de que WordPress responde bien por el subdominio, y se hace **sin
> ningún riesgo** porque el dominio público todavía no se movió.

---

### Fase C — El switch de `www` (acá el público empieza a ver el sitio nuevo)

**C1.** En el editor de zona DNS: cambiar el registro de `www` para que
apunte a Vercel, con el valor que dio el paso A3.

> **Importante:** si el CDN de Hostinger está activo para `www`, hay que
> desactivarlo primero, o Hostinger puede volver a poner su propio CNAME y
> pisar el cambio.

**C2.** Esperar a que Vercel valide el dominio y emita el certificado SSL
(unos minutos). En Settings → Domains tiene que pasar de "Invalid
Configuration" a válido.

*Verificación — smoke test:*

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

*Vuelta atrás:* devolver el registro `www` a su valor anterior (el CNAME del
CDN de Hostinger). Con el TTL en 300, vuelve en minutos.

> ### ⏸ Punto de parada válido
> Después de esta fase, **el sitio nuevo ya está en vivo para el público**
> y WordPress sigue intacto en el dominio pelado, con su panel y su API sin
> tocar. Se puede quedar así días o semanas sin problema. La única
> consecuencia es que quien escriba el dominio **sin** `www` va a seguir
> viendo el sitio viejo.
>
> Si el día del cutover algo se complica, **parar acá es una buena decisión**,
> no una a medias.

---

### Fase D — El apex, y WordPress declara su nueva casa

Estos dos pasos van **juntos y en este orden**, porque el D1 hace que
WordPress redirija al subdominio, y eso sería visible para el público
mientras el apex siga siendo la puerta de entrada.

**D1.** Editar `wp-config.php` (hPanel → Administrador de archivos, o por
FTP). Antes de la línea `require_once ABSPATH . 'wp-settings.php';` agregar:

```php
define('WP_HOME','https://wp.usinadejusticia.org.ar');
define('WP_SITEURL','https://wp.usinadejusticia.org.ar');
```

Esto le dice a WordPress cuál es su dirección. Son dos líneas y no tocan la
base de datos: **la vuelta atrás es borrarlas.** Hacer una copia del archivo
antes, por las dudas.

**D2.** En el DNS: cambiar los registros A del apex a los valores de Vercel
(paso A3).

*Verificación:*

| Qué probar | Qué tiene que pasar |
|---|---|
| `https://usinadejusticia.org.ar/` | Redirige a `https://www.usinadejusticia.org.ar/` |
| `https://wp.usinadejusticia.org.ar/wp-admin` | El panel de WordPress, sin rebotar |
| Publicar un post de prueba | Aparece en el sitio nuevo en ≤5 minutos |
| Una imagen vieja dentro de un post | Sigue viéndose (la sirve el redirect de `/wp-content`) |

*Vuelta atrás:* devolver los registros A del apex y borrar las dos líneas de
`wp-config.php`.

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
