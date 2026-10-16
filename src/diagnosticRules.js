const plantNotes = {
  rose: 'En rosas, el aspecto de las hojas también puede cambiar por la edad de la hoja, el clima o problemas de raíces.',
  tomato: 'En tomate, revisa también el fruto y la regularidad del riego; varios factores pueden producir señales parecidas.',
  basil: 'En albahaca, considera la edad de las hojas y las condiciones de riego antes de atribuir el síntoma a un nutriente.',
}

const nutrientGuidance = {
  nitrogen: {
    cause: 'Posible deficiencia de nitrógeno',
    explanation: 'El amarillamiento general que comienza en hojas viejas puede ser compatible con una disponibilidad baja de nitrógeno.',
    recommendation: 'Revisa el estado general de la planta, el sustrato y el manejo de riego. Considera un análisis antes de ajustar la fertilización.',
  },
  magnesium: {
    cause: 'Posible deficiencia de magnesio',
    explanation: 'El amarillamiento entre nervaduras en hojas viejas puede ser compatible con una disponibilidad baja de magnesio.',
    recommendation: 'Observa si el patrón aparece en varias hojas y revisa el sustrato. Un análisis ayuda a distinguir causas parecidas.',
  },
  potassium: {
    cause: 'Posible deficiencia de potasio',
    explanation: 'Los bordes secos o dañados pueden asociarse con baja disponibilidad de potasio, aunque también hay otras causas posibles.',
    recommendation: 'Revisa la humedad, la salinidad y el estado de las raíces. Evita aplicar fertilizante sin confirmar el problema.',
  },
  iron: {
    cause: 'Posible baja disponibilidad de hierro',
    explanation: 'Las hojas jóvenes amarillas con nervaduras verdes pueden ser compatibles con baja disponibilidad de hierro.',
    recommendation: 'Mide el pH del sustrato o agua y revisa el drenaje. No ajustes el pH sin conocer sus valores y el sistema de cultivo.',
  },
  calcium: {
    cause: 'Posible problema relacionado con el calcio',
    explanation: 'El daño en brotes nuevos puede asociarse con problemas de calcio, pero también puede deberse a estrés o daño físico.',
    recommendation: 'Revisa el crecimiento nuevo, las raíces y la constancia del riego. El transporte de calcio puede alterarse con cambios de humedad.',
  },
  blossom: {
    cause: 'Posible pudrición apical relacionada con calcio y riego',
    explanation: 'Una mancha café hundida en la punta del fruto de tomate suele relacionarse con un suministro irregular de calcio al fruto; la disponibilidad en el suelo no siempre es el único factor.',
    recommendation: 'Procura un riego constante y revisa el drenaje y las raíces. Confirma que la mancha esté en el extremo opuesto al tallo; no añadas calcio sin evaluar el cultivo.',
  },
}

function result({ cause, explanation, recommendation, certainty, reasons, needsPh = false }) {
  return { cause, explanation, recommendation, certainty, reasons, needsPh }
}

export function diagnose({ plant, location, symptom, ph, irrigation }) {
  const hasPh = ph !== '' && ph !== null && ph !== undefined
  const numericPh = hasPh ? Number(ph) : null
  const highPh = numericPh !== null && numericPh >= 7
  const wet = irrigation === 'waterlogged'
  const irregular = irrigation === 'irregular'
  const match = (rule) => ({ ...nutrientGuidance[rule] })
  let diagnosis

  if (symptom === 'blossom_end_rot' && plant === 'tomato' && location === 'fruit') {
    diagnosis = result({ ...match('blossom'), certainty: 'medio', reasons: [] })
  } else if (symptom === 'young_green_veins' && location === 'young_leaves') {
    const iron = match('iron')
    diagnosis = result({ ...iron, certainty: highPh ? 'medio' : 'medio', reasons: [], needsPh: !hasPh })
  } else if (symptom === 'damaged_new_shoots' && location === 'shoots') {
    diagnosis = result({ ...match('calcium'), certainty: 'bajo', reasons: ['El daño en brotes puede tener más de una causa.'] })
  } else if (symptom === 'general_yellowing' && location === 'old_leaves') {
    diagnosis = result({ ...match('nitrogen'), certainty: 'medio', reasons: [] })
  } else if (symptom === 'interveinal_yellowing' && location === 'old_leaves') {
    diagnosis = result({ ...match('magnesium'), certainty: 'medio', reasons: [] })
  } else if (symptom === 'dry_edges') {
    diagnosis = result({ ...match('potassium'), certainty: 'bajo', reasons: ['Los bordes secos son un síntoma poco específico.'] })
  } else {
    diagnosis = result({
      cause: 'Causa no determinada; hay varias posibilidades',
      explanation: 'Los datos registrados no coinciden con suficiente claridad con una sola pauta. El crecimiento lento, las manchas cafés y los síntomas en ubicaciones distintas pueden tener causas nutricionales o ambientales.',
      recommendation: 'Registra cuándo comenzó, qué partes afecta y cómo evoluciona. Revisa raíces, drenaje, humedad y posibles plagas antes de modificar la fertilización.',
      certainty: 'bajo',
      reasons: ['Los síntomas ambiguos no permiten identificar un nutriente específico.'],
    })
  }

  if (highPh) {
    diagnosis.reasons.push('El pH registrado es alto; un pH elevado puede reducir la disponibilidad de hierro.')
  }
  if (wet) diagnosis.reasons.push('El encharcamiento puede afectar la absorción de nutrientes y la salud de las raíces.')
  if (irregular) diagnosis.reasons.push('Un riego irregular puede afectar la absorción o el transporte de nutrientes.')
  diagnosis.reasons.push(plantNotes[plant])
  if (diagnosis.needsPh) diagnosis.reasons.push('Mide el pH para valorar mejor la disponibilidad de hierro; el pH se omitió en este registro.')
  if (symptom === 'brown_spots' || symptom === 'slow_growth') diagnosis.reasons.push('Considera consultar a un especialista si el síntoma persiste, empeora o afecta varias plantas.')
  return diagnosis
}

export const diagnosticOptions = {
  plants: [
    { value: 'rose', label: 'Rosa' },
    { value: 'tomato', label: 'Tomate' },
    { value: 'basil', label: 'Albahaca' },
  ],
  locations: [
    { value: 'old_leaves', label: 'Hojas viejas' },
    { value: 'young_leaves', label: 'Hojas jóvenes' },
    { value: 'shoots', label: 'Brotes' },
    { value: 'fruit', label: 'Fruto' },
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

export function getAvailableSymptoms(plant) {
  return diagnosticOptions.symptoms.filter((option) => option.value !== 'blossom_end_rot' || plant === 'tomato')
}
