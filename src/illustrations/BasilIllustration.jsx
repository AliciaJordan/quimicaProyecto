import { SvgFrame } from './RegionHotspots.jsx'

function BasilLeaf({ d, vein }) {
  return <g className="basil-leaf"><path d={d} /><path className="leaf-vein" d={vein} /></g>
}

export default function BasilIllustration(props) {
  return (
    <SvgFrame {...props} plant="basil" title="Ilustración interactiva de una planta de albahaca" description="Albahaca en maceta con hojas inferiores y superiores, brotes, tallos e inflorescencia seleccionables.">
      <path className="plant-stem" d="M180 321 C181 270 174 224 183 183 C188 145 180 111 182 69" />
      <path className="branch-stem" d="M179 246 C144 225 124 204 111 177" />
      <path className="branch-stem" d="M181 227 C213 210 234 190 245 164" />
      <path className="branch-stem" d="M181 184 C153 164 143 146 141 126" />
      <BasilLeaf d="M112 187 C79 198 56 183 53 161 C76 150 101 162 112 187Z" vein="M57 163 Q85 174 112 187" />
      <BasilLeaf d="M114 189 C125 160 150 154 169 166 C158 188 137 198 114 189Z" vein="M165 169 Q139 181 114 189" />
      <BasilLeaf d="M102 236 C76 219 73 193 89 178 C111 194 116 216 102 236Z" vein="M91 182 Q105 207 102 236" />
      <BasilLeaf d="M227 174 C249 148 274 151 286 168 C268 188 246 193 227 174Z" vein="M282 169 Q254 177 227 174" />
      <BasilLeaf d="M228 176 C213 148 224 126 243 118 C261 137 253 160 228 176Z" vein="M241 122 Q236 148 228 176" />
      <BasilLeaf d="M207 193 C185 171 190 147 207 135 C227 153 227 175 207 193Z" vein="M208 139 Q208 166 207 193" />
      <BasilLeaf d="M141 145 C120 127 125 107 140 96 C159 111 159 132 141 145Z" vein="M141 100 Q143 124 141 145" />
      <BasilLeaf d="M143 145 C153 121 175 117 190 128 C179 148 161 155 143 145Z" vein="M187 130 Q165 139 143 145" />
      <path className="young-tip" d="M178 82 Q163 63 173 44 Q182 53 183 65 Q191 51 201 51 Q199 71 183 84Z" />
      <g className="basil-flower">
        <path d="M181 82 L181 47 M181 61 L165 52 M181 66 L198 55 M181 72 L167 69 M181 75 L196 66" />
        <circle cx="165" cy="51" r="4" /><circle cx="199" cy="54" r="4" /><circle cx="167" cy="68" r="4" /><circle cx="197" cy="65" r="4" /><circle cx="181" cy="45" r="4" />
      </g>
      <path className="pot" d="M123 300 L237 300 L224 330 Q180 342 136 330Z" />
      <path className="pot-rim" d="M117 297 Q180 290 243 297 L239 307 Q180 314 121 307Z" />
    </SvgFrame>
  )
}
