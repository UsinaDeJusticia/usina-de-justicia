# Usina Headless

Plugin mínimo de WordPress: avisa al sitio en Next.js (`usinadejusticia.org.ar`) cuando se publica o edita un post, para que se actualice en segundos en vez de esperar la ventana normal de hasta 5 minutos (ISR, `revalidate = 300`).

Ver `docs/ESTADO.md` (pendiente 11) y `docs/plan-maestro-usina-web.md` §5 en el repo del sitio para el contexto completo.

## Qué hace

Un solo archivo (`usina-headless.php`), sin dependencias externas ni build step. Al publicar/editar un post:

1. Detecta el guardado real (ignora autosaves, revisiones, borradores).
2. Le hace un `POST` al endpoint `/api/revalidate` del sitio Next.js con un secreto compartido y las rutas que cambiaron (`/`, `/noticias`, y la del propio post).
3. Si algo falla (sitio caído, secreto mal configurado), lo registra en el log de errores de PHP y sigue — **nunca bloquea ni rompe el guardado del post**. El peor caso es que ese contenido tarda hasta 5 minutos en verse, como ya pasa hoy sin este plugin.

## Qué NO hace

- No incluye el Custom Post Type "Documentos" que menciona el plan maestro — es un alcance más grande, sin empezar todavía, separado de esto.
- No cambia nada del editor ni del flujo de publicación de WordPress.
- No expone el secreto en ningún lado público (nunca se loguea, nunca aparece en el HTML del sitio).

## Instalación

Necesita acceso a `wp-admin` o al hosting (FTP/SFTP) — esto **no lo puede hacer un agente sin esas credenciales**.

1. Subir la carpeta `usina-headless/` completa a `/wp-content/plugins/` del WordPress real. Dos formas:
   - FTP/SFTP directo, o
   - Comprimir esta carpeta en un `.zip` y usar **Plugins → Añadir nuevo → Subir plugin** en `wp-admin`.
2. Activar el plugin en **Plugins**.
3. Ir a **Ajustes → Usina Headless** y completar:
   - **URL del endpoint**: `https://www.usinadejusticia.org.ar/api/revalidate` (ya viene precargado).
   - **Secreto**: el mismo valor exacto que la variable de entorno `REVALIDATE_SECRET` configurada en Vercel (Project Settings → Environment Variables, proyecto `usina-de-justicia`). Si esa variable todavía no existe ahí, generarla primero — un string random largo, por ejemplo con:
     ```
     openssl rand -hex 32
     ```
     y pegar el mismo valor en las dos puntas (Vercel y WordPress). Sin esa variable configurada en Vercel, el endpoint devuelve 401 siempre, incluso con el plugin bien configurado.
4. Guardar, y apretar **Probar conexión** en la misma pantalla antes de depender de que se dispare solo con la próxima publicación.

### Opción más segura para el secreto

En vez de guardarlo en la pantalla de ajustes (que queda en la base de datos), se puede definir como constante en `wp-config.php`, **antes** de la línea `require_once ABSPATH . 'wp-settings.php';`:

```php
define( 'USINA_HEADLESS_REVALIDATE_SECRET', 'el-mismo-valor-que-en-vercel' );
```

Si esa constante existe, el plugin la usa automáticamente y el campo de la pantalla de ajustes queda deshabilitado (mensaje explicativo en vez del input).

## Verificación después de instalar

1. Botón "Probar conexión" en Ajustes → Usina Headless → debería mostrar "Conexión OK".
2. Publicar o editar cualquier post real → revisar en el log de errores de PHP del hosting que NO aparezca ninguna línea `[usina-headless] ...` (si aparece una, dice el motivo exacto del fallo, sin exponer el secreto).
3. Confirmar en el sitio (`usinadejusticia.org.ar`) que el cambio aparece casi al instante, en vez de tardar hasta 5 minutos.
