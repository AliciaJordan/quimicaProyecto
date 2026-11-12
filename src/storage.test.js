import test from 'node:test'
import assert from 'node:assert/strict'
import { getPlants, saveEvaluation, savePlant } from './storage.js'

const data = new Map()
global.window = { localStorage: { getItem: (key) => data.get(key) || null, setItem: (key, value) => data.set(key, value) } }

test('persiste varias plantas de la misma especie y asocia evaluaciones', () => {
  const first = savePlant({ name: 'Rosa norte', species: 'rose' })
  const second = savePlant({ name: 'Rosa patio', species: 'rose' })
  saveEvaluation(first.id, { observations: { symptom: ['Amarillamiento'] }, notes: 'Primer registro' })
  const plants = getPlants()
  assert.equal(plants.length, 2)
  assert.equal(plants.find((plant) => plant.id === first.id).evaluations.length, 1)
  assert.equal(plants.find((plant) => plant.id === second.id).evaluations.length, 0)
})
