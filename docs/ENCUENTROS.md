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
| `src/data/encuentro-actual.ts` | **Configuración mensual** (lo único que se edita cada mes) |
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

La página se regenera cada 5 minutos (ISR, sin llamadas externas), así que el
cierre por fecha se refleja solo. El endpoint valida el cierre al minuto exacto.

## 2. Guía mensual (responsable técnico)

1. **En Zoom** (cuenta de UJ, anfitrión con licencia), crear una reunión **nueva
   y no recurrente** para la convocatoria, con:
   - *Inscripción*: **obligatoria**.
   - *Aprobación*: **automática**.
   - *Notificaciones/correo de confirmación a inscriptos*: **activado**.
   - Preguntas del formulario de Zoom: dejar habilitados *Teléfono*,
     *Cargo* (job title) y *Organización* como opcionales (la web ya los valida).
2. Copiar el **ID de la reunión** (solo números, sin espacios).
3. Editar `src/data/encuentro-actual.ts`:
   ```ts
   export const encuentroActual: Encuentro | null = {
     id: '2026-12-apellido',              // nuevo id por convocatoria
     expositor: 'Nombre Apellido',
     tema: 'Título del encuentro',         // o null = «A confirmar»
     descripcion: null,                    // o un párrafo breve
     inicio: '2026-12-10T19:00:00-03:00',  // SIEMPRE con -03:00
     duracionMinutos: 90,
     cierreInscripcion: null,              // o '2026-12-10T12:00:00-03:00'
     estado: 'abiertas',
     zoomMeetingId: '81234567890',
   }
   ```
4. Abrir un PR, revisar la vista previa de Vercel y mergear. Sin encuentro a la
   vista: `export const encuentroActual: Encuentro | null = null`.
5. Para cerrar antes de tiempo: `estado: 'cerradas'`.

## 3. Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Origen | Entornos |
|---|---|---|
| `ZOOM_ACCOUNT_ID` | App Server-to-Server OAuth → *App Credentials* | Production (y Preview solo para pruebas con una reunión de prueba) |
| `ZOOM_CLIENT_ID` | ídem | ídem |
| `ZOOM_CLIENT_SECRET` | ídem | ídem — marcar como *Sensitive* |

Nunca se escriben en el repositorio ni se comparten por chat. Si faltan, el
endpoint responde 503 con un mensaje honesto (no simula la inscripción).

## 4. App de Zoom: permisos mínimos

Quien administra la cuenta de Zoom de UJ crea en
`marketplace.zoom.us → Develop → Build App` una app **Server-to-Server OAuth**
(interna, no publicada) y le asigna **solo** estos scopes:

| Scope (granular) | Para qué |
|---|---|
| `meeting:write:registrant:admin` | Agregar inscriptos a la reunión |
| `meeting:read:list_registrants:admin` | Detectar inscripciones repetidas por email |

(Si la cuenta usa scopes clásicos: `meeting:write:admin` y `meeting:read:admin`.)
No requiere la contraseña de Diana, Noelia ni de ningún anfitrión.

> Los nombres de scopes se tomaron de la documentación de Zoom conocida al
> momento de escribir esto; `developers.zoom.us` no fue accesible desde el
> entorno de desarrollo. **Verificarlos en el Marketplace al crear la app.**

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
  dentro de esa misma invocación). La página es ISR estática. Consumo despreciable.
- Firewall de Vercel: el rate limiting se factura por solicitudes evaluadas
  (centavos por millón).

## 8. Pendientes que requieren al administrador de Zoom

- [ ] Confirmar plan de Zoom y que el anfitrión tenga licencia.
- [ ] Confirmar quién administra la cuenta.
- [ ] Crear la app Server-to-Server OAuth con los dos scopes de la § 4 y activarla.
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
