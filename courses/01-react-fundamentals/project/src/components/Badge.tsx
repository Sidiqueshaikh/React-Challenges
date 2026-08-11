interface BadgeProps {
  children?: React.ReactNode
  variant?: 'tag' | 'category' | 'priority'
}

export default function Badge({ children, variant = 'tag' }: BadgeProps) {
  return (
    <span data-badge-variant={variant} data-tag={variant === 'tag' ? 'true' : undefined}>
      {children}
    </span>
  )
}