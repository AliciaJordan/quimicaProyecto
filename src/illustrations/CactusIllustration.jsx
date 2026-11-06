import { SvgFrame } from './RegionHotspots.jsx'

export default function CactusIllustration(props) {
  return (
    <SvgFrame {...props} plant="cactus" title="Ilustración interactiva de un cactus Echinopsis" description="Cactus ornamental con tallo principal, brotes, base, raíces, areolas, espinas y flor seleccionables.">
      <path className="cactus-body" d="M143 291 C126 266 127 222 130 168 L130 122 C130 100 143 83 160 83 C177 83 184 96 184 117 L184 152 C184 132 195 116 211 116 C228 116 238 130 238 150 L238 207 C238 251 221 282 199 298Z" />
      <path className="cactus-rib" d="M151 98 C142 158 143 238 157 279 M169 91 C163 161 164 245 174 289 M188 122 C181 170 184 248 192 292 M211 129 C204 181 207 249 214 273" />
      <path className="cactus-areole" d="M145 143 l5 -4 M145 188 l5 -4 M147 232 l5 -4 M168 127 l5 -4 M169 178 l5 -4 M174 229 l5 -4 M205 154 l5 -4 M207 207 l5 -4 M218 245 l5 -4" />
      <path className="cactus-spine" d="M150 139 l-15 -8 M150 139 l14 -12 M150 184 l-15 -8 M150 184 l14 -11 M152 228 l-14 -7 M152 228 l14 -11 M174 123 l-14 -8 M174 123 l14 -12 M174 174 l-14 -8 M174 174 l14 -12 M179 225 l-14 -8 M179 225 l14 -12 M210 150 l-14 -8 M210 150 l14 -12 M212 203 l-14 -7 M212 203 l14 -11 M222 241 l-13 -7 M222 241 l14 -10" />
      <path className="cactus-flower-stem" d="M205 121 C218 94 226 78 237 62" />
      <g className="cactus-flower"><path d="M237 65 C224 52 227 38 238 31 C249 39 248 52 237 65Z" /><path d="M238 65 C252 51 264 55 268 67 C256 75 245 74 238 65Z" /><path d="M237 64 C230 49 237 39 248 39 C253 52 247 60 237 64Z" /><circle cx="241" cy="62" r="5" /></g>
      <path className="pot" d="M123 296 L237 296 L224 330 Q180 342 136 330Z" />
      <path className="pot-rim" d="M117 293 Q180 286 243 293 L239 305 Q180 312 121 305Z" />
      <path className="cactus-roots" d="M152 306 Q166 293 180 306 Q194 293 208 306" />
    </SvgFrame>
  )
}
