import { useEffect, useMemo, useRef, useState } from 'react'
import { diagnose, diagnosticOptions, getAvailableSymptoms, validateDiagnosticInput } from './diagnosticRules.js'
import { compatibilityClass, compatibilityLabel } from './hypothesisEngine.js'
import { diagnosticReferences } from './diagnosticReferences.js'
import { deletePlant, getPlants, saveEvaluation, savePlant, subscribeToPlants, updatePlant } from './storage.js'
import { activatePlantRegion, canContinueToSymptoms, getPlantRegion, plantRegions, resolvePlantRegion } from './plantRegions.js'
import { getPlantProfile } from './plantProfiles.js'
import RoseIllustration from './illustrations/RoseIllustration.jsx'
import TomatoIllustration from './illustrations/TomatoIllustration.jsx'
import BasilIllustration from './illustrations/BasilIllustration.jsx'
import CactusIllustration from './illustrations/CactusIllustration.jsx'
import MonsteraIllustration from './illustrations/MonsteraIllustration.jsx'
import Disclosure from './components/Disclosure.jsx'
import { ClassroomHome, SubstrateIndex, SubstrateDetail, NutrientIndex, NutrientDetail, ConceptsPage, SpeciesChemistryIndex, NutrientComparator, PhSimulator, MobilityLab, GlossaryPage, NotFoundPage } from './pages/EducationPages.jsx'

const initialAnswers = { plant: '', symptom: '', ph: '', irrigation: '', context: {} }
const plantIllustrations = { rose: RoseIllustration, tomato: TomatoIllustration, basil: BasilIllustration, cactus: CactusIllustration, monstera: MonsteraIllustration }

function StepIndicator({ current }) {
  const labels = ['Planta', 'Zona', 'Observaciones', 'Resultados']
  return (
    <ol className="step-indicator" aria-label="Progreso">
      {labels.map((label, index) => (
        <li className={index + 1 === current ? 'active' : index + 1 < current ? 'complete' : ''} key={label}>
          <span className="step-number">{index + 1}</span><span>{label}</span>
        </li>
      ))}
    </ol>
  )
}

function PlantCard({ plant, selected, onSelect }) {
  const Illustration = plantIllustrations[plant.value]
  const profile = getPlantProfile(plant.value)
  const speciesLabel = diagnosticOptions.plants.find((item) => item.value === plant.value)?.label || plant.label
  return (
    <article className={`plant-card ${selected ? 'selected' : ''}`}>
      <button className="plant-card-select" type="button" aria-pressed={selected} onClick={() => onSelect(plant.value)}>
        <span className="plant-preview"><Illustration interactive={false} /></span>
        <span className="plant-name">{plant.label}</span>
        <span className="plant-prompt">{selected ? 'Seleccionada' : 'Elegir planta'}</span>
      </button>
      {profile && <Disclosure className="plant-card-disclosure" summary="Ficha rápida">
        <p className="species-scientific">{profile.scientificName} · {profile.family}</p>
        <p>{profile.description}</p>
        <p>{profile.chemistry}</p>
        <a href="#/aula/especies">Ver {speciesLabel} en el Aula →</a>
      </Disclosure>}
    </article>
  )
}

function HomeView({ onStart, onSelectPlant }) {
  return (
    <section className="home-view" aria-labelledby="home-title">
      <div className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">Guía educativa de química vegetal</p>
          <h1 id="home-title">¿Qué necesita tu planta?</h1>
          <p>Observa un síntoma, compara posibles causas y aprende qué revisar antes de modificar el sustrato o la nutrición.</p>
          <button className="button button-primary home-cta" type="button" onClick={onStart}>Iniciar diagnóstico <span aria-hidden="true">→</span></button>
          <p className="home-disclaimer">Orientación educativa; no sustituye un análisis ni confirma una deficiencia.</p>
        </div>
        <div className="home-species-block">
          <div className="home-species-heading"><span>Especies disponibles</span><span>01 — 05</span></div>
          <div className="home-species-grid">
            {diagnosticOptions.plants.map((plant) => <PlantCard key={plant.value} plant={plant} selected={false} onSelect={onSelectPlant} />)}
          </div>
          <p className="home-species-hint">Selecciona una especie o comienza y elígela en el siguiente paso. «Ficha rápida» abre datos sin seleccionarla.</p>
        </div>
      </div>
      <div className="home-steps" aria-label="Cómo funciona">
        <div><span>01</span><p><strong>Observa</strong><br />Selecciona la planta y la zona afectada.</p></div>
        <div><span>02</span><p><strong>Registra</strong><br />Describe el síntoma y las condiciones de riego.</p></div>
        <div><span>03</span><p><strong>Compara</strong><br />Revisa hipótesis, evidencia y datos pendientes.</p></div>
      </div>
    </section>
  )
}

function SummaryItem({ label, value }) {
  return <div className="summary-item"><dt>{label}</dt><dd>{value}</dd></div>
}

