export default function IconButton({ icon: Icon, label, children, className = '', ...props }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} {...props}><Icon size={19} strokeWidth={1.8} aria-hidden="true" />{children}</button>
}
