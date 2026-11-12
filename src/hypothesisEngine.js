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

export function aggregateHypotheses(hypotheses, observations = []) {
  const grouped = new Map()
  hypotheses.forEach((hypothesis, index) => {
    const current = grouped.get(hypothesis.id)
    const observation = observations[index]
    const evidencePrefix = observation ? `${observation.locationLabel || observation.location}: ` : ''
    const withContext = {
      ...hypothesis,
      supportingEvidence: hypothesis.supportingEvidence.map((item) => `${evidencePrefix}${item}`),
      evidence: hypothesis.evidence.map((item) => `${evidencePrefix}${item}`),
      inconclusiveEvidence: hypothesis.inconclusiveEvidence.map((item) => `${evidencePrefix}${item}`),
      contradictions: hypothesis.contradictions.map((item) => `${evidencePrefix}${item}`),
      missing: hypothesis.missing.map((item) => `${evidencePrefix}${item}`),
      observationIds: observation ? [observation.id] : [],
    }
    if (!current) grouped.set(hypothesis.id, withContext)
    else grouped.set(hypothesis.id, {
      ...current,
      score: current.score + withContext.score,
      supportingEvidence: [...current.supportingEvidence, ...withContext.supportingEvidence],
      evidence: [...current.evidence, ...withContext.evidence],
      inconclusiveEvidence: [...new Set([...current.inconclusiveEvidence, ...withContext.inconclusiveEvidence])],
      contradictions: [...new Set([...current.contradictions, ...withContext.contradictions])],
      missing: [...new Set([...current.missing, ...withContext.missing])],
      observationIds: [...current.observationIds, ...withContext.observationIds],
    })
  })
  return [...grouped.values()].map((item) => ({ ...item, compatibility: item.score >= 4 && item.contradictions.length === 0 ? 'alta' : item.score >= 2 && item.contradictions.length < 2 ? 'parcial' : 'información insuficiente' })).sort((a, b) => b.score - a.score)
}
