/**
 * Reglas educativas editables. Las puntuaciones ordenan compatibilidad con
 * síntomas observados; no representan probabilidades ni diagnósticos clínicos.
 */
import { evaluateHypothesis } from './hypothesisEngine.js'
import { getPlantProfile, plantProfileList } from './plantProfiles.js'

export const diagnosticOptions = {
  plants: [
    ...plantProfileList.map(({ id: value, label }) => ({ value, label })),
  ],
  locations: [
    { value: 'old_leaves', label: 'Hojas viejas' },
    { value: 'young_leaves', label: 'Hojas jóvenes' },
    { value: 'leaves', label: 'Hojas (edad no confirmada)' },
    { value: 'shoots', label: 'Brotes' },
    { value: 'stem', label: 'Tallo' },
    { value: 'flower', label: 'Flor' },
    { value: 'fruit', label: 'Fruto' },
    { value: 'fruit_tip', label: 'Punta del fruto' },
    { value: 'cactus_stem', label: 'Tallo principal' },
    { value: 'cactus_shoots', label: 'Brotes nuevos' },
    { value: 'cactus_base', label: 'Base del tallo' },
    { value: 'cactus_roots', label: 'Raíces' },
    { value: 'cactus_areoles', label: 'Areolas y espinas' },
    { value: 'cactus_flower', label: 'Flor' },
    { value: 'monstera_lower_leaves', label: 'Hojas inferiores' },
    { value: 'monstera_upper_leaves', label: 'Hojas superiores' },
    { value: 'monstera_young_leaves', label: 'Hojas jóvenes' },
    { value: 'monstera_edges', label: 'Bordes de las hojas' },
    { value: 'monstera_veins', label: 'Nervaduras' },
    { value: 'monstera_stem', label: 'Tallo' },
    { value: 'monstera_petiole', label: 'Pecíolos' },
    { value: 'monstera_aerial_roots', label: 'Raíces aéreas' },
    { value: 'monstera_roots', label: 'Raíces del sustrato' },
  ],
  symptoms: [
    { value: 'general_yellowing', label: 'Amarillamiento general' },
    { value: 'interveinal_yellowing', label: 'Amarillamiento entre nervaduras' },
    { value: 'dry_edges', label: 'Bordes secos' },
    { value: 'brown_spots', label: 'Manchas cafés' },
    { value: 'slow_growth', label: 'Crecimiento lento' },
    { value: 'young_green_veins', label: 'Hojas jóvenes amarillas con nervaduras verdes' },
    { value: 'damaged_new_shoots', label: 'Brotes nuevos dañados' },
    { value: 'blossom_end_rot', label: 'Mancha café hundida en la punta del fruto' },
    { value: 'cactus_stem_yellowing', label: 'Amarillamiento del tallo' },
    { value: 'cactus_softness', label: 'Ablandamiento o pérdida de firmeza' },
    { value: 'cactus_wrinkling', label: 'Arrugas o deshidratación' },
    { value: 'cactus_dark_spots', label: 'Manchas oscuras' },
    { value: 'cactus_stunted_growth', label: 'Crecimiento detenido' },
    { value: 'cactus_base_rot', label: 'Pudrición en la base' },
    { value: 'cactus_shoot_changes', label: 'Alteraciones en los brotes' },
    { value: 'cactus_no_flowering', label: 'Falta de floración' },
    { value: 'monstera_general_yellowing', label: 'Amarillamiento general' },
    { value: 'monstera_interveinal_chlorosis', label: 'Clorosis intervenal' },
    { value: 'monstera_brown_edges', label: 'Bordes cafés' },
    { value: 'monstera_dry_tips', label: 'Puntas secas' },
    { value: 'monstera_dark_spots', label: 'Manchas oscuras' },
    { value: 'monstera_deformed_new_leaves', label: 'Hojas nuevas deformadas' },
    { value: 'monstera_no_fenestrations', label: 'Ausencia de fenestraciones' },
    { value: 'monstera_slow_growth', label: 'Crecimiento lento' },
    { value: 'monstera_wilting', label: 'Marchitez' },
    { value: 'monstera_root_problems', label: 'Problemas en raíces' },
  ],
  irrigation: [
    { value: 'regular', label: 'Regular, sin encharcamiento' },
    { value: 'irregular', label: 'Irregular' },
    { value: 'waterlogged', label: 'Hay encharcamiento' },
  ],
  contextQuestions: Object.fromEntries(plantProfileList.map((profile) => [profile.id, profile.questions])),
}

