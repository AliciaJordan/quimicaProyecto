import test from 'node:test'
import assert from 'node:assert/strict'
import { diagnose, validateDiagnosticInput } from './diagnosticRules.js'
import { activatePlantRegion, canContinueToSymptoms, handleSvgRegionKeyDown, plantRegions, resolvePlantRegion } from './plantRegions.js'

const completeCase = (overrides = {}) => ({
  plant: 'rose',
  location: 'old_leaves',
  symptom: 'general_yellowing',
  ph: '',
  irrigation: 'regular',
  ...overrides,
})

test('prioriza nitrógeno ante amarillamiento general en hojas viejas', () => {
  const result = diagnose(completeCase())
  assert.equal(result.status, 'oriented')
  assert.equal(result.hypotheses[0].id, 'nitrogen')
  assert.equal(result.hypotheses[0].score, 4)
  assert.equal(result.certainty, 'medio')
  assert.match(result.hypotheses[0].evidence.join(' '), /hojas viejas/i)
})

test('prioriza magnesio ante clorosis entre nervaduras en hojas viejas', () => {
  const result = diagnose(completeCase({ symptom: 'interveinal_yellowing' }))
  assert.equal(result.hypotheses[0].id, 'magnesium')
  assert.equal(result.hypotheses[0].score, 4)
})

test('el pH alto añade evidencia contextual para hierro, no un diagnóstico confirmado', () => {
  const result = diagnose(completeCase({
    location: 'young_leaves', symptom: 'young_green_veins', ph: '7.4',
  }))
  assert.equal(result.hypotheses[0].id, 'iron')
  assert.ok(result.hypotheses[0].evidence.some((item) => /pH registrado/i.test(item)))
  assert.equal(result.certainty, 'medio')
  assert.match(result.explanation, /no confirma/i)
})

test('mancha apical solo se evalúa como tal en fruto de tomate', () => {
  const result = diagnose(completeCase({
    plant: 'tomato', location: 'fruit', symptom: 'blossom_end_rot', irrigation: 'irregular',
  }))
  assert.equal(result.hypotheses[0].id, 'blossom_end_rot')
  assert.ok(result.hypotheses[0].evidence.some((item) => /fruto/i.test(item)))
  assert.ok(result.hypotheses[0].evidence.some((item) => /irregularidad/i.test(item)))
  assert.equal(result.certainty, 'medio')
  assert.equal(validateDiagnosticInput(completeCase({ symptom: 'blossom_end_rot' })).valid, false)
})

test('crecimiento lento presenta alternativas y datos faltantes', () => {
  const result = diagnose(completeCase({ symptom: 'slow_growth', irrigation: 'irregular' }))
  assert.equal(result.status, 'ambiguous')
  assert.match(result.cause, /varias causas/i)
  assert.ok(result.hypotheses.length >= 3)
  assert.ok(result.hypotheses.some((item) => item.id === 'water_stress'))
  assert.ok(result.missingData.some((item) => /plagas|raíces/i.test(item)))
})

test('bordes secos permanecen ambiguos aunque potasio sea una hipótesis', () => {
  const result = diagnose(completeCase({ symptom: 'dry_edges' }))
  assert.equal(result.status, 'ambiguous')
  assert.ok(result.hypotheses.some((item) => item.id === 'potassium'))
  assert.ok(result.hypotheses.some((item) => item.id === 'other_causes'))
  assert.equal(result.certainty, 'bajo')
})

test('rechaza datos obligatorios inválidos y pH fuera de rango', () => {
  const missing = diagnose({})
  assert.equal(missing.status, 'insufficient')
  assert.equal(missing.hypotheses.length, 0)
  assert.equal(validateDiagnosticInput(completeCase({ ph: '15' })).valid, false)
  assert.equal(validateDiagnosticInput(completeCase({ ph: '' })).valid, true)
  assert.equal(validateDiagnosticInput(completeCase({ ph: true })).valid, false)
})

test('cada especie ofrece zonas SVG seleccionables y el fruto incluye la punta', () => {
  for (const plant of ['rose', 'tomato', 'basil']) {
    assert.ok(plantRegions[plant].some((region) => region.id === 'lower_leaves'))
    assert.ok(plantRegions[plant].some((region) => region.id === 'upper_leaves'))
    assert.ok(plantRegions[plant].some((region) => region.id === 'shoots'))
    assert.ok(plantRegions[plant].some((region) => region.id === 'stem'))
  }
  assert.ok(plantRegions.rose.some((region) => region.id === 'flower'))
  assert.ok(plantRegions.tomato.some((region) => region.id === 'fruit'))
  assert.ok(plantRegions.tomato.some((region) => region.id === 'fruit_tip'))
})

test('la selección de hojas pide confirmar edad y navegación espera una respuesta', () => {
  const pending = resolvePlantRegion('lower_leaves')
  assert.equal(pending.location, 'leaves')
  assert.equal(pending.needsAgeConfirmation, true)
  assert.equal(canContinueToSymptoms({ plant: 'rose', location: 'leaves', selectedRegion: 'lower_leaves', leafAge: '' }), false)
  assert.equal(resolvePlantRegion('lower_leaves', 'old').location, 'old_leaves')
  assert.equal(resolvePlantRegion('upper_leaves', 'young').location, 'young_leaves')
  assert.equal(canContinueToSymptoms({ plant: 'rose', location: 'leaves', selectedRegion: 'lower_leaves', leafAge: 'unknown' }), true)
  assert.equal(canContinueToSymptoms({ plant: 'tomato', location: 'fruit_tip', selectedRegion: 'fruit_tip', leafAge: '' }), true)
})

test('las zonas SVG responden a Enter y Espacio, pero ignoran otras teclas', () => {
  let activations = 0
  let prevented = 0
  const onSelect = () => { activations += 1 }
  const event = (key) => ({ key, preventDefault: () => { prevented += 1 } })
  assert.equal(handleSvgRegionKeyDown(event('Tab'), onSelect), false)
  assert.equal(handleSvgRegionKeyDown(event('Enter'), onSelect), true)
  assert.equal(handleSvgRegionKeyDown(event(' '), onSelect), true)
  assert.equal(activations, 2)
  assert.equal(prevented, 2)
})

test('el clic activa solo una región disponible de la especie elegida', () => {
  let selected = null
  assert.equal(activatePlantRegion('tomato', 'fruit_tip', (region) => { selected = region }), true)
  assert.equal(selected.location, 'fruit_tip')
  assert.equal(activatePlantRegion('rose', 'fruit_tip', () => assert.fail('La rosa no ofrece zona de fruto')), false)
})

test('la punta del fruto seleccionada activa la regla diferencial de tomate', () => {
  const result = diagnose({ plant: 'tomato', location: 'fruit_tip', symptom: 'blossom_end_rot', ph: '', irrigation: 'regular' })
  assert.equal(result.hypotheses[0].id, 'blossom_end_rot')
  assert.ok(result.hypotheses[0].evidence.some((item) => /punta del fruto/i.test(item)))
})
