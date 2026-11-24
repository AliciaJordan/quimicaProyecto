/** Panel plegable accesible: usa <details> para conservar teclado y lectores de pantalla. */
export default function Disclosure({ summary, children, className = '' }) {
  return (
    <details className={`disclosure ${className}`.trim()}>
      <summary>
        <span>{summary}</span>
        <span className="disclosure-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="disclosure-content">{children}</div>
    </details>
  )
}
