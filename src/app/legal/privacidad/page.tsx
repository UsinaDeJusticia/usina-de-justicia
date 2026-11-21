// La URL canónica pasó a /privacidad (enlazada desde el pie). Esta ruta se
// mantiene porque ya estaba publicada: sigue mostrando el mismo texto y
// declara la canónica nueva, sin redirigir, para no chocar con el 301
// histórico de /privacidad → /legal/privacidad que algunos navegadores
// pueden tener en caché.
export { metadata, default } from '../../privacidad/page'