function SelectField({ label, value, onChange, options, required = true, id }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}{required && <span className="required"> *</span>}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        <option value="">Selecciona una opción</option>
        {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function ContextQuestions({ plant, context, onChange }) {
  const questions = diagnosticOptions.contextQuestions[plant] || []
  if (questions.length === 0) return null
  return <section className="form-section context-section"><div className="form-section-heading"><span className="form-section-index">03</span><div><h3>Contexto de {plant === 'cactus' ? 'cactus' : 'Monstera'}</h3><p>Estas preguntas ayudan a separar agua, luz, raíces y nutrición sin alargar el diagnóstico.</p></div></div><div className="form-grid">{questions.map((question) => <SelectField key={question.id} id={question.id} label={question.label} value={context[question.id] || ''} onChange={(value) => onChange(question.id, value)} options={question.options} />)}</div></section>
}

function HypothesisCard({ hypothesis, index }) {
  return (
    <article className="hypothesis-card">
      <div className="hypothesis-heading">
        <div><span className="hypothesis-rank">{index === 0 ? 'Mayor compatibilidad' : 'También considerar'}</span><h4>{hypothesis.title}</h4><div className="hypothesis-meta"><span className={`compatibility-pill compatibility-${compatibilityClass(hypothesis.compatibility)}`}>{compatibilityLabel(hypothesis.compatibility)}</span>{hypothesis.nutrient && <span>{hypothesis.nutrient} · {hypothesis.classification}</span>}</div></div>
        <span className="hypothesis-type">{hypothesis.kind === 'nutrient' ? 'Nutricional' : 'Alternativa'}</span>
      </div>
      <p className="hypothesis-mechanism">{hypothesis.mechanism}</p>
      <Disclosure className="hypothesis-details" summary="Ver trazabilidad de la regla">
        {hypothesis.supportingEvidence.length > 0 && <div className="hypothesis-evidence"><strong>Respuestas que respaldan</strong><ul>{hypothesis.supportingEvidence.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.inconclusiveEvidence.length > 0 && <div className="hypothesis-unknown"><strong>Datos no concluyentes o desconocidos</strong><ul>{hypothesis.inconclusiveEvidence.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.contradictions.length > 0 && <div className="hypothesis-conflict"><strong>Respuesta que reduce compatibilidad</strong><ul>{hypothesis.contradictions.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.missing.length > 0 && <div className="hypothesis-missing"><strong>Qué falta comprobar</strong><ul>{hypothesis.missing.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.notes.map((note) => <p className="hypothesis-note" key={note}>{note}</p>)}
        <p className="species-context"><strong>Contexto de especie:</strong> {hypothesis.plantContext}</p>
        {hypothesis.nutrient && <p className="hypothesis-learn"><strong>Aprende la química:</strong> <a href={`#/aula/nutrientes/${encodeURIComponent(hypothesis.nutrient)}`}>Abrir ficha de {hypothesis.nutrient}</a></p>}
        {hypothesis.sourceIds?.length > 0 && <p className="hypothesis-sources"><strong>Referencias:</strong> {hypothesis.sourceIds.map((sourceId) => diagnosticReferences[sourceId]).filter(Boolean).map((source, sourceIndex) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}{sourceIndex < hypothesis.sourceIds.length - 1 ? ' · ' : ''}</a>)}</p>}
        <p className="hypothesis-action"><strong>Siguiente paso:</strong> {hypothesis.recommendation}</p>
      </Disclosure>
    </article>
  )
}

/** Diálogo único para crear, editar y guardar evaluaciones (sin window.prompt). */
function PlantFormModal({ config, onClose, onSubmit }) {
  const { variant, plant, initial, title, description, noteLabel, submitLabel } = config
  const [name, setName] = useState(initial.name)
  const [species, setSpecies] = useState(initial.species)
  const [notes, setNotes] = useState(initial.notes)
  const [choice, setChoice] = useState(plant ? (plant.species === initial.species ? 'update' : 'create') : 'new')
  const [changeSpecies, setChangeSpecies] = useState(false)
  const nameRef = useRef(null)
  const mismatch = Boolean(plant && variant === 'save' && choice === 'update' && plant.species !== species)
  const effectiveSpecies = mismatch && !changeSpecies ? plant.species : species
  const speciesLabel = (value) => diagnosticOptions.plants.find((item) => item.value === value)?.label || value

  useEffect(() => { nameRef.current?.focus() }, [])
  useEffect(() => {
    function closeOnEscape(event) { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({ variant, plantId: plant?.id, choice, name: name.trim(), species: effectiveSpecies, notes: notes.trim() })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="plant-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading"><div><p className="eyebrow">{variant === 'edit' ? 'Mis plantas' : 'Registro'}</p><h2 id="plant-modal-title">{title}</h2></div><button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">×</button></div>
        {description && <p className="modal-description">{description}</p>}
        <form onSubmit={handleSubmit}>
          {variant === 'save' && plant && <fieldset className="modal-choice">
            <legend>Cómo guardar esta evaluación</legend>
            <label><input type="radio" name="save-choice" value="update" checked={choice === 'update'} onChange={() => setChoice('update')} /> Actualizar «{plant.name}»</label>
            <label><input type="radio" name="save-choice" value="create" checked={choice === 'create'} onChange={() => setChoice('create')} /> Crear una planta nueva</label>
          </fieldset>}
          <div className="modal-fields">
            <label className="field" htmlFor="plant-modal-name"><span>Nombre *</span><input id="plant-modal-name" ref={nameRef} value={name} maxLength={80} required onChange={(event) => setName(event.target.value)} /></label>
            <label className="field" htmlFor="plant-modal-species"><span>Especie *</span><select id="plant-modal-species" value={species} required onChange={(event) => setSpecies(event.target.value)}>{diagnosticOptions.plants.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
          </div>
          {mismatch && <div className="modal-warning"><strong>La planta guardada es de otra especie ({speciesLabel(plant.species)}).</strong><p>Al actualizar se conservará esa especie salvo que lo cambies aquí.</p><label><input type="checkbox" checked={changeSpecies} onChange={(event) => setChangeSpecies(event.target.checked)} /> Cambiarla a {speciesLabel(species)}</label></div>}
          <label className="field" htmlFor="plant-modal-notes"><span>{noteLabel}</span><textarea id="plant-modal-notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
          <div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancelar</button><button className="button button-primary" type="submit">{submitLabel}</button></div>
        </form>
      </div>
    </div>
  )
}

function MyPlantsView({ plants, activePlantId, onSelectPlant, onEditPlant, onDeletePlant, onNewObservation, notice }) {
  const active = plants.find((plant) => plant.id === activePlantId) || null
  return <section className="learning-section plants-section" aria-labelledby="plants-title">
    <div className="learning-heading"><div><p className="eyebrow">Seguimiento</p><h1 id="plants-title">Mis plantas</h1></div><p>Guarda evaluaciones para observar cambios reales a través del tiempo. Puedes editar cada planta o iniciar una nueva observación sobre ella.</p></div>
    {notice && <p className="form-success" role="status">{notice}</p>}
    {plants.length === 0 ? <div className="empty-plants"><h2>Aún no tienes plantas guardadas</h2><p>Cuando termines un diagnóstico podrás crear una planta y empezar su línea de tiempo.</p><a className="button button-primary button-link" href="#/diagnostico/planta">Comenzar observación</a></div> : <div className="plant-record-grid">{plants.map((plant) => <article className={`plant-record-card ${plant.id === activePlantId ? 'active' : ''}`} key={plant.id}>
      <button className="plant-record-main" type="button" aria-pressed={plant.id === activePlantId} onClick={() => onSelectPlant(plant.id)}>
        <span className="eyebrow">{getPlantProfile(plant.species)?.label || plant.species}</span>
        <h2>{plant.name}</h2>
        <p>{plant.evaluations.length} {plant.evaluations.length === 1 ? 'evaluación' : 'evaluaciones'}</p>
        <small>{plant.evaluations.length ? `Última: ${new Date(plant.evaluations.at(-1).date).toLocaleDateString()}` : 'Sin evaluaciones aún'}</small>
      </button>
      <div className="plant-record-actions">
        <button className="text-button" type="button" onClick={() => onNewObservation(plant.id)}>Nueva observación</button>
        <button className="text-button" type="button" onClick={() => onEditPlant(plant)}>Editar</button>
        <button className="text-button danger" type="button" onClick={() => onDeletePlant(plant)}>Eliminar</button>
      </div>
    </article>)}</div>}
    {active && <article className="plant-timeline"><div className="section-heading"><div><p className="eyebrow">Evolución</p><h2>{active.name}</h2></div><button className="button button-secondary" type="button" onClick={() => onNewObservation(active.id)}>Nueva observación</button></div>{active.notes && <p className="timeline-notes">{active.notes}</p>}{active.evaluations.length === 0 ? <p>Añade la primera evaluación desde un resultado o con «Nueva observación».</p> : <ol>{active.evaluations.map((evaluation, index) => <li key={evaluation.id}><strong>Día {index + 1} · {new Date(evaluation.date).toLocaleDateString()}</strong><p>{evaluation.observations?.symptom?.join(', ') || 'Observación registrada'}</p><p>{evaluation.notes || 'Sin notas para este cambio.'}</p><Disclosure summary="Ver hipótesis y recomendación"><p>{evaluation.hypotheses?.map((item) => item.title).join(' · ')}</p><p>{evaluation.recommendations}</p></Disclosure></li>)}</ol>}</article>}
  </section>
}

function getRouteParts() {
  const raw = window.location.hash.slice(1) || '/inicio'
  const [path, search = ''] = raw.split('?')
  return { raw, path, search: search ? `?${search}` : '', plantId: new URLSearchParams(search).get('planta') || '' }
}

function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem('leaf-theme') || 'light')
  const [route, setRoute] = useState(() => getRouteParts().raw)
  const [step, setStep] = useState(() => ({ '/inicio': 0, '/diagnostico/planta': 1, '/diagnostico/zona': 2, '/diagnostico/observaciones': 3, '/resultados': 4 })[getRouteParts().path] ?? 0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [leafAge, setLeafAge] = useState('')
  const [symptomDrafts, setSymptomDrafts] = useState([])
  const [plants, setPlants] = useState(() => getPlants())
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const { path: routePath, search: routeSearch, plantId: targetPlantId } = getRouteParts()
  const selectedRegion = selectedRegions.at(-1) || ''
  const regionData = selectedRegion ? getPlantRegion(answers.plant, selectedRegion) : null
  const resolvedLocation = regionData?.leafGroup
    ? (leafAge === 'old' ? 'old_leaves' : leafAge === 'young' ? 'young_leaves' : 'leaves')
    : regionData?.location || ''
  const availableSymptoms = useMemo(() => getAvailableSymptoms(answers.plant), [answers.plant])
  const diagnosticInput = useMemo(() => ({ ...answers, location: resolvedLocation, observations: symptomDrafts.length ? symptomDrafts.flatMap((item) => item.zones.map((zone) => ({ ...zone, symptom: item.symptom }))) : undefined }), [answers, resolvedLocation, symptomDrafts])
  const result = useMemo(() => step === 4 && validateDiagnosticInput(diagnosticInput).valid ? diagnose(diagnosticInput) : null, [step, diagnosticInput])
  const currentPlant = diagnosticOptions.plants.find((plant) => plant.value === answers.plant)?.label || 'Sin seleccionar'
  const currentLocation = diagnosticOptions.locations.find((location) => location.value === resolvedLocation)?.label || 'Sin seleccionar'
  const targetPlant = plants.find((plant) => plant.id === targetPlantId) || null

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('leaf-theme', theme)
  }, [theme])

  useEffect(() => subscribeToPlants(setPlants), [])

  useEffect(() => {
    if (!targetPlantId || answers.plant) return
    const target = plants.find((plant) => plant.id === targetPlantId)
    if (target) setAnswers((previous) => ({ ...previous, plant: target.species }))
  }, [targetPlantId, plants, answers.plant])

  useEffect(() => {
    function syncRoute() {
      const parts = getRouteParts()
      setRoute(parts.raw)
      const routeStep = { '/inicio': 0, '/diagnostico/planta': 1, '/diagnostico/zona': 2, '/diagnostico/observaciones': 3, '/resultados': 4 }[parts.path]
      if (routeStep !== undefined) setStep(routeStep)
    }
    window.addEventListener('hashchange', syncRoute)
    if (!window.location.hash) window.location.hash = '/inicio'
    syncRoute()
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  /** Conserva el objetivo de re-diagnóstico (?planta=…) entre pasos del asistente. */
  function navigate(path, nextStep, clearTarget = false) {
    const keepQuery = !clearTarget && !path.includes('?') && (path.startsWith('/diagnostico') || path === '/resultados')
    const nextPath = `${path}${keepQuery ? routeSearch : ''}`
    if (nextStep !== undefined) setStep(nextStep)
    if (window.location.hash === `#${nextPath}`) setRoute(nextPath)
    else window.location.hash = nextPath
  }

  const isClassroom = routePath.startsWith('/aula')
  const isDiagnosis = routePath.startsWith('/diagnostico') || routePath === '/resultados'

  function update(field, value) {
    setAnswers((previous) => ({ ...previous, [field]: value }))
    setError('')
    setNotice('')
  }

  function updateContext(field, value) {
    setAnswers((previous) => ({ ...previous, context: { ...previous.context, [field]: value } }))
    setError('')
  }

  function choosePlant(value) {
    if (answers.plant !== value) {
      setSelectedRegions([])
      setLeafAge('')
      setAnswers((previous) => ({ ...previous, plant: value, symptom: '', context: {} }))
      setSymptomDrafts([])
    }
    setError('')
  }

  function beginWithPlant(value) {
    choosePlant(value)
    navigate('/diagnostico/zona', 2)
  }

  function startDiagnosis() {
    navigate('/diagnostico/planta', 1, true)
    setError('')
    setNotice('')
  }

  function selectRegion(region) {
    setSelectedRegions((current) => current.includes(region.id) ? current.filter((id) => id !== region.id) : [...current, region.id])
    setLeafAge('')
    setError('')
  }

  function confirmLeafAge(age) {
    setLeafAge(age)
    setError('')
  }

  function continueToSymptoms() {
    if (!answers.plant) return setError('Selecciona una planta para continuar.')
    if (!canContinueToSymptoms({ plant: answers.plant, location: resolvedLocation, selectedRegion, leafAge }) || selectedRegions.length === 0) {
      return setError('Selecciona una zona. Si elegiste hojas, confirma si son viejas, jóvenes o si no estás seguro.')
    }
    navigate('/diagnostico/observaciones', 3)
    setError('')
  }

  function showResult(event) {
    event.preventDefault()
    const validation = validateDiagnosticInput(diagnosticInput)
    if (!validation.valid) {
      setError(validation.errors.map((item) => item.message).join(' '))
      return
    }
    navigate('/resultados', 4)
    setError('')
    setNotice('')
  }

  function restart() {
    setAnswers(initialAnswers)
    setSelectedRegions([])
    setLeafAge('')
    setSymptomDrafts([])
    setModal(null)
    navigate('/inicio', 0)
    setError('')
    setNotice('')
  }

  function addSymptom() {
    if (!answers.symptom || selectedRegions.length === 0) return setError('Selecciona un síntoma y al menos una zona.')
    const zones = selectedRegions.map((regionId) => {
      const resolved = resolvePlantRegion(regionId, leafAge, answers.plant)
      return { id: `${regionId}-${leafAge || 'fixed'}`, regionId, location: resolved.location, leafAge }
    })
    setSymptomDrafts((current) => current.some((item) => item.symptom === answers.symptom && item.zones.some((zone) => zones.some((candidate) => candidate.regionId === zone.regionId))) ? current : [...current, { id: `symptom-${Date.now()}`, symptom: answers.symptom, zones }])
    setError('')
  }

  function removeSymptom(id) { setSymptomDrafts((current) => current.filter((item) => item.id !== id)) }

  function saveCurrentEvaluation() {
    if (!result) return
    setModal({
      variant: 'save',
      plant: targetPlant,
      initial: { name: targetPlant?.name || currentPlant, species: answers.plant, notes: '' },
      title: targetPlant ? 'Guardar nueva evaluación' : 'Guardar en Mis plantas',
      description: targetPlant
        ? 'La evaluación se añadirá a la línea de tiempo de esta planta. También puedes crear una planta nueva.'
        : 'Crea una planta para guardar esta evaluación y seguir su evolución.',
      noteLabel: 'Notas sobre este cambio',
      submitLabel: targetPlant ? 'Guardar evaluación' : 'Guardar planta y evaluación',
    })
  }

  function openEditPlant(plant) {
    setModal({
      variant: 'edit',
      plant,
      initial: { name: plant.name, species: plant.species, notes: plant.notes || '' },
      title: 'Editar planta',
      description: 'Actualiza los datos de la planta. Sus evaluaciones se conservan.',
      noteLabel: 'Notas de la planta',
      submitLabel: 'Guardar cambios',
    })
  }

  function handleModalSubmit({ variant, plantId, choice, name, species, notes }) {
    if (variant === 'edit') {
      const updated = updatePlant(plantId, { name, species, notes })
      if (!updated) return setError('No se pudo actualizar la planta.')
      setPlants((current) => current.map((plant) => plant.id === updated.id ? updated : plant))
      setNotice(`Se actualizó «${updated.name}».`)
    } else {
      let plant = null
      if (choice === 'update' && plantId) {
        plant = updatePlant(plantId, { name, species })
        if (!plant) return setError('No se pudo actualizar la planta.')
        setPlants((current) => current.map((item) => item.id === plant.id ? plant : item))
      } else {
        plant = savePlant({ name, species })
        if (!plant) return setError('No se pudo guardar la planta.')
        setPlants((current) => [...current, plant])
      }
      const updated = saveEvaluation(plant.id, { observations: result.observations, hypotheses: result.hypotheses, recommendations: result.recommendation, notes })
      if (!updated) return setError('La planta se guardó, pero no se pudo añadir la evaluación.')
      setPlants((current) => current.map((item) => item.id === updated.id ? updated : item))
      setNotice(`Evaluación guardada en «${plant.name}».`)
    }
    setModal(null)
    setError('')
  }

  function deleteSavedPlant(plant) {
    const evaluationCount = plant.evaluations.length
    const evaluationDetail = evaluationCount === 1 ? 'su evaluación' : `sus ${evaluationCount} evaluaciones`
    if (!window.confirm(`¿Eliminar «${plant.name}» y ${evaluationDetail}? Esta acción no se puede deshacer.`)) return
    if (!deletePlant(plant.id)) return setError('No se pudo eliminar la planta.')
    setPlants((current) => current.filter((item) => item.id !== plant.id))
    if (targetPlantId === plant.id) navigate('/mis-plantas')
    setNotice(`Se eliminó «${plant.name}».`)
    setError('')
  }

  function openNewObservation(plantId) {
    const plant = plants.find((item) => item.id === plantId)
    if (!plant) return
    choosePlant(plant.species)
    setNotice('')
    navigate(`/diagnostico/planta?planta=${encodeURIComponent(plantId)}`, 1)
  }

  function selectSavedPlant(plantId) {
    navigate(`/mis-plantas?planta=${encodeURIComponent(plantId)}`)
    setNotice('')
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="#/inicio" onClick={() => setError('')}>
          <span className="wordmark-mark" aria-hidden="true">L</span><span>Leaf</span>
        </a>
        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#/inicio" className="nav-link">Inicio</a>
          <a href="#/diagnostico/planta" className={`nav-link ${isDiagnosis ? 'active' : ''}`} aria-current={isDiagnosis ? 'page' : undefined}>Diagnóstico</a>
          <a href="#/aula" className={`nav-link ${isClassroom ? 'active' : ''}`} aria-current={isClassroom ? 'page' : undefined}>Aula de química</a>
          <a href="#/mis-plantas" className={`nav-link ${routePath === '/mis-plantas' ? 'active' : ''}`}>Mis plantas</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</button>
        <span className="header-tag">Guía botánica educativa</span>
      </header>

      {routePath === '/inicio' && <HomeView onStart={startDiagnosis} onSelectPlant={beginWithPlant} />}

      {((routePath.startsWith('/diagnostico') && step > 0 && step < 4) || (routePath === '/resultados' && result)) && <section className="workflow-card" aria-live="polite">
        <StepIndicator current={step} />

        {step === 1 && <div className="step-content">
          <div className="section-heading"><div><p className="eyebrow">Paso 1 de 4 · Planta</p><h2>¿Qué planta quieres observar?</h2></div><p className="section-note">Elige una de las especies disponibles.</p></div>
          <div className="plant-grid plant-grid-compact">{diagnosticOptions.plants.map((plant) => <PlantCard key={plant.value} plant={plant} selected={answers.plant === plant.value} onSelect={choosePlant} />)}</div>
          {!answers.plant && <div className="plant-empty-state"><p>Al elegir una especie podrás marcar la zona afectada en su ilustración.</p></div>}
          {targetPlant && <div className="target-plant-note" role="status"><strong>Observación para «{targetPlant.name}».</strong> Al guardar, se añadirá a su historial. <button className="text-button" type="button" onClick={() => navigate('/diagnostico/planta', 1, true)}>Registrar otra planta</button></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {notice && <p className="form-success" role="status">{notice}</p>}
          <div className="actions actions-between"><a className="button button-secondary button-link" href="#/inicio">Regresar al inicio</a><button className="button button-primary" type="button" onClick={() => answers.plant ? navigate('/diagnostico/zona', 2) : setError('Selecciona una planta para continuar.')}>Continuar</button></div>
        </div>}

        {step === 2 && <div className="step-content">
          <div className="section-heading"><div><p className="eyebrow">Paso 2 de 4 · Zona</p><h2>¿Dónde aparece el cambio?</h2></div><p className="section-note">Especie: {currentPlant}</p></div>
          {answers.plant ? <div className="illustration-layout">
            <section className="illustration-panel" aria-label={`Ilustración de ${currentPlant}`}>
              <div className="illustration-heading"><div><p className="eyebrow">Zona de observación</p><h3>{currentPlant}</h3></div><p>Haz clic o usa Tab y Enter para seleccionar una parte.</p></div>
              <div className="illustration-stage">{(() => { const Illustration = plantIllustrations[answers.plant]; return <Illustration selectedRegion={selectedRegion} onSelect={selectRegion} /> })()}</div>
              {selectedRegion && (() => { const selected = resolvePlantRegion(selectedRegion, leafAge, answers.plant); return <p className="selected-region" role="status">Zona seleccionada: <strong>{selected?.label}</strong></p> })()}
            </section>
            <aside className="zone-picker"><div className="zone-picker-heading"><span className="zone-step">02</span><div><h3>Selecciona una región</h3><p>Las zonas responden al clic, al teclado y a los controles alternativos.</p></div></div>
              <div className="region-button-list">{plantRegions[answers.plant].map((region) => <button type="button" key={region.id} className={`region-button ${selectedRegions.includes(region.id) ? 'selected' : ''}`} aria-pressed={selectedRegions.includes(region.id)} onClick={() => activatePlantRegion(answers.plant, region.id, selectRegion)}>{region.label}</button>)}</div>
              {selectedRegion && resolvePlantRegion(selectedRegion, leafAge, answers.plant)?.leafGroup && <div className="leaf-age-question" role="group" aria-labelledby="leaf-age-title"><p className="selected-region">Región: <strong>{getPlantRegion(answers.plant, selectedRegion)?.label}</strong></p><h3 id="leaf-age-title">¿Qué edad tienen las hojas afectadas?</h3><p>El dibujo no permite saberlo. Confirma lo que observas, o indica que no estás seguro.</p><div className="leaf-age-options"><button type="button" aria-pressed={leafAge === 'old'} className={leafAge === 'old' ? 'selected' : ''} onClick={() => confirmLeafAge('old')}>Viejas</button><button type="button" aria-pressed={leafAge === 'young'} className={leafAge === 'young' ? 'selected' : ''} onClick={() => confirmLeafAge('young')}>Jóvenes</button><button type="button" aria-pressed={leafAge === 'unknown'} className={leafAge === 'unknown' ? 'selected' : ''} onClick={() => confirmLeafAge('unknown')}>No estoy seguro</button></div></div>}
              {!selectedRegion && <p className="zone-empty-state">Selecciona una región para continuar. Si eliges hojas, se preguntará su edad.</p>}
            </aside>
          </div> : <div className="plant-empty-state"><p>Primero selecciona una especie.</p><a href="#/diagnostico/planta">Ir a selección de planta</a></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions actions-between"><button className="button button-secondary" type="button" onClick={() => navigate('/diagnostico/planta', 1)}>Regresar</button><button className="button button-primary" type="button" onClick={continueToSymptoms}>Continuar</button></div>
        </div>}

        {step === 3 && <form className="step-content" onSubmit={showResult}>
          <div className="section-heading"><div><p className="eyebrow">Paso 3 de 4 · Observaciones</p><h2>Describe lo que estás observando</h2></div><p className="section-note">Añade condiciones que ayuden a valorar las hipótesis.</p></div>
          <div className="answer-summary"><span>{currentPlant}</span><span>{currentLocation}</span><button type="button" className="text-button" onClick={() => navigate('/diagnostico/zona', 2)}>Modificar zona</button></div>
          <section className="form-section symptom-section"><div className="form-section-heading"><span className="form-section-index">01</span><div><h3>Añade síntomas y zonas</h3><p>Registra varias observaciones y evita duplicados.</p></div></div><SelectField id="symptom" label="Síntoma observado" value={answers.symptom} onChange={(value) => update('symptom', value)} options={availableSymptoms} /><button className="button button-secondary add-observation-button" type="button" onClick={addSymptom}>Añadir observación</button>{symptomDrafts.length > 0 && <ul className="observation-list">{symptomDrafts.map((item) => <li key={item.id}><span><strong>{diagnosticOptions.symptoms.find((option) => option.value === item.symptom)?.label}</strong><small>{item.zones.map((zone) => diagnosticOptions.locations.find((option) => option.value === zone.location)?.label).join(', ')}</small></span><button className="text-button" type="button" onClick={() => removeSymptom(item.id)}>Eliminar</button></li>)}</ul>}</section>
          <section className="form-section conditions-section"><div className="form-section-heading"><span className="form-section-index">02</span><div><h3>Condiciones de cultivo</h3><p>El pH es opcional; el riego aporta contexto de absorción y transporte.</p></div></div><div className="form-grid">
            <label className="field" htmlFor="ph"><span>pH medido <span className="optional">(opcional)</span></span><input id="ph" type="number" min="0" max="14" step="0.1" inputMode="decimal" placeholder="Por ejemplo, 6.5" value={answers.ph} onChange={(event) => update('ph', event.target.value)} /><span className="field-hint">Valor entre 0 y 14. Si no lo conoces, déjalo vacío.</span></label>
            <SelectField id="irrigation" label="Tipo de riego" value={answers.irrigation} onChange={(value) => update('irrigation', value)} options={diagnosticOptions.irrigation} />
          </div></section>
          <ContextQuestions plant={answers.plant} context={answers.context} onChange={updateContext} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions actions-between"><button className="button button-secondary" type="button" onClick={() => navigate('/diagnostico/zona', 2)}>Regresar</button><button className="button button-primary" type="submit">Ver resultados</button></div>
        </form>}

        {step === 4 && result && <div className="step-content result-content">
          <div className="section-heading">
            <div><p className="eyebrow">Resultados · Informe educativo</p><h2>Posibles causas y evidencia</h2></div>
            <span className={`compatibility-pill compatibility-${compatibilityClass(result.primaryHypothesis?.compatibility || 'información insuficiente')}`}><span className="certainty-dot" />{compatibilityLabel(result.primaryHypothesis?.compatibility || 'información insuficiente')}</span>
          </div>
          <div className="result-report-layout">
            <aside className="result-sidebar" aria-label="Datos registrados">
              <div className="result-summary-card">
                <p className="result-kicker">Registro analizado</p>
                <h3>{currentPlant}</h3>
                <dl className="summary-list">
                  <SummaryItem label="Zonas" value={result.observations.location.join(' · ')} />
                  <SummaryItem label="Síntomas" value={result.observations.symptom.join(' · ')} />
                  <SummaryItem label="pH" value={answers.ph === '' ? 'No registrado' : answers.ph} />
                  <SummaryItem label="Riego" value={diagnosticOptions.irrigation.find((item) => item.value === answers.irrigation)?.label || 'Sin registrar'} />
                </dl>
              </div>
              <aside className="report-caveat"><strong>Lectura educativa</strong><p>La compatibilidad ordena hipótesis; no es una probabilidad ni confirma una deficiencia. Interpreta el resultado junto con el estado de raíces y el historial del cultivo.</p></aside>
            </aside>
            <div className="result-main">
              <div className="result-panel">
                <div className="result-panel-heading"><div><p className="result-kicker">Hipótesis principal</p><h3>{result.primaryHypothesis?.title || result.cause}</h3></div>{result.primaryHypothesis && <span className={`compatibility-pill compatibility-${compatibilityClass(result.primaryHypothesis.compatibility)}`}>{compatibilityLabel(result.primaryHypothesis.compatibility)}</span>}</div>
                <p>{result.explanation}</p>
                {result.primaryHypothesis?.nutrient && <p className="result-nutrient-link"><strong>{result.primaryHypothesis.nutrient} · {result.primaryHypothesis.classification}</strong> · <a href={`#/aula/nutrientes/${encodeURIComponent(result.primaryHypothesis.nutrient)}`}>Consultar ficha del nutriente</a></p>}
                <div className="recommendation"><h4>Qué deberías revisar a continuación</h4><p>{result.recommendation}</p></div>
              </div>
              {result.primaryHypothesis && <section className="evidence-overview" aria-labelledby="evidence-overview-title">
                <div className="differential-heading"><h3 id="evidence-overview-title">Por qué aparece esta hipótesis</h3><p>La explicación se construye con tus respuestas, no con una probabilidad estadística.</p></div>
                <div className="evidence-columns">
                  <div className="evidence-column evidence-column-support"><strong>Coincidencias</strong>{result.primaryHypothesis.supportingEvidence.length > 0 ? <ul>{result.primaryHypothesis.supportingEvidence.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No se registró una coincidencia fuerte.</p>}</div>
                  <div className="evidence-column evidence-column-unknown"><strong>No concluyente</strong>{result.primaryHypothesis.inconclusiveEvidence.length > 0 ? <ul>{result.primaryHypothesis.inconclusiveEvidence.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No hay datos desconocidos para esta regla.</p>}</div>
                  <div className="evidence-column evidence-column-conflict"><strong>Reduce compatibilidad</strong>{result.primaryHypothesis.contradictions.length > 0 ? <ul>{result.primaryHypothesis.contradictions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No se detectó una respuesta contradictoria.</p>}</div>
                </div>
              </section>}
              {result.hypotheses.length > 0 && <section className="differential" aria-labelledby="differential-title">
                <div className="differential-heading"><h3 id="differential-title">Hipótesis comparadas</h3><p>Incluye la hipótesis con mayor compatibilidad y alternativas; no se muestran porcentajes.</p></div>
                <div className="hypothesis-list">{result.hypotheses.map((hypothesis, index) => <HypothesisCard hypothesis={hypothesis} index={index} key={hypothesis.id} />)}</div>
              </section>}
              <div className="result-notes">
                <h3>Datos faltantes y contexto</h3>
                <ul>{result.reasons.map((reason, index) => <li key={`${index}-${reason}`}>{reason}</li>)}</ul>
                {result.missingData.length > 0 && <ul className="missing-list">{result.missingData.map((item) => <li key={item}>{item}</li>)}</ul>}
                {result.missingData.some((item) => /pH/i.test(item)) && <p className="ph-note"><strong>Sobre el pH:</strong> No se registró una medición. Puede ayudar a interpretar la disponibilidad de algunos nutrientes, especialmente hierro.</p>}
                <p className="educational-note">Si el problema persiste, empeora o afecta varias plantas, consulta a un especialista o solicita un análisis del sustrato.</p>
              </div>
            </div>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {notice && <p className="form-success" role="status">{notice}</p>}
          <div className="actions actions-between result-actions">
            <button className="button button-secondary" type="button" onClick={() => { setError(''); navigate('/diagnostico/observaciones', 3) }}>Modificar respuestas</button>
            <button className="button button-secondary" type="button" onClick={saveCurrentEvaluation}>Guardar en Mis plantas</button>
            <button className="button button-primary" type="button" onClick={restart}>Empezar de nuevo</button>
          </div>
        </div>}
      </section>}

      {routePath === '/resultados' && !result && <section className="workflow-card no-result"><div className="step-content"><div className="section-heading"><div><p className="eyebrow">Resultados</p><h2>Aún no hay un análisis disponible</h2></div></div><p>Completa el diagnóstico para comparar hipótesis con tus observaciones. Las respuestas se conservan mientras navegas dentro de esta sesión.</p><div className="actions"><a className="button button-primary button-link" href="#/diagnostico/planta">Ir al diagnóstico</a></div></div></section>}

      {routePath === '/aula' && <ClassroomHome />}
      {routePath === '/mis-plantas' && <MyPlantsView plants={plants} activePlantId={targetPlantId} onSelectPlant={selectSavedPlant} onEditPlant={openEditPlant} onDeletePlant={deleteSavedPlant} onNewObservation={openNewObservation} notice={notice} />}
      {routePath === '/aula/sustratos' && <SubstrateIndex />}
      {routePath.startsWith('/aula/sustratos/') && <SubstrateDetail plantId={routePath.split('/')[3]} />}
      {routePath === '/aula/nutrientes' && <NutrientIndex />}
      {routePath.startsWith('/aula/nutrientes/') && <NutrientDetail symbol={routePath.split('/')[3]} />}
      {routePath === '/aula/conceptos' && <ConceptsPage />}
      {routePath === '/aula/especies' && <SpeciesChemistryIndex />}
      {routePath === '/aula/comparador' && <NutrientComparator />}
      {routePath === '/aula/ph' && <PhSimulator />}
      {routePath === '/aula/laboratorio' && <MobilityLab />}
      {routePath === '/aula/glosario' && <GlossaryPage />}
      {!['/inicio', '/resultados', '/mis-plantas', '/aula', '/aula/sustratos', '/aula/nutrientes', '/aula/conceptos', '/aula/especies', '/aula/comparador', '/aula/ph', '/aula/laboratorio', '/aula/glosario'].includes(routePath) && !routePath.startsWith('/diagnostico/') && !routePath.startsWith('/aula/sustratos/') && !routePath.startsWith('/aula/nutrientes/') && <NotFoundPage />}

      <footer className="page-footer"><span>Leaf · Guía educativa de observación vegetal</span><span>Rosa · Tomate · Albahaca · Cactus · Monstera</span></footer>

      {modal && <PlantFormModal config={modal} onClose={() => setModal(null)} onSubmit={handleModalSubmit} />}
    </main>
  )
}

export default App
