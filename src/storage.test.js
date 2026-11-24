import test, { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  STORAGE_VERSION,
  __resetStorageForTests,
  deletePlant,
  getPlants,
  saveEvaluation,
  savePlant,
  updatePlant
} from './storage.js'

const STORAGE_KEY = 'leaf-data'
const data = new Map()
let writeCount = 0
let failWrites = false

global.window = {
  localStorage: {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      if (failWrites) throw new Error('No se pudo escribir')
      data.set(key, value)
      writeCount += 1
    },
    removeItem: (key) => data.delete(key)
  }
}

afterEach(() => {
  __resetStorageForTests()
  writeCount = 0
  failWrites = false
})

test('persiste varias plantas de la misma especie y asocia evaluaciones', () => {
  const first = savePlant({ name: 'Rosa norte', species: 'rose' })
  const second = savePlant({ name: 'Rosa patio', species: 'rose' })
  const updated = saveEvaluation(first.id, { observations: { symptom: ['Amarillamiento'] }, notes: 'Primer registro' })
  const plants = getPlants()

  assert.equal(STORAGE_VERSION, 2)
  assert.equal(plants.length, 2)
  assert.equal(plants.find((plant) => plant.id === first.id).evaluations.length, 1)
  assert.equal(plants.find((plant) => plant.id === second.id).evaluations.length, 0)
  assert.equal(updated.evaluations.length, 1)
  assert.equal(first.notes, '')
  assert.equal(typeof first.createdAt, 'string')
  assert.equal(typeof first.updatedAt, 'string')
})

test('migra datos v1 a v2 conservando plantas y evaluaciones', () => {
  const createdAt = '2024-01-01T00:00:00.000Z'
  const evaluation = {
    id: 'evaluation-v1',
    date: '2024-01-02T00:00:00.000Z',
    observations: { symptom: ['Manchas'] },
    extra: 'se conserva'
  }
  data.set(STORAGE_KEY, JSON.stringify({
    version: 1,
    plants: [
      { id: 'p1', name: 'Planta uno', species: 'rose', notes: 'nota', createdAt, evaluations: [evaluation] },
      { id: 'p2', name: 'Planta dos', species: 'rose', notes: '', evaluations: [] }
    ]
  }))

  const plants = getPlants()
  assert.equal(plants.length, 2)
  assert.equal(plants[0].name, 'Planta uno')
  assert.equal(plants[0].species, 'rose')
  assert.equal(plants[0].notes, 'nota')
  assert.equal(plants[0].createdAt, createdAt)
  assert.equal(plants[0].updatedAt, createdAt)
  assert.deepEqual(plants[0].evaluations, [evaluation])
  assert.equal(typeof plants[1].updatedAt, 'string')

  const stored = JSON.parse(data.get(STORAGE_KEY))
  assert.equal(stored.version, 2)
  assert.equal(stored.plants[0].updatedAt, createdAt)
  assert.deepEqual(stored.plants[0].evaluations, [evaluation])
  assert.equal(writeCount, 1)

  getPlants()
  assert.equal(writeCount, 1)
})

test('updatePlant solo cambia los campos permitidos y actualiza updatedAt', () => {
  const plant = savePlant({ name: '  Original  ', species: 'rose', notes: '  nota  ' })
  const updated = updatePlant(plant.id, {
    name: '  Nueva  ',
    species: 'orchid',
    notes: '  otra nota  ',
    id: 'plant-hackeada',
    createdAt: '2000-01-01T00:00:00.000Z',
    updatedAt: '2000-01-01T00:00:00.000Z',
    evaluations: [{ id: 'falsa', date: '2000-01-01T00:00:00.000Z' }]
  })

  assert.ok(updated)
  assert.equal(updated.id, plant.id)
  assert.equal(updated.name, 'Nueva')
  assert.equal(updated.species, 'orchid')
  assert.equal(updated.notes, 'otra nota')
  assert.equal(updated.createdAt, plant.createdAt)
  assert.deepEqual(updated.evaluations, [])
  assert.match(updated.updatedAt, /^\d{4}-\d{2}-\d{2}T/)
  assert.equal(getPlants()[0].name, 'Nueva')
  assert.equal(updatePlant('no-existe', { name: 'x' }), null)
})