const validValues = {
  plant: diagnosticOptions.plants.map(({ value }) => value),
  location: diagnosticOptions.locations.map(({ value }) => value),
  symptom: diagnosticOptions.symptoms.map(({ value }) => value),
  irrigation: diagnosticOptions.irrigation.map(({ value }) => value),
}

const plantNames = { rose: 'rosa', tomato: 'tomate', basil: 'albahaca', cactus: 'cactus', monstera: 'monstera' }

const nutrientHypotheses = {
  nitrogen: {
    id: 'nitrogen', kind: 'nutrient', nutrient: 'N', classification: 'Macronutriente', title: 'Disponibilidad baja de nitrógeno',
    sourceIds: ['nutrientPatterns'],
    mechanism: 'La planta incorpora nitrato o amonio a aminoácidos, proteínas y clorofila; una disponibilidad baja puede limitar el crecimiento y el verdor.',
    recommendation: 'Revisa la edad de las hojas afectadas y el historial del sustrato. Confirma con un análisis antes de cambiar la fertilización.',
  },
  magnesium: {
    id: 'magnesium', kind: 'nutrient', nutrient: 'Mg', classification: 'Macronutriente', title: 'Disponibilidad baja de magnesio',
    sourceIds: ['nutrientPatterns'],
    mechanism: 'El Mg²⁺ forma parte de la clorofila y participa en la actividad de enzimas. Su baja disponibilidad puede acompañarse de clorosis entre nervaduras, a menudo primero en hojas viejas.',
    recommendation: 'Compara varias hojas de distintas edades y revisa pH y análisis del sustrato; síntomas parecidos pueden tener otras causas.',
  },
  potassium: {
    id: 'potassium', kind: 'nutrient', nutrient: 'K', classification: 'Macronutriente', title: 'Disponibilidad baja de potasio',
    sourceIds: ['nutrientPatterns'],
    mechanism: 'El K⁺ participa en regulación hídrica y activación de enzimas. Bordes secos pueden ser compatibles, pero también aparecen por sequía, sales o daño ambiental.',
    recommendation: 'Revisa humedad, drenaje y posible acumulación de sales. Los bordes secos por sí solos no justifican añadir potasio.',
  },
  iron: {
    id: 'iron', kind: 'nutrient', nutrient: 'Fe', classification: 'Micronutriente', title: 'Baja disponibilidad de hierro',
    sourceIds: ['ironChlorosis'],
    mechanism: 'El hierro participa en reacciones de transferencia de electrones. Un pH alto puede reducir su disponibilidad; el hierro no es el átomo central de la clorofila.',
    recommendation: 'Mide el pH del sustrato o agua y considera el drenaje. No intentes acidificar sin una medición y conocer el sistema de cultivo.',
  },
  calcium: {
    id: 'calcium', kind: 'nutrient', nutrient: 'Ca', classification: 'Macronutriente', title: 'Problema de suministro o transporte de calcio',
    sourceIds: ['nutrientPatterns'],
    mechanism: 'El Ca²⁺ contribuye a paredes celulares y membranas. Su llegada a tejidos en desarrollo depende del transporte con agua; estrés hídrico o raíces afectadas pueden limitarlo aunque exista calcio en el suelo.',
    recommendation: 'Revisa raíces, drenaje y regularidad del agua. No añadas calcio automáticamente sin revisar el pH y el análisis.',
  },
}

const alternativeHypotheses = {
  water: {
    id: 'water_stress', kind: 'environmental', title: 'Estrés hídrico o de raíces', sourceIds: ['nonNutrientCauses'],
    mechanism: 'Sequía, encharcamiento y raíces con poco oxígeno pueden alterar absorción y transporte de minerales, además de producir síntomas inespecíficos.',
    recommendation: 'Comprueba la humedad dentro de la zona radicular, el drenaje y el estado de raíces antes de modificar nutrientes.',
  },
  other: {
    id: 'other_causes', kind: 'alternative', title: 'Otras causas no nutricionales', sourceIds: ['nonNutrientCauses'],
    mechanism: 'Plagas, enfermedades, salinidad, temperatura, luz o daño físico pueden parecerse a una deficiencia nutricional.',
    recommendation: 'Observa la distribución del daño, el envés de las hojas y la evolución; consulta a un especialista si progresa o afecta varias plantas.',
  },
}

