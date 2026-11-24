const STORAGE_KEY = 'leaf-data'
export const STORAGE_VERSION = 2

const emptyStore = () => ({ version: STORAGE_VERSION, plants: [] })
const isString = (value) => typeof value === 'string'

function validEvaluation(evaluation) {
  return Boolean(evaluation) && isString(evaluation.id) && isString(evaluation.date)
}

function normalizePlant(raw, version, now) {
  if (!raw || !isString(raw.id) || !isString(raw.name) || !isString(raw.species)) return null
  const updatedAt = version === 1
    ? (raw.createdAt || now)
    : (raw.updatedAt || raw.createdAt || now)
  return {
    ...raw,
    evaluations: Array.isArray(raw.evaluations) ? raw.evaluations.filter(validEvaluation) : [],
    updatedAt
  }
}

function normalizePlants(rawPlants, version) {
  const now = new Date().toISOString()
  const seen = new Set()
  const plants = []
  for (const raw of rawPlants) {
    const plant = normalizePlant(raw, version, now)
    if (!plant || seen.has(plant.id)) continue
    seen.add(plant.id)
    plants.push(plant)
  }
  return plants
}

function writeStore(store) {
  try {
    if (typeof window === 'undefined') return false
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

function readStore() {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '')
    if (!raw || !Array.isArray(raw.plants)) return emptyStore()
    if (raw.version !== 1 && raw.version !== STORAGE_VERSION) return emptyStore()
    // Los datos v1 se convierten a v2 y se guardan una sola vez.
    const store = { version: STORAGE_VERSION, plants: normalizePlants(raw.plants, raw.version) }
    if (raw.version === 1) writeStore(store)
    return store
  } catch {
    return emptyStore()
  }
}

// Única ruta de escritura: lee, aplica el cambio y guarda una sola vez.
function mutate(mutator) {
  const store = readStore()
  const result = mutator(store)
  if (!writeStore(store)) return typeof result === 'boolean' ? false : null
  return result
}

export function getPlants() { return readStore().plants }

export function savePlant({ name, species, notes = '' }) {
  return mutate((store) => {
    const now = new Date().toISOString()
    const plant = {
      id: `plant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      species,
      notes: notes.trim(),
      createdAt: now,
      updatedAt: now,
      evaluations: []
    }
    store.plants.push(plant)
    return plant
  })
}

function editableChanges(changes = {}) {
  const allowed = {}
  for (const field of ['name', 'species', 'notes']) {
    if (isString(changes[field])) allowed[field] = changes[field].trim()
  }
  return allowed
}

export function updatePlant(plantId, changes = {}) {
  return mutate((store) => {
    const plant = store.plants.find((item) => item.id === plantId)
    if (!plant) return null
    Object.assign(plant, editableChanges(changes), { updatedAt: new Date().toISOString() })
    return plant
  })
}

export function deletePlant(plantId) {
  return mutate((store) => {
    const index = store.plants.findIndex((item) => item.id === plantId)
    if (index < 0) return false
    store.plants.splice(index, 1)
    return true
  })
}

export function saveEvaluation(plantId, evaluation = {}) {
  return mutate((store) => {
    const plant = store.plants.find((item) => item.id === plantId)
    if (!plant) return null
    const record = {
      ...evaluation,
      id: evaluation.id || `evaluation-${Date.now()}`,
      date: evaluation.date || new Date().toISOString()
    }
    if (!plant.evaluations.some((item) => item.id === record.id)) plant.evaluations.push(record)
    plant.updatedAt = new Date().toISOString()
    return plant
  })
}

export function subscribeToPlants(callback) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => callback(getPlants())
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export function __resetStorageForTests() { if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY) }
