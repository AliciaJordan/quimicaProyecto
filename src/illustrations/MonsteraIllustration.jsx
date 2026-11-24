import { SvgFrame } from './RegionHotspots.jsx'
import PlantBase from './PlantBase.jsx'

function MonsteraLeaf({ d, vein, holes = '', highlight }) {
  return (
    <g className="monstera-leaf">
      <path d={`${d} ${holes}`} fillRule="evenodd" />
      <path className="leaf-vein" d={vein} />
      {highlight && <path className="leaf-highlight" d={highlight} />}
    </g>
  )
}

export default function MonsteraIllustration(props) {
  return (
    <SvgFrame {...props} plant="monstera" title="Ilustración interactiva de una Monstera deliciosa" description="Monstera con hojas inferiores y superiores, hoja joven, nervaduras, pecíolos, tallo y raíces aéreas seleccionables.">
      <path className="monstera-stem" d="M181 321 C181 274 181 237 184 201 C188 160 185 119 181 67" />
      <path className="monstera-petiole" d="M183 217 C139 197 108 175 88 143 M184 179 C223 161 251 139 267 110 M182 132 C153 116 136 96 124 72" />
      <MonsteraLeaf
        d="M89 145 C45 158 32 129 46 94 C65 61 104 54 128 78 C141 103 122 133 89 145Z"
        vein="M48 98 Q83 116 125 132"
        holes="M73 99 q9 -8 17 0 q-8 9 -17 0Z M101 83 q8 -7 15 1 q-7 8 -15 -1Z"
        highlight="M59 107 Q80 119 99 127"
      />
      <MonsteraLeaf
        d="M266 112 C302 127 319 105 313 74 C301 44 268 40 245 61 C232 80 244 101 266 112Z"
        vein="M309 77 Q278 91 246 105"
        holes="M272 76 q8 -7 15 1 q-7 8 -15 -1Z M257 94 q7 -6 13 1 q-6 7 -13 -1Z"
      />
      <MonsteraLeaf
        d="M125 73 C98 52 106 22 133 16 C163 12 181 35 171 61 C157 79 141 80 125 73Z"
        vein="M133 18 Q142 43 161 62"
      />
      <path className="monstera-aerial-root" d="M203 213 C215 232 211 247 219 260 M202 218 C190 239 197 253 188 271 M216 217 C232 229 229 242 239 252" />
      <PlantBase>
        <path className="monstera-aerial-root" d="M160 303 Q171 294 180 302 Q190 294 201 303" />
      </PlantBase>
    </SvgFrame>
  )
}
