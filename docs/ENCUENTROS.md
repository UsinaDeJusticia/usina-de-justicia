# Encuentros abiertos — inscripción con Zoom

Página pública: `https://www.usinadejusticia.org.ar/encuentros`

Permite que una persona se inscriba desde la web de UJ y reciba **de Zoom**
su invitación individual. Las reuniones se siguen organizando y conduciendo
en Zoom como siempre; la web solo reemplaza el formulario de inscripción.

## 1. Cómo funciona

```
Navegador ──POST──▶ /api/encuentros/registrar ──▶ Zoom API
 (formulario)        (valida, filtra abuso,         POST /meetings/{id}/registrants
                      evita duplicados)             └▶ Zoom envía el correo con el enlace individual
```

- **Sin base de datos propia.** Zoom es la fuente de verdad: la lista de
  inscriptos se consulta en Zoom (Reunión → Inscripción → Ver/Exportar).
- **Sin WordPress.** Las inscripciones no pasan por WP.
- **Sin enlace general publicado.** El `join_url` individual que devuelve Zoom
  se descarta en el servidor; el participante lo recibe solo por correo.
- **Nunca se simula éxito.** Si Zoom no confirma, la persona ve un error y sus
  datos quedan en el formulario.

| Archivo | Qué hace |
|---|---|
| `src/data/encuentro-actual.ts` | Configuración manual anterior (solo si la sincronización está desactivada) |
| `src/app/encuentros/page.tsx` | Página pública |
| `src/components/encuentros/` | Detalle del encuentro y formulario |
| `src/app/api/encuentros/registrar/route.ts` | Endpoint: origen, tamaño, límite por IP, sin caché |
| `src/lib/encuentros.ts` | Estado de la inscripción y validación (compartida navegador/servidor) |
| `src/lib/encuentros-registro.ts` | Flujo de inscripción y manejo de errores |
| `src/lib/zoom.ts` | Cliente de Zoom (solo servidor) |
| `src/lib/__tests__/encuentros.test.ts` | Pruebas automatizadas (Zoom simulado) |

### Estados de la página

| Estado | Cuándo | Qué ve el público |
|---|---|---|
| Abierta | `estado: 'abiertas'` + `inicio` + `zoomMeetingId` + antes del cierre | Información y formulario activo |
| Próximamente | Falta fecha o ID de reunión, o `estado: 'proximamente'` | Información y formulario desactivado con aviso |
| Cerrada | `estado: 'cerradas'`, o pasó `cierreInscripcion` (o el fin del encuentro) | Información y formulario desactivado |
| Sin encuentro | `encuentroActual = null` | Mensaje institucional, sin formulario |

La página usa la agenda de Zoom con caché breve una vez activada la sincronización.
El endpoint verifica la reunión en vivo antes de inscribir.

## 2. Gestión mensual: todo desde Zoom

Una vez activada la sincronización, no se edita código ni se despliega por encuentro.

1. En la cuenta de Diana, crear una reunión **nueva y no recurrente**, con ID
   automático, fecha, hora y duración correctas. Activar inscripción obligatoria,
   aprobación automática y correo de confirmación a inscriptos.
2. Usar un título como **`[UJ] Derechos de las víctimas`**. `[UJ]` al comienzo
   significa **publicar en la web**; las reuniones sin esa marca son internas.
3. En la descripción se puede escribir:
   ```text
   Expositor: Carlos Pagliere
   Una conversación sobre los derechos de las víctimas.
   ```
   La línea de expositor es opcional; sin ella se muestra «Usina de Justicia».
   El resto de la descripción se publica como texto. No incluir información privada.
4. Guardar. La web muestra la convocatoria marcada más próxima que aún no terminó.
   Si hay varias, se muestra una por vez, ordenada por fecha.
5. Editar fecha, hora, tema, descripción y duración directamente en Zoom.
   Para retirar una convocatoria, quitar `[UJ]` del título o eliminar la reunión.
   Para cancelarla no alcanza con escribir «cancelado» en la descripción: retirar la marca.

