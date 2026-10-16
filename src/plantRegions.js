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
