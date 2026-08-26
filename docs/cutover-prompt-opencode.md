# Prompt para opencode — Fases A y B del cutover

Copiar y pegar el bloque de abajo en opencode, corriendo **en la máquina de
Emanuel** (necesita acceso SSH a Hostinger).

Contexto para quien lo lee: el runbook completo está en `docs/CUTOVER.md`.
Este prompt cubre solo las partes que se pueden automatizar por SSH/WP-CLI.
**Se detiene antes de cualquier cambio de DNS**, que es el paso visible al
público y lo hace Emanuel a mano.

---

```
Sos un agente trabajando en la migración del sitio de Usina de Justicia
(asociación civil argentina). Necesito que ejecutes las fases preparatorias
de un cutover, con mucho cuidado y verificando cada paso.

## CONTEXTO

- WordPress vive en Hostinger, en el dominio usinadejusticia.org.ar.
- Hay un sitio nuevo hecho en Next.js, desplegado en Vercel, que consume el
  contenido de ese WordPress vía su API REST.
- El objetivo final es que usinadejusticia.org.ar sirva el SITIO NUEVO, y
  que WordPress se mude al subdominio wp.usinadejusticia.org.ar.
- Yo (Emanuel) ya creé el subdominio wp.usinadejusticia.org.ar en hPanel,
  apuntando al MISMO directorio donde vive WordPress.

## REGLAS QUE NO PODÉS ROMPER

1. NO toques ningún registro DNS. Ni en Hostinger, ni en NIC, ni en TAD.
   Ese paso lo hago yo a mano, después.
2. NO borres ni desactives nada de WordPress. Ningún plugin, ningún post,
   ninguna tabla.
3. Antes de CUALQUIER modificación, hacé un backup y confirmame que existe
   y que tiene un tamaño razonable.
4. Todo comando que modifique la base de datos se corre PRIMERO en modo
   simulación (--dry-run) y me mostrás el resultado antes de ejecutarlo
   de verdad.
5. Si algo no da el resultado esperado, PARÁ y contame. No improvises un
   arreglo ni sigas al paso siguiente.
6. Nunca muestres en pantalla contraseñas, tokens ni el contenido de
   wp-config.php completo.

## PASO 1 — Reconocimiento (solo lectura)

Conectate por SSH a Hostinger y verificá:

- Que WP-CLI existe y funciona: `wp --info`
- La versión de WordPress: `wp core version`
- Los valores actuales de home y siteurl:
  `wp option get home` y `wp option get siteurl`
- Cuántos posts publicados hay: `wp post list --post_status=publish --format=count`
- Qué plugins hay activos: `wp plugin list --status=active`

Mostrame todo eso antes de seguir.

## PASO 2 — Verificar que el subdominio ya sirve WordPress

Sin usar WP-CLI, solo con curl, comprobá que estas tres URLs responden bien:

1. `https://wp.usinadejusticia.org.ar/wp-json/wp/v2/posts?per_page=1`
   → tiene que devolver JSON con un post (código 200).
2. `https://wp.usinadejusticia.org.ar/wp-content/uploads/2021/02/ZOE-NEREA-CORTEZ-1-e1613752084152.png`
   → tiene que devolver una imagen (código 200).
3. `https://wp.usinadejusticia.org.ar/` → decime qué código devuelve y si
   redirige a algún lado.

Es NORMAL y esperable que la 3 redirija a usinadejusticia.org.ar: WordPress
todavía tiene su dirección canónica vieja. Las que importan son la 1 y la 2.

Si la 1 o la 2 fallan, PARÁ: el subdominio no está bien configurado y hay
que arreglarlo en hPanel antes de seguir.

## PASO 3 — Backup

Hacé un export de la base de datos a un archivo con fecha en el nombre,
guardado FUERA de public_html (para que no quede accesible por web):

    wp db export ~/backup-precutover-$(date +%Y%m%d-%H%M).sql