La agenda se consulta cuando se visita `/encuentros`, con caché de 60 segundos.
Los cambios pueden tardar alrededor de **1–2 minutos y una recarga**. Una pestaña
ya abierta no se actualiza sola. No hay cron, webhooks ni base de datos adicional.
Antes de cada inscripción se verifica Zoom en vivo: una reunión retirada o con
opciones cambiadas no admite inscripciones aunque alguien conserve la página anterior.
Si cambia la convocatoria, se pide recargar; nunca se inscribe a otra reunión.

Solo se admiten reuniones programadas no recurrentes (tipo 2), con fecha explícita.
Si faltan aprobación automática, ID automático o correo de confirmación, el encuentro
se muestra con la inscripción desactivada. Si Zoom no responde, el sitio muestra
indisponibilidad temporal y no utiliza indefinidamente datos viejos.

La lista de inscriptos se administra en Zoom → reunión → Inscripción → Ver/Exportar.
El anfitrión no se inscribe como participante: Zoom devuelve el código 3027.

## 3. Configuración técnica de una sola vez

| Variable | Contenido | Entornos |
|---|---|---|
| `ZOOM_ACCOUNT_ID` | App → App Credentials | Production y Preview autorizado |
| `ZOOM_CLIENT_ID` | App → App Credentials | ídem |
| `ZOOM_CLIENT_SECRET` | App → App Credentials, Secret/Sensitive | ídem |
| `ZOOM_HOST_EMAIL` | Correo o ID del anfitrión de los encuentros | Production y Preview autorizado |
| `ZOOM_SYNC_ENABLED` | `true` para usar Zoom como origen | Activar después de agregar los permisos |

Las credenciales no se escriben en el repositorio ni se comparten por chat.
No usar variables `NEXT_PUBLIC_*`. No es necesario leer/desencriptar los secretos.
El código lista solo las reuniones del anfitrión configurado, no las de toda la cuenta.

Desactivando `ZOOM_SYNC_ENABLED` se conserva temporalmente la configuración
manual anterior en `src/data/encuentro-actual.ts` para permitir un despliegue gradual.
Esa configuración deja de intervenir cuando la sincronización está activada.

| Archivo | Responsabilidad |
|---|---|
| `src/lib/zoom.ts` | Cliente API: token, listado paginado y detalles seguros |
| `src/lib/encuentros-zoom.ts` | Marca, orden, mapeo público y versión de convocatoria |
| `src/lib/encuentro-vigente.ts` | Origen, caché breve, errores y verificación en vivo |
| `src/lib/__tests__/encuentros-zoom.test.ts` | Privacidad, selección, cambios, cancelaciones y API |

## 4. App de Zoom: cuatro permisos mínimos

La app interna Server-to-Server OAuth utiliza estos scopes granulares:

| Scope | Uso |
|---|---|
| `meeting:write:registrant:admin` | Agregar inscriptos (existente) |
| `meeting:read:list_registrants:admin` | Detectar duplicados (existente) |
| `meeting:read:list_meetings:admin` | Descubrir convocatorias (nuevo) |
| `meeting:read:meeting:admin` | Leer descripción completa y opciones (nuevo) |

No necesita crear, editar ni eliminar reuniones. La ampliación de permisos requiere
confirmación del propietario y que la app quede activa con los cuatro scopes.
La primera configuración solo tenía dos permisos: sin los dos nuevos no activar
`ZOOM_SYNC_ENABLED` en producción. No regenerar las credenciales por agregar scopes.

Referencias oficiales verificadas el 1 de noviembre de 2026:
- https://developers.zoom.us/docs/api/meetings/ — `GET /users/{userId}/meetings`,
  `GET /meetings/{meetingId}`. La descripción del listado se trunca: se leen detalles.
- https://developers.zoom.us/docs/internal-apps/oauth-scopes-granular/

## 5. Protección contra abuso y duplicados

1. **Campo trampa** oculto (mismo patrón que `/contacto`).
2. **Solo mismo origen**: se rechazan envíos desde otros sitios (`Sec-Fetch-Site` / `Origin`).
3. **Tamaño máximo** de la solicitud: 8 KB.
4. **Duplicados**: antes de inscribir, se consulta en Zoom si el email ya está
   (aprobado o pendiente). Si está, se informa «ya estabas inscripto/a» y no
   se llama a Zoom de nuevo → no hay registro ni correo duplicado.
5. **Límite por IP en memoria** (5 intentos / 10 min por instancia): frena
   ráfagas, pero en serverless cada instancia tiene su contador.
