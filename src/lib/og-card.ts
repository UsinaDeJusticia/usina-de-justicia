const MAX_SOURCE_BYTES = 5 * 1024 * 1024
const IMAGE_FETCH_TIMEOUT_MS = 5_000
const IMAGE_REVALIDATE_SECONDS = 86_400

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

async function readBodyWithinLimit(response: Response): Promise<Uint8Array | null> {
  const reader = response.body?.getReader()
  if (!reader) return null

  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      totalBytes += value.byteLength
      if (totalBytes > MAX_SOURCE_BYTES) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
  } catch {
    return null
  } finally {
    reader.releaseLock()
  }

  const body = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return body
}

function hasImageSignature(buffer: Uint8Array, contentType: string): boolean {
  if (contentType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  }
  return contentType === 'image/png' && PNG_SIGNATURE.every((byte, index) => buffer[index] === byte)
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return btoa(binary)
}

async function discardBody(response: Response): Promise<void> {
  try {
    await response.body?.cancel()
  } catch {
    // A failed cancellation must not turn the branded fallback into an error.
  }
}

function isAllowedWordPressMediaUrl(url: URL): boolean {
  if (
    url.protocol !== 'https:' ||
    (url.port !== '' && url.port !== '443') ||
    url.username !== '' ||
    url.password !== '' ||
    !url.pathname.startsWith('/wp-content/uploads/')
  ) return false

  const allowedHosts = new Set(['usinadejusticia.org.ar'])
  const configuredHost = process.env.WP_HOST?.toLowerCase()
  if (configuredHost) allowedHosts.add(configuredHost)

  try {
    const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL
      ? new URL(process.env.NEXT_PUBLIC_WP_API_URL)
      : null
    if (apiUrl) allowedHosts.add(apiUrl.hostname.toLowerCase())
  } catch {
    return false
  }

  return allowedHosts.has(url.hostname.toLowerCase())
}

/** Fetches a pre-sized WordPress JPEG/PNG for Satori without loading originals or transcoding. */
export async function fetchOgImageDataUri(url: string): Promise<string | null> {
  try {
    const imageUrl = new URL(url)
    if (!isAllowedWordPressMediaUrl(imageUrl)) return null

    const response = await fetch(url, {
      redirect: 'error',
      next: { revalidate: IMAGE_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
    })
    if (response.status !== 200) {
      await discardBody(response)
      return null
    }

    const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase()
    if (contentType !== 'image/jpeg' && contentType !== 'image/png') {
      await discardBody(response)
      return null
    }

    const contentLength = response.headers.get('content-length')
    const declaredLength = contentLength === null ? NaN : Number(contentLength)
    if (Number.isFinite(declaredLength) && declaredLength > MAX_SOURCE_BYTES) {
      await discardBody(response)
      return null
    }

    const bytes = await readBodyWithinLimit(response)
    if (!bytes?.length || !hasImageSignature(bytes, contentType)) return null

    return `data:${contentType};base64,${toBase64(bytes)}`
  } catch {
    return null
  }
}

/** Keeps titles readable in a 1200×630 card and never splits a surrogate pair. */
export function truncateOgTitle(title: string, maxCharacters = 100): string {
  const characters = Array.from(title.trim())
  if (characters.length === 0) return 'Usina de Justicia'
  if (characters.length <= maxCharacters) return characters.join('')
  return `${characters.slice(0, Math.max(1, maxCharacters - 1)).join('').trimEnd()}…`
}
