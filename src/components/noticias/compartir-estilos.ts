// Clases del botón redondo de compartir, compartidas entre el bloque de
// servidor (CompartirNota.tsx, los enlaces a cada red) y la isla de cliente
// (CompartirAcciones.tsx, compartir nativo y copiar enlace). Viven en su
// propio módulo —una constante, sin JSX— para que importarlas desde el
// componente de servidor no arrastre el `'use client'` del otro archivo.
//
// `no-underline hover:no-underline` es necesario: globals.css subraya todos
// los `<a>` al pasar el mouse, y acá el contenido es un ícono.
export const botonCompartirClasses = [
  'inline-flex items-center justify-center w-10 h-10 shrink-0',
  'rounded-pill border border-grey-200 bg-white text-navy-600',
  'no-underline hover:no-underline',
  'hover:bg-navy-50 hover:text-navy-700 hover:border-navy-200',
  'active:bg-navy-100',
  'transition-colors duration-base ease-out',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-white',
].join(' ')