const specializedHypotheses = {
  cactusWaterlogging: {
    id: 'cactus_waterlogging', kind: 'environmental', title: 'Exceso de humedad o drenaje insuficiente',
    sourceIds: ['cactusCare'], mechanism: 'En un cactus, la humedad persistente reduce el oxígeno disponible para las raíces y puede preceder a pérdida de firmeza, manchas oscuras o pudrición en la base.',
    recommendation: 'Comprueba cuánto tarda en secar el sustrato, revisa los orificios y observa la base y las raíces antes de añadir nutrientes.',
  },
  cactusDehydration: {
    id: 'cactus_dehydration', kind: 'environmental', title: 'Deshidratación o aporte de agua insuficiente',
    sourceIds: ['cactusCare'], mechanism: 'Las arrugas y la pérdida de turgencia pueden aparecer cuando el tejido almacenador usa sus reservas de agua; deben distinguirse de un tallo blando por pudrición.',
    recommendation: 'Compara firmeza en varias zonas, revisa raíces y confirma que el sustrato se seca de forma adecuada entre riegos.',
  },
  cactusLight: {
    id: 'cactus_light', kind: 'environmental', title: 'Estrés por iluminación insuficiente',
    sourceIds: ['cactusCare'], mechanism: 'La luz participa en la fotosíntesis del tallo y en el balance de crecimiento; poca luz puede contribuir a crecimiento detenido o falta de floración.',
    recommendation: 'Revisa la intensidad y duración de la luz y cambia la ubicación gradualmente para evitar quemaduras.',
  },
  cactusRoot: {
    id: 'cactus_root_problem', kind: 'environmental', title: 'Problema de raíces o pudrición',
    sourceIds: ['cactusCare'], mechanism: 'Una base blanda, oscura o con olor anormal puede indicar daño tisular y radicular; no debe interpretarse automáticamente como falta de fertilizante.',
    recommendation: 'Inspecciona raíces y base con cuidado, suspende correcciones nutricionales y consulta si el tejido afectado progresa.',
  },
  monsteraWaterlogging: {
    id: 'monstera_waterlogging', kind: 'environmental', title: 'Exceso de riego o raíces con poco oxígeno',
    sourceIds: ['monsteraCare'], mechanism: 'El sustrato saturado desplaza aire de los poros y puede dañar raíces; amarillamiento, manchas y marchitez pueden coexistir con este problema.',
    recommendation: 'Revisa humedad dentro de la maceta, drenaje y raíces antes de fertilizar. Deja que el medio se airee según las condiciones reales.',
  },
  monsteraDryness: {
    id: 'monstera_dryness', kind: 'environmental', title: 'Estrés por falta de agua o humedad ambiental',
    sourceIds: ['monsteraCare'], mechanism: 'Puntas y bordes secos pueden relacionarse con secado excesivo, riego irregular o ambiente seco; el síntoma no identifica por sí solo un nutriente.',
    recommendation: 'Compara humedad del sustrato, frecuencia de riego y ambiente. Observa si el daño aparece primero en hojas expuestas.',
  },
  monsteraLight: {
    id: 'monstera_light', kind: 'environmental', title: 'Luz insuficiente para el desarrollo',
    sourceIds: ['monsteraCare'], mechanism: 'La luz indirecta brillante sostiene la fotosíntesis y el desarrollo de hojas maduras; una hoja joven puede no tener fenestraciones todavía.',
    recommendation: 'Evalúa la luz indirecta disponible y la madurez de la hoja antes de atribuir la ausencia de fenestraciones a nutrición.',
  },
  monsteraNutrient: {
    id: 'monstera_nutrient_availability', kind: 'nutrient', nutrient: 'Fe', classification: 'Micronutriente', title: 'Disponibilidad limitada de hierro o magnesio',
    sourceIds: ['nutrientPatterns', 'ironChlorosis'], mechanism: 'La clorosis intervenal puede relacionarse con hierro o magnesio, pero la edad de la hoja, el pH, las raíces y la luz son necesarios para separar ambas posibilidades.',
    recommendation: 'Confirma el patrón en varias hojas y mide pH; no apliques micronutrientes sin revisar raíces y disponibilidad.',
  },
}

const plantContext = {
  rose: 'En rosa, clima, edad de la hoja y condiciones de raíces también pueden cambiar el aspecto del follaje.',
  tomato: 'En tomate, el fruto y la estabilidad del riego aportan contexto; la mancha apical no demuestra por sí sola falta de calcio en el suelo.',
  basil: 'En albahaca, considera edad de hojas, luz y humedad del sustrato al interpretar el amarillamiento o el crecimiento lento.',
  cactus: 'En Echinopsis, el almacenamiento de agua, el drenaje, la luz y la firmeza del tallo suelen ser más informativos que asumir una deficiencia nutricional.',
  monstera: 'En Monstera deliciosa, la madurez de la hoja, la luz indirecta, la humedad ambiental, las raíces y el drenaje condicionan el aspecto del follaje.',
}

