import { SvgFrame } from './RegionHotspots.jsx'

function TomatoLeaf({ d, vein }) {
  return <g className="tomato-leaf"><path d={d} /><path className="leaf-vein" d={vein} /></g>
}

export default function TomatoIllustration(props) {
  return (
    <SvgFrame {...props} plant="tomato" title="Ilustración interactiva de una planta de tomate" description="Planta de tomate con hojas, brotes, tallo, flores y frutos. La punta apical está marcada en el fruto frontal.">
      <path className="plant-stem" d="M179 320 C183 274 171 231 181 190 C190 150 174 112 181 61" />
      <path className="branch-stem" d="M178 218 C139 197 120 165 107 134" />
      <path className="branch-stem" d="M183 202 C220 180 245 156 257 129" />
      <path className="branch-stem" d="M180 258 C146 249 123 260 99 273" />
      <TomatoLeaf d="M113 148 C83 158 68 144 62 126 C80 123 99 130 113 148Z" vein="M65 128 Q91 135 113 148" />
      <TomatoLeaf d="M111 150 C117 119 139 108 157 112 C154 132 137 147 111 150Z" vein="M154 114 Q132 132 111 150" />
      <TomatoLeaf d="M105 154 C76 175 55 170 43 154 C60 139 84 139 105 154Z" vein="M46 154 Q76 151 105 154" />
      <TomatoLeaf d="M220 166 C241 136 263 136 280 148 C267 168 243 176 220 166Z" vein="M277 150 Q246 159 220 166" />
      <TomatoLeaf d="M221 164 C214 131 229 111 247 104 C259 125 248 149 221 164Z" vein="M246 108 Q235 137 221 164" />
      <TomatoLeaf d="M205 177 C184 148 193 125 209 113 C226 132 225 157 205 177Z" vein="M209 116 Q207 148 205 177" />
      <TomatoLeaf d="M105 266 C76 250 72 228 84 211 C105 221 115 242 105 266Z" vein="M86 214 Q100 242 105 266" />
      <TomatoLeaf d="M105 270 C76 287 55 277 47 260 C67 248 91 253 105 270Z" vein="M50 262 Q79 265 105 270" />
      <path className="young-tip" d="M178 76 Q163 58 172 40 Q182 50 183 61 Q190 48 201 47 Q198 67 183 78Z" />
      <g className="tomato-flower">
        <path d="M255 117 Q245 104 251 93 Q260 101 263 111 Q267 98 278 97 Q280 110 268 120 Q282 117 288 126 Q276 133 264 127 Q268 139 259 146 Q250 135 256 125 Q243 131 235 123 Q244 115 255 117Z" />
        <circle cx="261" cy="121" r="6" />
      </g>
      <g className="tomato-fruit">
        <path d="M226 216 C236 205 253 210 260 221 C273 238 266 271 241 279 C217 278 201 253 209 232 C212 224 218 219 226 216Z" />
        <path className="fruit-calyx" d="M234 216 Q222 204 215 207 L225 218 L208 216 L223 223 L215 232 L233 224 L244 233 L240 221 L256 221 L242 216 L247 207Z" />
        <path className="fruit-highlight" d="M218 237 Q218 224 228 222" />
      </g>
      <path className="pot" d="M123 300 L237 300 L224 330 Q180 342 136 330Z" />
      <path className="pot-rim" d="M117 297 Q180 290 243 297 L239 307 Q180 314 121 307Z" />
    </SvgFrame>
  )
}
