/**
 * Utilidades compartidas por el motor de hipótesis.
 * Las reglas siguen siendo educativas: ordenan compatibilidad y no calculan
 * probabilidades clínicas ni confirman deficiencias.
 */
export function evaluateHypothesis({ definition, points, input, plantContext }) {
  const supportingEvidence = points.filter((point) => point.matches && point.text).map((point) => point.text)
  const inconclusiveEvidence = points.filter((point) => point.unknown || point.missing).map((point) => point.unknown || point.missing)
  const missing = points.filter((point) => point.missing).map((point) => point.missing)
  const contradictions = points.filter((point) => point.conflict).map((point) => point.conflict)
  const score = points.reduce((sum, point) => sum + (point.matches ? point.weight : 0) - (point.conflict ? (point.penalty ?? point.weight ?? 1) : 0), 0)
  const compatibility = score >= 4 && contradictions.length === 0
    ? 'alta'
    : score >= 2 && contradictions.length < 2
      ? 'parcial'
      : 'información insuficiente'

  return {
    ...definition,
    score,
    compatibility,
    evidence: supportingEvidence,
    supportingEvidence,
    inconclusiveEvidence: [...new Set(inconclusiveEvidence)],
    missing: [...new Set(missing)],
    contradictions: [...new Set(contradictions)],
    notes: definition.notes || [],
    plantContext: plantContext[input.plant],
    trace: points.map((point) => ({
      label: point.label,
      state: point.matches ? 'support' : point.conflict ? 'conflict' : 'unknown',
      text: point.matches ? point.text : point.conflict || point.unknown || point.missing,
    })).filter((item) => item.text),
  }
}

export function compatibilityLabel(value) {
  return value === 'alta' ? 'Compatibilidad alta' : value === 'parcial' ? 'Compatibilidad parcial' : 'Información insuficiente'
}
