import { SvgFrame } from './RegionHotspots.jsx'

function MonsteraLeaf({ d, vein }) {
  return <g className="monstera-leaf"><path d={d} /><path className="leaf-vein" d={vein} /><path className="monstera-fenestration" d="M0 0" /></g>
}

export default function MonsteraIllustration(props) {
  return (
    <SvgFrame {...props} plant="monstera" title="Ilustración interactiva de una Monstera deliciosa" description="Monstera con hojas inferiores y superiores, hoja joven, nervaduras, pecíolos, tallo y raíces aéreas seleccionables.">
      <path className="monstera-stem" d="M181 321 C181 274 181 237 184 201 C188 160 185 119 181 67" />
      <path className="monstera-petiole" d="M183 217 C139 197 108 175 88 143 M184 179 C223 161 251 139 267 110 M182 132 C153 116 136 96 124 72" />
      <MonsteraLeaf d="M89 145 C45 158 32 129 46 94 C65 61 104 54 128 78 C141 103 122 133 89 145Z" vein="M48 98 Q83 116 125 132" />
      <MonsteraLeaf d="M266 112 C302 127 319 105 313 74 C301 44 268 40 245 61 C232 80 244 101 266 112Z" vein="M309 77 Q278 91 246 105" />
      <MonsteraLeaf d="M125 73 C98 52 106 22 133 16 C163 12 181 35 171 61 C157 79 141 80 125 73Z" vein="M133 18 Q142 43 161 62" />
      <path className="monstera-hole" d="M73 99 q9 -8 17 0 q-8 9 -17 0 M101 83 q8 -7 15 1 q-7 8 -15 -1 M272 76 q8 -7 15 1 q-7 8 -15 -1 M257 94 q7 -6 13 1 q-6 7 -13 -1" />
      <path className="monstera-aerial-root" d="M203 213 C215 232 211 247 219 260 M202 218 C190 239 197 253 188 271 M216 217 C232 229 229 242 239 252" />
      <path className="pot" d="M123 296 L237 296 L224 330 Q180 342 136 330Z" />
      <path className="pot-rim" d="M117 293 Q180 286 243 293 L239 305 Q180 312 121 305Z" />
    </SvgFrame>
  )
}
