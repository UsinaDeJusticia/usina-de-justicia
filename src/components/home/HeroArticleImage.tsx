'use client'

import { useState } from 'react'
import Image from 'next/image'

interface HeroArticleImageProps {
  alt: string
  sources: string[]
}

export function HeroArticleImage({ alt, sources }: HeroArticleImageProps) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const src = sources[sourceIndex]

  if (!src) return null

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 460px"
      className="object-cover"
      priority
      fetchPriority="high"
      onError={() => setSourceIndex((index) => index + 1)}
    />
  )
}