test('deletePlant elimina solo la planta indicada y devuelve true o false', () => {
  const first = savePlant({ name: 'Uno', species: 'rose' })
  const second = savePlant({ name: 'Dos', species: 'rose' })

  assert.equal(deletePlant('no-existe'), false)
  assert.equal(getPlants().length, 2)
  assert.equal(deletePlant(first.id), true)

  const plants = getPlants()
  assert.equal(plants.length, 1)
  assert.equal(plants[0].id, second.id)
  assert.equal(deletePlant(first.id), false)
})

test('saveEvaluation agrega una sola vez y es idempotente para ids repetidos', () => {
  const plant = savePlant({ name: 'Planta', species: 'rose' })
  const evaluation = {
    id: 'eval-fija',
    date: '2024-01-02T00:00:00.000Z',
    observations: { symptom: ['Manchas'] },
    extra: true
  }

  const first = saveEvaluation(plant.id, evaluation)
  assert.equal(first.evaluations.length, 1)
  assert.deepEqual(first.evaluations[0], evaluation)

  const second = saveEvaluation(plant.id, { ...evaluation, extra: false })
  assert.equal(second.evaluations.length, 1)
  assert.deepEqual(second.evaluations[0], evaluation)

  const generated = saveEvaluation(plant.id, { notes: 'sin identificador' })
  assert.equal(generated.evaluations.length, 2)
  assert.match(generated.evaluations[1].id, /^evaluation-\d+$/)
  assert.equal(typeof generated.evaluations[1].date, 'string')
  assert.equal(getPlants()[0].evaluations.length, 2)
})

test('devuelve plantas vacías ante datos corruptos o de versión desconocida', () => {
  data.set(STORAGE_KEY, '{ no es json')
  assert.deepEqual(getPlants(), [])

  data.set(STORAGE_KEY, JSON.stringify({
    version: 3,
    plants: [{ id: 'x', name: 'x', species: 'x', evaluations: [] }]
  }))
  assert.deepEqual(getPlants(), [])

  data.set(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, plants: 'no es arreglo' }))
  assert.deepEqual(getPlants(), [])

  data.set(STORAGE_KEY, JSON.stringify(null))
  assert.deepEqual(getPlants(), [])
})

test('filtra registros inválidos y descarta ids de planta duplicados', () => {
  const valid = {
    id: 'ok',
    name: 'Válida',
    species: 'rose',
    notes: 'n',
    createdAt: '2024-01-01T00:00:00.000Z',
    evaluations: [
      { id: 'e1', date: '2024-01-02T00:00:00.000Z', detail: 'se conserva' },
      { id: 'e2' },
      null
    ]
  }
  data.set(STORAGE_KEY, JSON.stringify({
    version: STORAGE_VERSION,
    plants: [
      valid,
      { ...valid, name: 'Duplicada' },
      { id: 'sin-nombre', species: 'rose', evaluations: [] },
      { id: 'sin-evaluaciones', name: 'Sin eval', species: 'rose' }
    ]
  }))

  const plants = getPlants()
  assert.equal(plants.length, 2)
  assert.equal(plants[0].name, 'Válida')
  assert.deepEqual(plants[0].evaluations, [valid.evaluations[0]])
  assert.deepEqual(plants[1].evaluations, [])
})

test('las funciones de escritura fallan sin datos cuando no se puede guardar', () => {
  const plant = savePlant({ name: 'Planta', species: 'rose' })
  failWrites = true

  assert.equal(updatePlant(plant.id, { name: 'Nueva' }), null)
  assert.equal(deletePlant(plant.id), false)
  assert.equal(saveEvaluation(plant.id, { id: 'e1', date: '2024-01-01T00:00:00.000Z' }), null)

  failWrites = false
  assert.equal(getPlants()[0].name, 'Planta')
})
