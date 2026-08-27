# mu-plugins

Archivos que van en `wp-content/mu-plugins/` del WordPress real.

"mu" es por *must-use*: WordPress los carga siempre, sin que aparezcan en la
lista de plugins y sin que nadie pueda desactivarlos por accidente desde el
panel. **Van sueltos en esa carpeta, no dentro de una subcarpeta** — un archivo
en `mu-plugins/loquesea/archivo.php` no se carga.

Se instalan copiando el archivo. Se quitan borrándolo. No tienen pantalla de
ajustes ni escriben en la base de datos.

---

## `usina-frente-al-sitio-publico.php`

Manda al visitante de `wp.usinadejusticia.org.ar` al sitio público,
conservando la ruta, con un 301.

**El problema que resuelve.** Después del cutover, WordPress quedó como gestor
de contenido en su propio subdominio, pero su frente viejo seguía siendo
visible ahí para cualquiera: una segunda versión completa del sitio, en otra
dirección. Alguien que llegaba por un link viejo veía el sitio anterior
creyendo que era el actual, y los buscadores indexaban las dos versiones, que
competían entre sí por las mismas búsquedas en vez de sumar.

**Lo que no toca**, porque el sitio público depende de que siga funcionando: el
panel y el login, la API REST (`/wp-json`, de donde el sitio nuevo lee las
noticias), `/wp-content` y `/wp-includes` (las imágenes y los PDFs), el cron,
XML-RPC, `robots.txt` y los sitemaps de WordPress.

Y dos excepciones pensadas para el equipo: las **vistas previas** (si no, el
botón "Vista previa" al redactar dejaría de servir) y las personas con **sesión
iniciada**. Los buscadores rastrean sin sesión, así que eso no afecta al
objetivo.

### Verificación

```
php wp-plugin/mu-plugins/prueba-usina-frente-al-sitio-publico.php
```

Corre 20 casos contra la lógica real del archivo, con las funciones de
WordPress simuladas: qué rutas redirigen, cuáles no, que las excepciones del
equipo funcionen, y que la ruta y los parámetros de la URL se conserven. No
necesita WordPress ni base de datos, solo PHP.

**Si alguna vez cambiás la lista de rutas excluidas, corré esto antes de
subirlo.** Un error ahí puede dejar al sitio público sin contenido (si se
redirige la API) o al equipo sin panel.

### Instalación

```
wp-content/mu-plugins/usina-frente-al-sitio-publico.php
```

El archivo de prueba **no** se sube al servidor: es solo para el repositorio.

### Vuelta atrás

Borrar el archivo del servidor.

Una advertencia sobre el 301: los navegadores lo guardan y no vuelven a
preguntar. Si algún día se quita, quien ya haya sido redirigido va a seguir
yendo al sitio público hasta que limpie los datos de navegación. Es el
comportamiento correcto para lo que se busca acá, pero conviene saberlo antes
de instalarlo, no después.