export function getAvailableSymptoms(plant) {
  const profile = getPlantProfile(plant)
  return diagnosticOptions.symptoms.filter((option) => profile?.symptoms.includes(option.value))
}

export function validateDiagnosticInput(input = {}) {
  const errors = []
  for (const field of ['plant', 'location', 'symptom', 'irrigation']) {
    if (!validValues[field].includes(input[field])) errors.push({ field, message: `Selecciona un valor válido para ${field}.` })
  }
  const profile = getPlantProfile(input.plant)
  if (profile && !profile.locations.includes(input.location)) errors.push({ field: 'location', message: `La zona seleccionada no corresponde a ${profile.label}.` })
  if (profile && !profile.symptoms.includes(input.symptom)) errors.push({ field: 'symptom', message: `El síntoma seleccionado no corresponde a ${profile.label}.` })
  const hasPh = input.ph !== '' && input.ph !== null && input.ph !== undefined && !(typeof input.ph === 'string' && input.ph.trim() === '')
  let ph = null
  if (hasPh) {
    const phInputIsNumeric = typeof input.ph === 'number' || typeof input.ph === 'string'
    ph = phInputIsNumeric ? Number(input.ph) : Number.NaN
    if (!Number.isFinite(ph) || ph < 0 || ph > 14) errors.push({ field: 'ph', message: 'El pH debe ser un número entre 0 y 14, o dejarse vacío.' })
  }
  if (input.symptom === 'blossom_end_rot' && (input.plant !== 'tomato' || !['fruit', 'fruit_tip'].includes(input.location))) {
    errors.push({ field: 'symptom', message: 'La mancha apical se evalúa en fruto de tomate; selecciona el fruto o su punta.' })
  }
  for (const question of profile?.questions || []) {
    if (!question.options.some((option) => option.value === input.context?.[question.id])) {
      errors.push({ field: `context.${question.id}`, message: `Responde: ${question.label.toLowerCase()}.` })
    }
  }
  return { valid: errors.length === 0, errors, ph: errors.some((error) => error.field === 'ph') ? null : ph }
}

function scoreHypothesis(definition, points, input, notes = []) {
  return evaluateHypothesis({
    definition: { ...definition, notes },
    points,
    input,
    plantContext,
  })
}

