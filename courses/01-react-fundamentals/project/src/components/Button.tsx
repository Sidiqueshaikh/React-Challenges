

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  id?: string
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  active?: boolean
}

export default function Button({
  children,
  onClick,
  type = 'button',
  id,
  variant = 'primary',
  disabled,
  active,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      id={id}
      data-variant={variant}
      data-active={active}
    >
      {children}
    </button>
  )
}