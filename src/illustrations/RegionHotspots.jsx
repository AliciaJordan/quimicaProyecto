import { activatePlantRegion, handleSvgRegionKeyDown, plantRegions } from '../plantRegions.js'

export function RegionHotspots({ plant, selectedRegion, onSelect }) {
  return plantRegions[plant].map((region) => {
    const selected = selectedRegion === region.id
    return (
      <g
        key={region.id}
        className={`plant-hotspot ${selected ? 'is-selected' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={region.label}
        aria-pressed={selected}
        onClick={() => activatePlantRegion(plant, region.id, onSelect)}
        onKeyDown={(event) => handleSvgRegionKeyDown(event, () => activatePlantRegion(plant, region.id, onSelect))}
      >
        <circle className="hotspot-target" cx={region.x} cy={region.y} r={region.radius} />
        <circle className="hotspot-ring" cx={region.x} cy={region.y} r={region.radius - 3} />
        <circle className="hotspot-center" cx={region.x} cy={region.y} r="4" />
      </g>
    )
  })
}

export function SvgFrame({ plant, children, onSelect, selectedRegion, title, description }) {
  return (
    <svg className="plant-illustration" viewBox="0 0 360 360" role="group" aria-label={title}>
      <title>{title}</title>
      <desc>{description}</desc>
      <ellipse className="pot-shadow" cx="180" cy="333" rx="81" ry="9" />
      {children}
      <RegionHotspots plant={plant} selectedRegion={selectedRegion} onSelect={onSelect} />
    </svg>
  )
}
