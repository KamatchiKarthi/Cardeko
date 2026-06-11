import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline-white'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-brand-accent text-text-inverse hover:brightness-110',
  secondary: 'border border-border bg-surface-overlay text-text-primary hover:bg-surface-raised',
  ghost: 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
  danger: 'bg-status-error text-text-inverse hover:brightness-110',
  'outline-white': 'border border-white/40 text-white hover:bg-white/10',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-8 gap-1.5 rounded-md px-3 text-sm',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
  lg: 'h-12 gap-2.5 rounded-lg px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled ?? loading}
      className={[
        'inline-flex items-center justify-center font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
