import { SvgFrame } from './RegionHotspots.jsx'

function Leaf({ d, vein, className = '' }) {
  return <g className={`rose-leaf ${className}`}><path d={d} /><path className="leaf-vein" d={vein} /></g>
}

export default function RoseIllustration(props) {
  return (
    <SvgFrame {...props} plant="rose" title="Ilustración interactiva de una rosa" description="Rosa en maceta con hojas inferiores y superiores, brotes, tallo y flor seleccionables.">
      <path className="plant-stem" d="M180 322 C171 273 196 229 181 188 C168 151 186 112 181 65" />
      <path className="branch-stem" d="M184 234 C217 213 236 192 244 164" />
      <path className="branch-stem" d="M179 258 C147 242 124 224 108 202" />
      <Leaf d="M112 217 C72 215 57 192 54 168 C83 168 108 183 112 217Z" vein="M57 171 Q86 190 112 217" />
      <Leaf d="M105 223 C78 247 52 245 34 230 C51 210 80 205 105 223Z" vein="M37 230 Q71 221 105 223" />
      <Leaf d="M124 231 C130 265 115 285 94 294 C82 269 94 243 124 231Z" vein="M96 290 Q111 260 124 231" />
      <Leaf d="M224 197 C251 172 278 176 295 191 C278 212 249 219 224 197Z" vein="M291 192 Q257 204 224 197" />
      <Leaf d="M222 201 C213 167 229 144 250 135 C261 160 250 187 222 201Z" vein="M249 139 Q236 170 222 201" />
      <Leaf d="M215 220 C243 225 258 246 257 270 C230 269 211 250 215 220Z" vein="M254 266 Q234 239 215 220" />
      <path className="rose-thorn" d="M178 253 l-12 -9 12 2 M183 210 l12 -10 -11 3 M180 158 l-12 -9 12 2" />
      <path className="bud-stem" d="M181 81 Q207 70 224 67" />
      <g className="rose-flower">
        <ellipse cx="252" cy="59" rx="14" ry="23" transform="rotate(-35 252 59)" />
        <ellipse cx="269" cy="69" rx="14" ry="22" transform="rotate(38 269 69)" />
        <ellipse cx="254" cy="82" rx="15" ry="21" transform="rotate(168 254 82)" />
        <ellipse cx="239" cy="68" rx="13" ry="21" transform="rotate(-60 239 68)" />
        <ellipse cx="255" cy="68" rx="11" ry="15" />
        <circle cx="255" cy="69" r="5" />
      </g>
      <path className="young-tip" d="M178 73 Q166 58 174 42 Q182 52 182 62 Q189 49 199 47 Q198 66 183 76Z" />
      <path className="pot" d="M123 300 L237 300 L224 330 Q180 342 136 330Z" />
      <path className="pot-rim" d="M117 297 Q180 290 243 297 L239 307 Q180 314 121 307Z" />
    </SvgFrame>
  )
}