function buildDifferential(input, ph) {
  const { plant, location, symptom, irrigation, context = {} } = input
  const candidates = []
  const add = (definition, points, notes) => candidates.push(scoreHypothesis(definition, points, input, notes))

  if (plant === 'cactus') {
    const waterSymptom = ['cactus_softness', 'cactus_base_rot', 'cactus_dark_spots', 'cactus_stem_yellowing'].includes(symptom)
    if (waterSymptom) {
      add(specializedHypotheses.cactusWaterlogging, [
        { matches: context.cactus_substrate_moisture === 'few_days' || context.cactus_substrate_moisture === 'week_plus', weight: 2, text: 'El sustrato permanece húmedo durante varios días.', missing: context.cactus_substrate_moisture === 'unknown' ? 'No se confirmó cuánto tarda en secar el sustrato.' : null },
        { matches: context.cactus_drainage === 'no', weight: 2, text: 'La maceta no tiene orificios de drenaje.', missing: context.cactus_drainage === 'unknown' ? 'No se confirmó si la maceta tiene drenaje.' : null },
        { matches: irrigation === 'waterlogged', weight: 2, text: 'Se reporta encharcamiento.', conflict: irrigation === 'regular' ? 'Se reporta riego regular sin encharcamiento; esto no respalda por sí solo exceso de humedad.' : null, penalty: 1 },
        { matches: location === 'cactus_base' || location === 'cactus_roots', weight: 1, text: 'La zona seleccionada es la base o las raíces.', missing: !['cactus_base', 'cactus_roots'].includes(location) ? 'No se inspeccionó directamente la base ni las raíces.' : null },
      ])
    }
    if (['cactus_wrinkling', 'cactus_softness'].includes(symptom)) {
      add(specializedHypotheses.cactusDehydration, [
        { matches: symptom === 'cactus_wrinkling', weight: 2, text: 'Se reportan arrugas o deshidratación.', missing: symptom !== 'cactus_wrinkling' ? 'No se confirmó un patrón de arrugas.' : null },
        { matches: context.cactus_substrate_moisture === 'same_day' || irrigation === 'irregular', weight: 2, text: context.cactus_substrate_moisture === 'same_day' ? 'El sustrato seca el mismo día.' : 'Se reporta riego irregular.', missing: context.cactus_substrate_moisture === 'unknown' && irrigation === 'regular' ? 'No se registró una señal clara de secado o riego irregular.' : null },
        { matches: location === 'cactus_stem', weight: 1, text: 'El cambio se observa en el tallo principal.', missing: location !== 'cactus_stem' ? 'No se ubicó el cambio en el tallo principal.' : null },
      ])
    }
    if (['cactus_stunted_growth', 'cactus_no_flowering'].includes(symptom)) {
      add(specializedHypotheses.cactusLight, [
        { matches: context.cactus_light === 'low', weight: 2, text: 'Se reporta poca luz.', missing: !context.cactus_light ? 'No se registró la iluminación.' : null, conflict: context.cactus_light === 'direct' ? 'Se reporta luz directa; la falta de luz no queda respaldada por este dato.' : null, penalty: 1 },
        { matches: symptom === 'cactus_no_flowering', weight: 1, text: 'Se reporta falta de floración.', missing: symptom !== 'cactus_no_flowering' ? 'No se confirmó la ausencia de floración.' : null },
        { matches: location === 'cactus_flower' || location === 'cactus_shoots', weight: 1, text: 'La zona seleccionada se relaciona con floración o brotes.', missing: !['cactus_flower', 'cactus_shoots'].includes(location) ? 'No se seleccionó flor ni brotes.' : null },
      ])
    }
    if (['cactus_base_rot', 'cactus_softness', 'cactus_dark_spots'].includes(symptom)) {
      add(specializedHypotheses.cactusRoot, [
        { matches: symptom === 'cactus_base_rot', weight: 2, text: 'Se reporta pudrición en la base.', missing: symptom !== 'cactus_base_rot' ? 'No se confirmó pudrición en la base.' : null },
        { matches: location === 'cactus_base' || location === 'cactus_roots', weight: 2, text: 'La observación se ubica en base o raíces.', missing: !['cactus_base', 'cactus_roots'].includes(location) ? 'Falta revisar base y raíces directamente.' : null },
        { matches: context.cactus_substrate_moisture === 'week_plus' || context.cactus_drainage === 'no', weight: 1, text: 'La humedad persistente o la ausencia de drenaje puede comprometer las raíces.', missing: context.cactus_substrate_moisture === 'unknown' && context.cactus_drainage === 'unknown' ? 'Falta confirmar humedad persistente y drenaje.' : null },
      ])
    }
  }

  if (plant === 'monstera') {
    if (['monstera_general_yellowing', 'monstera_dark_spots', 'monstera_wilting', 'monstera_root_problems'].includes(symptom)) {
      add(specializedHypotheses.monsteraWaterlogging, [
        { matches: irrigation === 'waterlogged' || context.monstera_watering_frequency === 'every_few_days', weight: 2, text: irrigation === 'waterlogged' ? 'Se reporta encharcamiento.' : 'Se riega cada pocos días.', missing: !['waterlogged'].includes(irrigation) && !context.monstera_watering_frequency ? 'No se registró la frecuencia de riego.' : null },
        { matches: symptom === 'monstera_root_problems' || symptom === 'monstera_wilting', weight: 2, text: 'El síntoma puede comprometer o reflejar el estado de las raíces.', missing: !['monstera_root_problems', 'monstera_wilting'].includes(symptom) ? 'No se confirmó marchitez ni un problema directo en raíces.' : null },
        { matches: location === 'monstera_roots', weight: 1, text: 'Se seleccionaron las raíces del sustrato.', missing: location !== 'monstera_roots' ? 'No se inspeccionaron directamente las raíces del sustrato.' : null },
      ])
    }
    if (['monstera_brown_edges', 'monstera_dry_tips', 'monstera_wilting'].includes(symptom)) {
      add(specializedHypotheses.monsteraDryness, [
        { matches: symptom === 'monstera_brown_edges' || symptom === 'monstera_dry_tips', weight: 2, text: 'Se reportan bordes o puntas secas.', missing: symptom === 'monstera_wilting' ? 'No se confirmaron bordes o puntas secas.' : null },
        { matches: irrigation === 'irregular' || context.monstera_watering_frequency === 'weekly', weight: 2, text: irrigation === 'irregular' ? 'Se reporta riego irregular.' : 'El riego se realiza aproximadamente una vez por semana.', missing: !['irregular'].includes(irrigation) && !context.monstera_watering_frequency ? 'No se registró la frecuencia de riego.' : null },
        { matches: location === 'monstera_edges', weight: 1, text: 'La zona seleccionada son los bordes de las hojas.', missing: location !== 'monstera_edges' ? 'No se ubicó el daño en los bordes.' : null },
      ])
    }
    if (['monstera_no_fenestrations', 'monstera_slow_growth'].includes(symptom)) {
      add(specializedHypotheses.monsteraLight, [
        { matches: context.monstera_light === 'low', weight: 2, text: 'Se reporta poca luz.', missing: !context.monstera_light ? 'No se registró la iluminación.' : null, conflict: context.monstera_light === 'bright_indirect' ? 'Se reporta luz indirecta brillante; la falta de luz no queda respaldada por este dato.' : null, penalty: 1 },
        { matches: symptom === 'monstera_no_fenestrations' && context.monstera_leaf_maturity === 'mature', weight: 2, text: 'La ausencia de fenestraciones se observa en hojas maduras.', unknown: symptom === 'monstera_no_fenestrations' && context.monstera_leaf_maturity === 'young' ? 'La hoja es joven; las fenestraciones pueden aparecer con la madurez.' : null, missing: !context.monstera_leaf_maturity ? 'No se confirmó si las hojas son nuevas o maduras.' : null },
        { matches: symptom === 'monstera_slow_growth', weight: 1, text: 'Se reporta crecimiento lento.', missing: symptom !== 'monstera_slow_growth' ? 'No se confirmó crecimiento lento.' : null },
      ])
    }
    if (symptom === 'monstera_interveinal_chlorosis') {
      add(specializedHypotheses.monsteraNutrient, [
        { matches: true, weight: 2, text: 'Se describe clorosis intervenal.', missing: null },
        { matches: location === 'monstera_veins', weight: 1, text: 'La zona seleccionada son las nervaduras.', missing: location !== 'monstera_veins' ? 'No se confirmó que el patrón se ubique alrededor de las nervaduras.' : null },
        { matches: ph !== null && ph >= 7, weight: 1, text: `El pH registrado (${ph}) es alto y puede reducir la disponibilidad de hierro.`, missing: ph === null ? 'Falta medir pH para valorar hierro.' : null },
        { matches: context.monstera_leaf_maturity === 'young' || context.monstera_leaf_maturity === 'mature', weight: 1, text: `Se indicó que las hojas son ${context.monstera_leaf_maturity === 'young' ? 'nuevas' : 'maduras'}.`, unknown: context.monstera_leaf_maturity === 'unknown' ? 'No se confirmó la madurez de las hojas.' : null },
      ])
    }
  }

  if (symptom === 'general_yellowing' || symptom === 'slow_growth') {
    add(nutrientHypotheses.nitrogen, [
      { matches: symptom === 'general_yellowing', weight: 2, text: 'Se reporta amarillamiento general.', missing: symptom === 'slow_growth' ? 'No se indicó si hay amarillamiento.' : null },
      { matches: location === 'old_leaves', weight: 2, text: 'El síntoma se ubica en hojas viejas.', missing: location === 'leaves' ? 'No se confirmó la edad de las hojas.' : null, unknown: !['old_leaves', 'young_leaves', 'leaves'].includes(location) ? 'La zona seleccionada no permite valorar el patrón de movilidad del nitrógeno.' : null, conflict: location === 'young_leaves' ? 'La señal está en hojas jóvenes, lo que contradice la pauta típica de nitrógeno móvil.' : null, penalty: 1 },
    ])
  }
  if (symptom === 'interveinal_yellowing' || symptom === 'general_yellowing' || symptom === 'slow_growth') {
    add(nutrientHypotheses.magnesium, [
      { matches: symptom === 'interveinal_yellowing', weight: 2, text: 'El amarillamiento se describe entre nervaduras.', missing: symptom !== 'interveinal_yellowing' ? 'No se confirmó un patrón entre nervaduras.' : null },
      { matches: location === 'old_leaves', weight: 2, text: 'El síntoma aparece en hojas viejas.', missing: location === 'leaves' ? 'No se confirmó la edad de las hojas.' : null, unknown: !['old_leaves', 'young_leaves', 'leaves'].includes(location) ? 'La zona seleccionada no permite valorar el patrón de movilidad del magnesio.' : null, conflict: location === 'young_leaves' ? 'La señal está en hojas jóvenes, menos compatible con un nutriente móvil como el magnesio.' : null, penalty: 1 },
    ])
  }
  if (symptom === 'dry_edges' || symptom === 'brown_spots' || symptom === 'slow_growth') {
    add(nutrientHypotheses.potassium, [
      { matches: symptom === 'dry_edges', weight: 2, text: 'Se observan bordes secos.', missing: symptom !== 'dry_edges' ? 'No se reportaron bordes secos, que serían la señal orientadora para esta hipótesis.' : null },
      { matches: location === 'old_leaves', weight: 0.5, text: 'El daño también está en hojas viejas.' },
    ])
  }
  if (symptom === 'young_green_veins' || symptom === 'general_yellowing' || symptom === 'slow_growth') {
    const points = [
      { matches: symptom === 'young_green_veins', weight: 2, text: 'Las hojas jóvenes amarillean y conservan nervaduras verdes.', missing: symptom !== 'young_green_veins' ? 'No se confirmó clorosis en hojas jóvenes con nervaduras verdes.' : null },
      { matches: location === 'young_leaves', weight: 2, text: 'El síntoma aparece en hojas jóvenes.', missing: location === 'leaves' ? 'No se confirmó la edad de las hojas.' : null, unknown: !['young_leaves', 'old_leaves', 'leaves'].includes(location) ? 'La zona seleccionada no permite valorar el patrón foliar típico del hierro.' : null, conflict: location === 'old_leaves' ? 'La señal se ubicó en hojas viejas, lo que contradice el patrón típico de baja disponibilidad de hierro.' : null, penalty: 1 },
    ]
    const notes = []
    if (ph !== null && ph >= 7) {
      points.push({ matches: true, weight: 1, text: `El pH registrado (${ph}) es alto y puede reducir la disponibilidad de hierro.` })
    } else if (ph === null) {
      points[0].missing = `${points[0].missing || ''} El pH no se registró y puede ayudar a valorar la disponibilidad de hierro.`.trim()
      notes.push('Conviene medir el pH si se sospecha baja disponibilidad de hierro.')
    } else {
      points.push({ matches: false, weight: 1, text: '', missing: null })
      notes.push(`El pH registrado (${ph}) no es alto según el umbral orientativo usado por esta herramienta; esto no descarta otras causas.`)
    }
    add(nutrientHypotheses.iron, points, notes)
  }
  if (symptom === 'damaged_new_shoots' || symptom === 'slow_growth') {
    add(nutrientHypotheses.calcium, [
      { matches: symptom === 'damaged_new_shoots', weight: 2, text: 'Se reportan brotes nuevos dañados.', missing: symptom !== 'damaged_new_shoots' ? 'No se reportó daño en brotes nuevos.' : null },
      { matches: location === 'shoots', weight: 2, text: 'El daño se ubica en brotes.', missing: location === 'leaves' ? 'No se confirmó si el daño está en brotes o en hojas.' : null, conflict: location !== 'shoots' && location !== 'leaves' ? 'La zona seleccionada no corresponde a brotes nuevos.' : null, penalty: 1 },
      { matches: irrigation === 'irregular' || irrigation === 'waterlogged', weight: 1, text: 'El riego irregular o el encharcamiento puede alterar absorción/transporte de calcio.' },
    ])
  }

  if (symptom === 'blossom_end_rot' && plant === 'tomato' && ['fruit', 'fruit_tip'].includes(location)) {
    add({ ...nutrientHypotheses.calcium, id: 'blossom_end_rot', title: 'Pudrición apical: transporte de calcio y agua', sourceIds: ['tomatoBlossomEndRot'] }, [
      { matches: true, weight: location === 'fruit_tip' ? 4 : 3, text: location === 'fruit_tip' ? 'Es tomate y seleccionaste directamente la punta del fruto, con una mancha hundida.' : 'Es tomate, el daño está en el fruto y se describe como mancha hundida en la punta apical.', missing: location === 'fruit' ? 'Confirma que el daño está en el extremo opuesto al tallo.' : null },
      { matches: irrigation === 'irregular' || irrigation === 'waterlogged', weight: 1, text: 'La irregularidad del agua puede afectar el transporte de calcio al fruto.', missing: irrigation === 'regular' ? 'No se reportó irregularidad de riego; la pudrición apical aún puede tener otros factores.' : null },
    ], ['La apariencia orienta, pero no prueba deficiencia de calcio en el suelo.'])
  }

  const ambiguous = symptom === 'slow_growth' || symptom === 'brown_spots' || symptom === 'dry_edges'
  const plantSpecificAmbiguous = ['cactus', 'monstera'].includes(plant)
  const waterPoints = [
    { matches: irrigation === 'irregular', weight: 2, text: 'Se reporta riego irregular.' },
    { matches: irrigation === 'waterlogged', weight: 2, text: 'Se reporta encharcamiento, que reduce aireación de raíces.' },
    { matches: symptom === 'slow_growth' || symptom === 'dry_edges' || symptom === 'brown_spots', weight: 0.5, text: 'El síntoma también puede aparecer con estrés de agua o raíces.' },
  ]
  if ((ambiguous || irrigation !== 'regular') && !plantSpecificAmbiguous) add(alternativeHypotheses.water, waterPoints, ['La revisión visual de humedad y raíces aportaría evidencia adicional.'])
  if (ambiguous || plantSpecificAmbiguous || candidates.length === 0) {
    add(alternativeHypotheses.other, [
      { matches: true, weight: ambiguous ? 1 : 0.5, text: 'La señal observada es inespecífica o hay datos que no apuntan a una sola causa.' },
      { matches: true, weight: 0, text: '' },
    ], ['No se registró inspección de plagas, raíces, luz ni historial del cultivo.'])
  }
  return candidates.filter((candidate) => candidate.score > 0).sort((a, b) => b.score - a.score)
}

