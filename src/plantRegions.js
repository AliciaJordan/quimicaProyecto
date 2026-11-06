export const plantRegions = {
  rose: [
    { id: 'lower_leaves', label: 'Hojas inferiores (edad por confirmar)', location: 'leaves', leafGroup: true, x: 112, y: 257, radius: 42 },
    { id: 'upper_leaves', label: 'Hojas superiores (edad por confirmar)', location: 'leaves', leafGroup: true, x: 238, y: 178, radius: 42 },
    { id: 'shoots', label: 'Brotes nuevos', location: 'shoots', x: 183, y: 56, radius: 32 },
    { id: 'stem', label: 'Tallo', location: 'stem', x: 183, y: 266, radius: 30 },
    { id: 'flower', label: 'Flor', location: 'flower', x: 262, y: 75, radius: 39 },
  ],
  tomato: [
    { id: 'lower_leaves', label: 'Hojas inferiores (edad por confirmar)', location: 'leaves', leafGroup: true, x: 89, y: 271, radius: 43 },
    { id: 'upper_leaves', label: 'Hojas superiores (edad por confirmar)', location: 'leaves', leafGroup: true, x: 220, y: 128, radius: 42 },
    { id: 'shoots', label: 'Brotes nuevos', location: 'shoots', x: 179, y: 52, radius: 32 },
    { id: 'stem', label: 'Tallo', location: 'stem', x: 177, y: 208, radius: 29 },
    { id: 'flower', label: 'Flor', location: 'flower', x: 268, y: 139, radius: 34 },
    { id: 'fruit', label: 'Fruto', location: 'fruit', x: 239, y: 263, radius: 48 },
    { id: 'fruit_tip', label: 'Punta apical del fruto (opuesta al tallo)', location: 'fruit_tip', x: 239, y: 297, radius: 22 },
  ],
  basil: [
    { id: 'lower_leaves', label: 'Hojas inferiores (edad por confirmar)', location: 'leaves', leafGroup: true, x: 106, y: 278, radius: 43 },
    { id: 'upper_leaves', label: 'Hojas superiores (edad por confirmar)', location: 'leaves', leafGroup: true, x: 228, y: 154, radius: 42 },
    { id: 'shoots', label: 'Brotes nuevos', location: 'shoots', x: 181, y: 50, radius: 32 },
    { id: 'stem', label: 'Tallo', location: 'stem', x: 182, y: 265, radius: 29 },
    { id: 'flower', label: 'Inflorescencia', location: 'flower', x: 180, y: 88, radius: 34 },
  ],
  cactus: [
    { id: 'cactus_stem', label: 'Tallo principal', location: 'cactus_stem', x: 180, y: 155, radius: 58 },
    { id: 'cactus_shoots', label: 'Brotes nuevos', location: 'cactus_shoots', x: 116, y: 114, radius: 31 },
    { id: 'cactus_base', label: 'Base del tallo', location: 'cactus_base', x: 180, y: 266, radius: 42 },
    { id: 'cactus_roots', label: 'Raíces', location: 'cactus_roots', x: 180, y: 304, radius: 35 },
    { id: 'cactus_areoles', label: 'Areolas y espinas', location: 'cactus_areoles', x: 226, y: 151, radius: 29 },
    { id: 'cactus_flower', label: 'Flor', location: 'cactus_flower', x: 240, y: 45, radius: 34 },
  ],
  monstera: [
    { id: 'monstera_lower_leaves', label: 'Hojas inferiores', location: 'monstera_lower_leaves', x: 100, y: 231, radius: 46 },
    { id: 'monstera_upper_leaves', label: 'Hojas superiores', location: 'monstera_upper_leaves', x: 250, y: 147, radius: 48 },
    { id: 'monstera_young_leaves', label: 'Hojas jóvenes', location: 'monstera_young_leaves', x: 181, y: 60, radius: 35 },
    { id: 'monstera_edges', label: 'Bordes de las hojas', location: 'monstera_edges', x: 296, y: 178, radius: 28 },
    { id: 'monstera_veins', label: 'Nervaduras', location: 'monstera_veins', x: 238, y: 160, radius: 25 },
    { id: 'monstera_stem', label: 'Tallo', location: 'monstera_stem', x: 180, y: 231, radius: 27 },
    { id: 'monstera_petiole', label: 'Pecíolos', location: 'monstera_petiole', x: 191, y: 205, radius: 25 },
    { id: 'monstera_aerial_roots', label: 'Raíces aéreas', location: 'monstera_aerial_roots', x: 202, y: 250, radius: 27 },
    { id: 'monstera_roots', label: 'Raíces del sustrato', location: 'monstera_roots', x: 180, y: 309, radius: 34 },
  ],
}

export function getPlantRegion(plant, regionId) {
  return plantRegions[plant]?.find((item) => item.id === regionId) || null
}

export function activatePlantRegion(plant, regionId, onSelect) {
  const region = getPlantRegion(plant, regionId)
  if (!region) return false
  onSelect(region)
  return true
}

export function resolvePlantRegion(regionId, confirmedLeafAge = null, plant = 'rose') {
  const region = getPlantRegion(plant, regionId)
  if (!region) return null
  if (region.leafGroup) {
    return {
      ...region,
      location: confirmedLeafAge === 'old' ? 'old_leaves' : confirmedLeafAge === 'young' ? 'young_leaves' : 'leaves',
      needsAgeConfirmation: !confirmedLeafAge,
    }
  }
  return { ...region, needsAgeConfirmation: false }
}

export function canContinueToSymptoms({ plant, location, selectedRegion, leafAge }) {
  if (!plantRegions[plant] || !location || !selectedRegion) return false
  const region = resolvePlantRegion(selectedRegion, leafAge, plant)
  if (!region) return false
  return !region.leafGroup || Boolean(leafAge)
}

export function handleSvgRegionKeyDown(event, onSelect) {
  if (event.key !== 'Enter' && event.key !== ' ') return false
  event.preventDefault()
  onSelect()
  return true
}
