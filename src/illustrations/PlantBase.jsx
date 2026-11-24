export default function PlantBase({ children }) {
  return (
    <>
      <path className="pot" d="M123 300 L237 300 L224 330 Q180 342 136 330Z" />
      <path className="pot-rim" d="M117 297 Q180 290 243 297 L239 307 Q180 314 121 307Z" />
      <path className="soil-line" fill="none" d="M125 295 Q180 288 235 295" />
      {children}
    </>
  )
}