export function diagnose(input = {}) {
  const validation = validateDiagnosticInput(input)
  if (!validation.valid) {
    return {
      status: 'insufficient',
      cause: 'Faltan datos válidos para orientar el caso',
      explanation: 'Completa los campos obligatorios con una opción válida. El pH puede omitirse.',
      recommendation: 'Revisa las respuestas señaladas y vuelve a generar la orientación.',
      certainty: 'bajo',
      hypotheses: [],
      missingData: validation.errors.map((error) => error.message),
      reasons: [],
      validationErrors: validation.errors,
    }
  }

  const hypotheses = buildDifferential(input, validation.ph)
  const primary = hypotheses[0]
  const second = hypotheses[1]
  const strongPattern = primary?.score >= 4 && (!second || primary.score - second.score >= 2)
  const certainty = strongPattern ? 'medio' : 'bajo'
  const missingData = [...new Set(hypotheses.flatMap((hypothesis) => hypothesis.missing))]
  if (validation.ph === null && (input.symptom === 'young_green_veins' || input.symptom === 'general_yellowing')) {
    missingData.push('Medición de pH para valorar la disponibilidad de hierro.')
  }
  if (input.symptom === 'slow_growth' || input.symptom === 'brown_spots') {
    missingData.push('Inspección de plagas, raíces, luz y evolución temporal del síntoma.')
  }
  if (input.location === 'leaves') missingData.push('Confirma si las hojas afectadas son viejas o jóvenes; la ilustración no permite determinar su edad real.')

  const intrinsicallyAmbiguous = input.symptom === 'slow_growth' || input.symptom === 'brown_spots' || input.symptom === 'dry_edges'
  const noPattern = !primary || primary.score < 2 || intrinsicallyAmbiguous
  const observations = {
    plant: plantNames[input.plant],
    location: diagnosticOptions.locations.find((item) => item.value === input.location)?.label,
    symptom: diagnosticOptions.symptoms.find((item) => item.value === input.symptom)?.label,
    ph: validation.ph === null ? 'No registrado' : String(validation.ph),
    irrigation: diagnosticOptions.irrigation.find((item) => item.value === input.irrigation)?.label,
  }
  return {
    status: noPattern ? 'ambiguous' : 'oriented',
    cause: intrinsicallyAmbiguous
      ? `${input.symptom === 'slow_growth' ? 'El crecimiento lento' : input.symptom === 'brown_spots' ? 'Las manchas cafés' : 'Los bordes secos'} pueden tener varias causas`
      : noPattern ? 'No hay evidencia suficiente para priorizar una causa' : `Hipótesis principal: ${primary.title}`,
    explanation: noPattern
      ? 'Los datos disponibles no coinciden claramente con una pauta nutricional específica. Varias causas pueden producir señales similares.'
      : `${primary.mechanism} Esta compatibilidad es orientativa y no confirma una deficiencia.`,
    recommendation: noPattern
      ? 'Registra cómo evoluciona el síntoma y revisa riego, drenaje, raíces y posibles plagas antes de modificar el sustrato.'
      : primary.recommendation,
    certainty,
    primaryHypothesis: primary || null,
    observations,
    hypotheses,
    missingData,
    reasons: [plantContext[input.plant]],
    validationErrors: [],
  }
}
