import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
  elevated?: boolean
}

export default function Card({
  padded = true,
  elevated = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={[
        'rounded-xl border border-border bg-surface',
        padded ? 'p-4 sm:p-6' : '',
        elevated ? 'shadow-md' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
