/**
 * Reglas educativas editables. Las puntuaciones ordenan compatibilidad con
 * síntomas observados; no representan probabilidades ni diagnósticos clínicos.
 */
export const diagnosticOptions = {
  plants: [
    { value: 'rose', label: 'Rosa' },
    { value: 'tomato', label: 'Tomate' },
    { value: 'basil', label: 'Albahaca' },
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
  ],
  irrigation: [
    { value: 'regular', label: 'Regular, sin encharcamiento' },
    { value: 'irregular', label: 'Irregular' },
    { value: 'waterlogged', label: 'Hay encharcamiento' },
  ],
}

const validValues = {
  plant: diagnosticOptions.plants.map(({ value }) => value),
  location: diagnosticOptions.locations.map(({ value }) => value),
  symptom: diagnosticOptions.symptoms.map(({ value }) => value),
  irrigation: diagnosticOptions.irrigation.map(({ value }) => value),
}

const plantNames = { rose: 'rosa', tomato: 'tomate', basil: 'albahaca' }

const nutrientHypotheses = {
  nitrogen: {
    id: 'nitrogen', kind: 'nutrient', title: 'Disponibilidad baja de nitrógeno',
    sourceIds: ['nutrientPatterns'],
    mechanism: 'La planta incorpora nitrato o amonio a aminoácidos, proteínas y clorofila; una disponibilidad baja puede limitar el crecimiento y el verdor.',
    recommendation: 'Revisa la edad de las hojas afectadas y el historial del sustrato. Confirma con un análisis antes de cambiar la fertilización.',
  },
  magnesium: {
    id: 'magnesium', kind: 'nutrient', title: 'Disponibilidad baja de magnesio',
    sourceIds: ['nutrientPatterns'],
    mechanism: 'El Mg²⁺ forma parte de la clorofila y participa en la actividad de enzimas. Su baja disponibilidad puede acompañarse de clorosis entre nervaduras, a menudo primero en hojas viejas.',
    recommendation: 'Compara varias hojas de distintas edades y revisa pH y análisis del sustrato; síntomas parecidos pueden tener otras causas.',
  },
  potassium: {
    id: 'potassium', kind: 'nutrient', title: 'Disponibilidad baja de potasio',
    sourceIds: ['nutrientPatterns'],
    mechanism: 'El K⁺ participa en regulación hídrica y activación de enzimas. Bordes secos pueden ser compatibles, pero también aparecen por sequía, sales o daño ambiental.',
    recommendation: 'Revisa humedad, drenaje y posible acumulación de sales. Los bordes secos por sí solos no justifican añadir potasio.',
  },
  iron: {
    id: 'iron', kind: 'nutrient', title: 'Baja disponibilidad de hierro',
    sourceIds: ['ironChlorosis'],
    mechanism: 'El hierro participa en reacciones de transferencia de electrones. Un pH alto puede reducir su disponibilidad; el hierro no es el átomo central de la clorofila.',
    recommendation: 'Mide el pH del sustrato o agua y considera el drenaje. No intentes acidificar sin una medición y conocer el sistema de cultivo.',
  },
  calcium: {
    id: 'calcium', kind: 'nutrient', title: 'Problema de suministro o transporte de calcio',
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

const plantContext = {
  rose: 'En rosa, clima, edad de la hoja y condiciones de raíces también pueden cambiar el aspecto del follaje.',
  tomato: 'En tomate, el fruto y la estabilidad del riego aportan contexto; la mancha apical no demuestra por sí sola falta de calcio en el suelo.',
  basil: 'En albahaca, considera edad de hojas, luz y humedad del sustrato al interpretar el amarillamiento o el crecimiento lento.',
}

export function getAvailableSymptoms(plant) {
  return diagnosticOptions.symptoms.filter((option) => option.value !== 'blossom_end_rot' || plant === 'tomato')
}

export function validateDiagnosticInput(input = {}) {
  const errors = []
  for (const field of ['plant', 'location', 'symptom', 'irrigation']) {
    if (!validValues[field].includes(input[field])) errors.push({ field, message: `Selecciona un valor válido para ${field}.` })
  }
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
  return { valid: errors.length === 0, errors, ph: errors.some((error) => error.field === 'ph') ? null : ph }
}

function scoreHypothesis(definition, points, input, notes = []) {
  const score = points.reduce((sum, point) => sum + (point.matches ? point.weight : 0), 0)
  const evidence = points.filter((point) => point.matches).map((point) => point.text)
  const missing = points.filter((point) => point.missing).map((point) => point.missing)
  return {
    ...definition,
    score,
    evidence,
    missing: [...new Set(missing)],
    notes,
    plantContext: plantContext[input.plant],
  }
}

function buildDifferential(input, ph) {
  const { plant, location, symptom, irrigation } = input
  const candidates = []
  const add = (definition, points, notes) => candidates.push(scoreHypothesis(definition, points, input, notes))

  if (symptom === 'general_yellowing' || symptom === 'slow_growth') {
    add(nutrientHypotheses.nitrogen, [
      { matches: symptom === 'general_yellowing', weight: 2, text: 'Se reporta amarillamiento general.', missing: symptom === 'slow_growth' ? 'No se indicó si hay amarillamiento.' : null },
      { matches: location === 'old_leaves', weight: 2, text: 'El síntoma se ubica en hojas viejas.', missing: location !== 'old_leaves' ? 'La pauta sería más compatible si comienza en hojas viejas.' : null },
    ])
  }
  if (symptom === 'interveinal_yellowing' || symptom === 'general_yellowing' || symptom === 'slow_growth') {
    add(nutrientHypotheses.magnesium, [
      { matches: symptom === 'interveinal_yellowing', weight: 2, text: 'El amarillamiento se describe entre nervaduras.', missing: symptom !== 'interveinal_yellowing' ? 'No se confirmó un patrón entre nervaduras.' : null },
      { matches: location === 'old_leaves', weight: 2, text: 'El síntoma aparece en hojas viejas.', missing: location !== 'old_leaves' ? 'La ubicación en hojas viejas ayudaría a valorar esta pauta.' : null },
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
      { matches: location === 'young_leaves', weight: 2, text: 'El síntoma aparece en hojas jóvenes.', missing: location !== 'young_leaves' ? 'La aparición en hojas jóvenes ayudaría a valorar hierro.' : null },
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
      { matches: location === 'shoots', weight: 2, text: 'El daño se ubica en brotes.', missing: location !== 'shoots' ? 'La ubicación en brotes nuevos sería más compatible.' : null },
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
  const waterPoints = [
    { matches: irrigation === 'irregular', weight: 2, text: 'Se reporta riego irregular.' },
    { matches: irrigation === 'waterlogged', weight: 2, text: 'Se reporta encharcamiento, que reduce aireación de raíces.' },
    { matches: symptom === 'slow_growth' || symptom === 'dry_edges' || symptom === 'brown_spots', weight: 0.5, text: 'El síntoma también puede aparecer con estrés de agua o raíces.' },
  ]
  if (ambiguous || irrigation !== 'regular') add(alternativeHypotheses.water, waterPoints, ['La revisión visual de humedad y raíces aportaría evidencia adicional.'])
  if (ambiguous || candidates.length === 0) {
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
    hypotheses,
    missingData,
    reasons: [plantContext[input.plant]],
    validationErrors: [],
  }
}
