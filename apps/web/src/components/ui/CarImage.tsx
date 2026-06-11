import { useState } from 'react'

interface CarImageProps {
  src: string | null | undefined
  alt: string
  gradient: string
  className?: string
  imgClassName?: string
}

export default function CarImage({
  src,
  alt,
  gradient,
  className = '',
  imgClassName = '',
}: CarImageProps) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = src?.trim() ?? ''
  const showImage = imageSrc.length > 0 && !hasError

  if (!showImage) {
    return (
      <div
        className={['bg-gradient-to-br', gradient, className].filter(Boolean).join(' ')}
        role="img"
        aria-label={alt}
      />
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={[className, imgClassName].filter(Boolean).join(' ')}
      onError={() => setHasError(true)}
      loading="lazy"
      decoding="async"
    />
  )
}