6. **Límite efectivo en producción — PENDIENTE de configurar**: regla de
   *Rate Limiting* del Firewall de Vercel (Project → Firewall → Configure →
   New Rule): `Request Path` *equals* `/api/encuentros/registrar` **y**
   `Method` *equals* `POST` → *Rate Limit*, ventana fija de 60 s, 5
   solicitudes por IP, acción *Too Many Requests (429)*. La documentación de
   Vercel indica que el plan Hobby permite hasta 3 reglas personalizadas;
   hay reportes de que elegir la acción 429 en Hobby pide pasar a Pro: en ese
   caso usar la acción *Deny*. No se configura desde el código para no
   modificar producción sin autorización.

## 6. Privacidad (Ley 25.326)

- Datos: nombre, apellido, email, teléfono, profesión u ocupación, institución
  (opcional). Finalidad única: gestionar la participación en el encuentro.
- No se usan para campañas ni boletines sin una autorización independiente.
- No se pregunta por experiencias personales como víctima.
- Los logs del servidor no contienen datos personales (hay una prueba
  automatizada que lo verifica) ni IPs.
- Las respuestas del endpoint llevan `Cache-Control: no-store`.
- **Conservación**: `/legal/privacidad` publica que los datos se conservan
  hasta `CONSERVACION_MESES` (6) meses después del encuentro y luego se
  eliminan de Zoom. **Requiere confirmación de la Comisión** y una tarea
  periódica: borrar en Zoom las reuniones pasadas (con sus inscriptos) al
  vencer el plazo.

### DNI

**No se recolecta.** La Comisión lo propuso como señal de compromiso, pero:
el DNI no acredita que quien completa el formulario sea su titular, y no hay
todavía una finalidad concreta que lo haga pertinente (art. 4, Ley 25.326).
Para incorporarlo más adelante hace falta, antes de tocar código:

1. Una finalidad documentada (p. ej., emisión de certificados de asistencia).
2. Decidir dónde se guarda: **no** enviarlo a Zoom (no tiene campo para eso y
   quedaría en exportaciones) — implicaría un registro propio, con su
   análisis de seguridad, acceso y plazo de borrado.
3. Actualizar `/legal/privacidad`.
4. Recién entonces, agregar el campo como opcional en `src/lib/encuentros.ts`,
   sin registrarlo nunca en logs.

## 7. Costos y dependencias

- **Sin dependencias npm nuevas** ni servicios nuevos.
- Zoom: requiere un anfitrión con **licencia paga** (la inscripción no está
  disponible en cuentas gratuitas). La API no tiene costo adicional; la
  categoría de límites de `POST registrants` es baja, suficiente para este volumen.
- Vercel: una invocación de función por inscripción (más ≤ 2–3 llamadas a Zoom
  dentro de esa misma invocación). La página se sirve dinámicamente y la agenda se cachea por 60 segundos; hay lecturas de Zoom adicionales al inscribir.
- Firewall de Vercel: el rate limiting se factura por solicitudes evaluadas
  (centavos por millón).

## 8. Pendientes que requieren al administrador de Zoom

- [ ] Confirmar plan de Zoom y que el anfitrión tenga licencia.
- [ ] Confirmar quién administra la cuenta.
- [ ] Crear la app Server-to-Server OAuth con los cuatro scopes de la § 4 y activarla.
- [ ] Cargar `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` en Vercel.
- [ ] Crear la reunión del encuentro con inscripción obligatoria, aprobación
      automática y correo de confirmación activado; pasar el ID.
- [ ] **Prueba real de punta a punta** con 2–3 direcciones de prueba:
      inscripción → llega el correo de Zoom con el enlace → el enlace permite
      entrar → reinscribir el mismo email no genera un segundo correo →
      el inscripto aparece en la lista de Zoom. Hasta completar esto, la
      integración **no** se considera verificada.
- [ ] Verificar si Zoom envía el correo de confirmación para registrantes
      creados por API. Si no lo hiciera, evaluar enviar el `join_url` con
      Resend (ya integrado) — y en ese caso desactivar el correo de Zoom para
      no duplicar mensajes.
- [ ] Configurar la regla de rate limiting del Firewall de Vercel (§ 5.6).
- [ ] Comisión: aprobar el plazo de conservación (§ 6).
