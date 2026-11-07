export default function Card({ children, className = '', as: Element = 'div', ...props }) {
  return <Element className={`card ${className}`} {...props}>{children}</Element>
}
