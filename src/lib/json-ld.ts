/**
 * Serializa un objeto para incrustarlo dentro de `<script type="application/ld+json">`.
 *
 * `JSON.stringify` a secas no alcanza aca, y el motivo no es evidente: **no
 * escapa `<`**. Dentro de un `<script>`, el navegador no esta leyendo JSON:
 * esta buscando el cierre de la etiqueta. Un valor que contenga la secuencia
 * `</script` termina el bloque antes de tiempo, y lo que venga despues se
 * interpreta como HTML del documento. Con datos que vienen de un CMS donde
 * escriben varias personas, eso es una via de inyeccion.
 *
 * Escapar `<` lo cierra: es JSON valido, se decodifica al mismo caracter, y
 * schema.org lo interpreta identico, pero el navegador ya no ve una etiqueta.
 *
 * Los otros dos son U+2028 y U+2029, separadores de linea de Unicode que
 * `JSON.stringify` deja crudos y que JavaScript trata como saltos de linea
 * reales, rompiendo el literal.
 *
 * Los tres patrones van escritos como escapes y no como el caracter en si.
 * La primera version de este archivo puso los separadores literales y se
 * rompio sola, sin llegar a compilar: una demostracion bastante directa de
 * por que existe esta funcion.
 *
 * Al 27-ago-2026 no habia forma conocida de explotar esto en el sitio: los
 * titulos pasan por un limpiador de etiquetas y los nombres de categoria los
 * escapa WordPress. Pero esa defensa es indirecta, depende de un regex
 * escrito con fines cosmeticos y de una decision de un CMS de terceros, y
 * esto cuesta una funcion.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/\u003c/g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
