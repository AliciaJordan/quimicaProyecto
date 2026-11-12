const STORAGE_KEY = 'leaf-data'
export const STORAGE_VERSION = 1

const emptyStore = () => ({ version: STORAGE_VERSION, plants: [] })

function readStore() {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '')
    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.plants)) return emptyStore()
    return parsed
  } catch {
    return emptyStore()
  }
}

function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

export function getPlants() { return readStore().plants }

export function savePlant({ name, species, notes = '' }) {
  const store = readStore()
  const plant = { id: `plant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: name.trim(), species, notes: notes.trim(), createdAt: new Date().toISOString(), evaluations: [] }
  store.plants.push(plant)
  writeStore(store)
  return plant
}

export function updatePlant(plantId, changes) {
  const store = readStore()
  const index = store.plants.findIndex((plant) => plant.id === plantId)
  if (index < 0) return null
  store.plants[index] = { ...store.plants[index], ...changes }
  writeStore(store)
  return store.plants[index]
}

export function saveEvaluation(plantId, evaluation) {
  const store = readStore()
  const plant = store.plants.find((item) => item.id === plantId)
  if (!plant) return null
  const record = { ...evaluation, id: evaluation.id || `evaluation-${Date.now()}`, date: evaluation.date || new Date().toISOString() }
  if (!plant.evaluations.some((item) => item.id === record.id)) plant.evaluations.push(record)
  writeStore(store)
  return plant
}

export function subscribeToPlants(callback) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => callback(getPlants())
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export function __resetStorageForTests() { if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY) }
