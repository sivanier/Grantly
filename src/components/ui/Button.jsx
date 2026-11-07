export default function Button({ as: Element = 'button', children, variant = 'primary', size = 'md', className = '', ...props }) {
  const buttonType = Element === 'button' && !props.type ? { type: 'button' } : {}
  return <Element className={`button button-${variant} button-${size} ${className}`} {...buttonType} {...props}>{children}</Element>
}