Confirmame la ruta y el tamaño del archivo. Si pesa menos de 1 MB,
sospechá y avisame: esa base tiene 842 posts, debería pesar bastante más.

## PASO 4 — Medir el alcance del problema de URLs (solo lectura)

Dentro del contenido de los posts hay imágenes con la URL absoluta del
dominio viejo escrita a mano. Contá cuántas son, sin modificar nada:

    wp search-replace 'https://usinadejusticia.org.ar/wp-content/' 'https://wp.usinadejusticia.org.ar/wp-content/' wp_posts --dry-run --report-changed-only

(Si el prefijo de tablas no es `wp_`, ajustalo — lo ves con `wp config get table_prefix`.)

Mostrame el reporte. Yo espero alrededor de 215 posts afectados; si el
número es MUY distinto, avisame antes de seguir.

Probá también la variante con www, que puede existir:

    wp search-replace 'https://www.usinadejusticia.org.ar/wp-content/' 'https://wp.usinadejusticia.org.ar/wp-content/' wp_posts --dry-run --report-changed-only

## PASO 5 — Reescribir esas URLs (ahora sí, de verdad)

Solo después de que yo apruebe los números del paso 4, corré los mismos dos
comandos SIN --dry-run.

Importante: limitalo a la tabla wp_posts. NO corras un search-replace sobre
toda la base.

Después verificá que el cambio se aplicó:

    wp post list --post_status=publish --format=count
    wp db query "SELECT COUNT(*) FROM wp_posts WHERE post_content LIKE '%https://usinadejusticia.org.ar/wp-content/%'"

El segundo tiene que dar 0 (o muy cerca).

## PASO 6 — Instalar el plugin de revalidación

En el repo del sitio hay un plugin en `wp-plugin/usina-headless/`. Es una
actualización del plugin `usina-headless` que YA ESTÁ INSTALADO Y ACTIVO en
este WordPress (versión 0.3.0 → 0.4.0). Conserva todo lo que hace hoy
(Application Passwords, header Authorization, XML-RPC) y le agrega un
webhook.

Subilo reemplazando el archivo existente en
`wp-content/plugins/usina-headless/usina-headless.php`, y confirmame:

    wp plugin list --name=usina-headless

Tiene que seguir figurando como `active` y ahora con versión 0.4.0.

NO lo configures todavía: la pantalla de ajustes (Ajustes → Usina Headless)
la completo yo después del cutover, porque el endpoint que necesita todavía
no existe en el dominio final.

## PASO 7 — Informe final

Cuando termines, hacé un resumen de:
- Qué cambiaste exactamente.
- Dónde quedó el backup.
- Cómo revertir cada cosa que hiciste.
- Qué verificaciones pasaron y cuáles no.

## LO QUE NO HAY QUE HACER TODAVÍA

No toques wp-config.php (los define de WP_HOME y WP_SITEURL van recién
cuando yo mueva el DNS del dominio principal, no antes: si los ponés ahora,
los visitantes del sitio actual empiezan a ser redirigidos al subdominio).
```

---

## Después de que opencode termine

Volvés acá con el informe del paso 7 y seguimos con:

- **Fase B** del runbook (`WP_HOST` en Vercel + redeploy) — se puede hacer
  desde el dashboard, o con el CLI de Vercel si opencode se autentica.
- **Fase C** (el switch de `www`) — DNS, lo hacés vos a mano.

## Por qué el `search-replace` no reemplaza al redirect

El paso 5 arregla el contenido en el origen, que es lo correcto. Pero el
redirect `/wp-content/:path*` que ya está en el código sigue haciendo falta
como red de seguridad, para lo que el `search-replace` no alcanza:

- Links externos viejos de otros sitios que apuntan a imágenes nuestras.
- Resultados cacheados en Google.
- Contenido en tablas que no tocamos (metadatos, widgets, opciones de
  plugins).

El redirect no cuesta nada cuando no se usa, y cubre justo los casos que
un `search-replace` acotado a `wp_posts` deja afuera.
