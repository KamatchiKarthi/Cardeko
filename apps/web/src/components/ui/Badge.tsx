import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClass: Record<BadgeVariant, string> = {
  default: 'bg-surface-overlay text-text-secondary',
  accent: 'bg-blue-50 text-brand-accent',
  success: 'bg-green-50 text-status-success',
  warning: 'bg-amber-50 text-status-warning',
  error: 'bg-red-50 text-status-error',
  info: 'bg-sky-50 text-status-info',
}

export default function Badge({
  variant = 'default',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClass[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
