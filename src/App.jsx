import { useEffect, useMemo, useState } from 'react'
import { diagnose, diagnosticOptions, getAvailableSymptoms, validateDiagnosticInput } from './diagnosticRules.js'
import { compatibilityLabel } from './hypothesisEngine.js'
import { diagnosticReferences } from './diagnosticReferences.js'
import { getPlants, saveEvaluation, savePlant, subscribeToPlants } from './storage.js'
import { activatePlantRegion, canContinueToSymptoms, getPlantRegion, plantRegions, resolvePlantRegion } from './plantRegions.js'
import RoseIllustration from './illustrations/RoseIllustration.jsx'
import TomatoIllustration from './illustrations/TomatoIllustration.jsx'
import BasilIllustration from './illustrations/BasilIllustration.jsx'
import CactusIllustration from './illustrations/CactusIllustration.jsx'
import MonsteraIllustration from './illustrations/MonsteraIllustration.jsx'
import { ClassroomHome, SubstrateIndex, SubstrateDetail, NutrientIndex, NutrientDetail, ConceptsPage, SpeciesChemistryIndex, NutrientComparator, PhSimulator, MobilityLab, GlossaryPage, NotFoundPage } from './pages/EducationPages.jsx'

const initialAnswers = { plant: '', location: '', symptom: '', ph: '', irrigation: '', context: {} }
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
  return (
    <button className={`plant-card ${selected ? 'selected' : ''}`} type="button" aria-pressed={selected} onClick={() => onSelect(plant.value)}>
      <span className="plant-preview"><Illustration interactive={false} /></span>
      <span className="plant-name">{plant.label}</span>
      <span className="plant-prompt">{selected ? 'Seleccionada' : 'Elegir planta'}</span>
    </button>
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
          <p className="home-species-hint">Selecciona una especie o comienza y elígela en el siguiente paso.</p>
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
        <div><span className="hypothesis-rank">{index === 0 ? 'Mayor compatibilidad' : 'También considerar'}</span><h4>{hypothesis.title}</h4><div className="hypothesis-meta"><span className={`compatibility-pill compatibility-${hypothesis.compatibility === 'alta' ? 'alta' : hypothesis.compatibility === 'parcial' ? 'parcial' : 'insuficiente'}`}>{compatibilityLabel(hypothesis.compatibility)}</span>{hypothesis.nutrient && <span>{hypothesis.nutrient} · {hypothesis.classification}</span>}</div></div>
        <span className="hypothesis-type">{hypothesis.kind === 'nutrient' ? 'Nutricional' : 'Alternativa'}</span>
      </div>
      <p className="hypothesis-mechanism">{hypothesis.mechanism}</p>
      <details className="hypothesis-details"><summary>Ver trazabilidad de la regla</summary>
        {hypothesis.supportingEvidence.length > 0 && <div className="hypothesis-evidence"><strong>Respuestas que respaldan</strong><ul>{hypothesis.supportingEvidence.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.inconclusiveEvidence.length > 0 && <div className="hypothesis-unknown"><strong>Datos no concluyentes o desconocidos</strong><ul>{hypothesis.inconclusiveEvidence.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.contradictions.length > 0 && <div className="hypothesis-conflict"><strong>Respuesta que reduce compatibilidad</strong><ul>{hypothesis.contradictions.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.missing.length > 0 && <div className="hypothesis-missing"><strong>Qué falta comprobar</strong><ul>{hypothesis.missing.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {hypothesis.notes.map((note) => <p className="hypothesis-note" key={note}>{note}</p>)}
        <p className="species-context"><strong>Contexto de especie:</strong> {hypothesis.plantContext}</p>
        {hypothesis.nutrient && <p className="hypothesis-learn"><strong>Aprende la química:</strong> <a href={`#/aula/nutrientes/${encodeURIComponent(hypothesis.nutrient)}`}>Abrir ficha de {hypothesis.nutrient}</a></p>}
        {hypothesis.sourceIds?.length > 0 && <p className="hypothesis-sources"><strong>Referencias:</strong> {hypothesis.sourceIds.map((sourceId) => diagnosticReferences[sourceId]).filter(Boolean).map((source, sourceIndex) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}{sourceIndex < hypothesis.sourceIds.length - 1 ? ' · ' : ''}</a>)}</p>}
        <p className="hypothesis-action"><strong>Siguiente paso:</strong> {hypothesis.recommendation}</p>
      </details>
    </article>
  )
}

function MyPlantsView({ plants, onSelectPlant }) {
  const [activeId, setActiveId] = useState(null)
  const active = plants.find((plant) => plant.id === activeId)
  return <section className="learning-section plants-section" aria-labelledby="plants-title">
    <div className="learning-heading"><div><p className="eyebrow">Seguimiento</p><h1 id="plants-title">Mis plantas</h1></div><p>Guarda evaluaciones para observar cambios reales a través del tiempo.</p></div>
    {plants.length === 0 ? <div className="empty-plants"><h2>Aún no tienes plantas guardadas</h2><p>Cuando termines un diagnóstico podrás crear una planta y empezar su línea de tiempo.</p><a className="button button-primary button-link" href="#/diagnostico/planta">Comenzar observación</a></div> : <div className="plant-record-grid">{plants.map((plant) => <button className="plant-record-card" type="button" key={plant.id} onClick={() => { setActiveId(plant.id); onSelectPlant(plant.id) }}><span className="eyebrow">{plant.species}</span><h2>{plant.name}</h2><p>{plant.evaluations.length} evaluación{plant.evaluations.length === 1 ? '' : 'es'}</p><small>{plant.evaluations.length ? `Última: ${new Date(plant.evaluations.at(-1).date).toLocaleDateString()}` : 'Sin evaluaciones aún'}</small></button>)}</div>}
    {active && <article className="plant-timeline"><div className="section-heading"><div><p className="eyebrow">Evolución</p><h2>{active.name}</h2></div></div>{active.evaluations.length === 0 ? <p>Añade la primera evaluación desde un resultado.</p> : <ol>{active.evaluations.map((evaluation, index) => <li key={evaluation.id}><strong>Día {index + 1} · {new Date(evaluation.date).toLocaleDateString()}</strong><p>{evaluation.observations?.symptom?.join(', ') || 'Observación registrada'}</p><p>{evaluation.notes || 'Sin notas para este cambio.'}</p><details><summary>Ver hipótesis y recomendación</summary><p>{evaluation.hypotheses?.map((item) => item.title).join(' · ')}</p><p>{evaluation.recommendations}</p></details></li>)}</ol>}</article>}
  </section>
}

function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem('leaf-theme') || 'light')
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/inicio')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedRegions, setSelectedRegions] = useState([])
  const [leafAge, setLeafAge] = useState('')
  const [symptomDrafts, setSymptomDrafts] = useState([])
  const [plants, setPlants] = useState(() => getPlants())
  const [selectedPlantId, setSelectedPlantId] = useState('')
  const [error, setError] = useState('')
  const availableSymptoms = useMemo(() => getAvailableSymptoms(answers.plant), [answers.plant])
  const diagnosticInput = useMemo(() => ({ ...answers, observations: symptomDrafts.length ? symptomDrafts.flatMap((item) => item.zones.map((zone) => ({ ...zone, symptom: item.symptom }))) : undefined }), [answers, symptomDrafts])
  const result = useMemo(() => step === 4 && validateDiagnosticInput(diagnosticInput).valid ? diagnose(diagnosticInput) : null, [step, diagnosticInput])
  const currentPlant = diagnosticOptions.plants.find((plant) => plant.value === answers.plant)?.label || 'Sin seleccionar'
  const currentLocation = diagnosticOptions.locations.find((location) => location.value === answers.location)?.label || 'Sin seleccionar'
  const currentSymptom = diagnosticOptions.symptoms.find((symptom) => symptom.value === answers.symptom)?.label || 'Sin seleccionar'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('leaf-theme', theme)
  }, [theme])

  useEffect(() => subscribeToPlants(setPlants), [])

  useEffect(() => {
    function syncRoute() {
      const nextRoute = window.location.hash.slice(1) || '/inicio'
      setRoute(nextRoute)
      const routeStep = { '/inicio': 0, '/diagnostico/planta': 1, '/diagnostico/zona': 2, '/diagnostico/observaciones': 3, '/resultados': 4 }[nextRoute]
      if (routeStep !== undefined) setStep(routeStep)
    }
    window.addEventListener('hashchange', syncRoute)
    if (!window.location.hash) window.location.hash = '/inicio'
    syncRoute()
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  function navigate(path, nextStep) {
    if (nextStep !== undefined) setStep(nextStep)
    if (window.location.hash === `#${path}`) setRoute(path)
    else window.location.hash = path
  }

  const isClassroom = route.startsWith('/aula')
  const isDiagnosis = route.startsWith('/diagnostico') || route === '/resultados'

  function update(field, value) {
    setAnswers((previous) => ({ ...previous, [field]: value }))
    setError('')
  }

  function updateContext(field, value) {
    setAnswers((previous) => ({ ...previous, context: { ...previous.context, [field]: value } }))
    setError('')
  }

  function choosePlant(value) {
    if (answers.plant !== value) {
      setSelectedRegion('')
      setSelectedRegions([])
      setLeafAge('')
      setAnswers((previous) => ({ ...previous, plant: value, location: '', symptom: '', context: {} }))
      setSymptomDrafts([])
      setAnswers((previous) => ({ ...previous, plant: value, location: '', symptom: '', context: {} }))
    }
    setError('')
  }

  function beginWithPlant(value) {
    choosePlant(value)
    navigate('/diagnostico/zona', 2)
  }

  function startDiagnosis() {
    navigate('/diagnostico/planta', 1)
    setError('')
  }

  function selectRegion(region) {
    setSelectedRegion(region.id)
    setSelectedRegions((current) => current.includes(region.id) ? current.filter((id) => id !== region.id) : [...current, region.id])
    setError('')
    if (region.leafGroup) {
      setLeafAge('')
      setAnswers((previous) => ({ ...previous, location: 'leaves' }))
    } else {
      setLeafAge('')
      setAnswers((previous) => ({ ...previous, location: region.location }))
    }
  }

  function confirmLeafAge(age) {
    setLeafAge(age)
    setAnswers((previous) => ({ ...previous, location: age === 'old' ? 'old_leaves' : age === 'young' ? 'young_leaves' : 'leaves' }))
    setError('')
  }

  function continueToSymptoms() {
    if (!answers.plant) return setError('Selecciona una planta para continuar.')
    if (!canContinueToSymptoms({ plant: answers.plant, location: answers.location, selectedRegion, leafAge }) || selectedRegions.length === 0) {
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
  }

  function restart() {
    setAnswers(initialAnswers)
    setSelectedRegion('')
    setSelectedRegions([])
    setLeafAge('')
    setSymptomDrafts([])
    navigate('/inicio', 0)
    setError('')
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
    const existing = plants.find((plant) => plant.id === selectedPlantId)
    const plant = existing || savePlant({ name: window.prompt('Nombre de la planta', currentPlant) || currentPlant, species: answers.plant })
    if (!plant?.id) return
    saveEvaluation(plant.id, { observations: result.observations, hypotheses: result.hypotheses, recommendations: result.recommendation, notes: window.prompt('Notas sobre este cambio') || '' })
    setPlants(getPlants())
    setSelectedPlantId(plant.id)
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
          <a href="#/mis-plantas" className={`nav-link ${route === '/mis-plantas' ? 'active' : ''}`}>Mis plantas</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</button>
        <span className="header-tag">Guía botánica educativa</span>
      </header>

      {route === '/inicio' && <HomeView onStart={startDiagnosis} onSelectPlant={beginWithPlant} />}

      {((route.startsWith('/diagnostico') && step > 0 && step < 4) || (route === '/resultados' && result)) && <section className="workflow-card" aria-live="polite">
        <StepIndicator current={step} />

        {step === 1 && <div className="step-content">
          <div className="section-heading"><div><p className="eyebrow">Paso 1 de 4 · Planta</p><h2>¿Qué planta quieres observar?</h2></div><p className="section-note">Elige una de las especies disponibles.</p></div>
          <div className="plant-grid plant-grid-compact">{diagnosticOptions.plants.map((plant) => <PlantCard key={plant.value} plant={plant} selected={answers.plant === plant.value} onSelect={choosePlant} />)}</div>
          {!answers.plant && <div className="plant-empty-state"><p>Al elegir una especie podrás marcar la zona afectada en su ilustración.</p></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions actions-between"><a className="button button-secondary button-link" href="#/inicio">Regresar al inicio</a><button className="button button-primary" type="button" onClick={() => answers.plant ? navigate('/diagnostico/zona', 2) : setError('Selecciona una planta para continuar.')}>Continuar</button></div>
        </div>}

        {step === 2 && <div className="step-content">
          <div className="section-heading"><div><p className="eyebrow">Paso 2 de 4 · Zona</p><h2>¿Dónde aparece el cambio?</h2></div><p className="section-note">Especie: {currentPlant}</p></div>
          {answers.plant ? <div className="illustration-layout">
            <section className="illustration-panel" aria-label={`Ilustración de ${diagnosticOptions.plants.find((plant) => plant.value === answers.plant)?.label}`}>
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
            <span className={`compatibility-pill compatibility-${result.primaryHypothesis?.compatibility === 'alta' ? 'alta' : result.primaryHypothesis?.compatibility === 'parcial' ? 'parcial' : 'insuficiente'}`}><span className="certainty-dot" />{compatibilityLabel(result.primaryHypothesis?.compatibility || 'información insuficiente')}</span>
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
                <div className="result-panel-heading"><div><p className="result-kicker">Hipótesis principal</p><h3>{result.primaryHypothesis?.title || result.cause}</h3></div>{result.primaryHypothesis && <span className={`compatibility-pill compatibility-${result.primaryHypothesis.compatibility === 'alta' ? 'alta' : result.primaryHypothesis.compatibility === 'parcial' ? 'parcial' : 'insuficiente'}`}>{compatibilityLabel(result.primaryHypothesis.compatibility)}</span>}</div>
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
          <div className="actions actions-between result-actions">
            <button className="button button-secondary" type="button" onClick={() => { setError(''); navigate('/diagnostico/observaciones', 3) }}>Modificar respuestas</button>
            <button className="button button-secondary" type="button" onClick={saveCurrentEvaluation}>Guardar en Mis plantas</button>
            <button className="button button-primary" type="button" onClick={restart}>Empezar de nuevo</button>
          </div>
        </div>}
      </section>}

      {route === '/resultados' && !result && <section className="workflow-card no-result"><div className="step-content"><div className="section-heading"><div><p className="eyebrow">Resultados</p><h2>Aún no hay un análisis disponible</h2></div></div><p>Completa el diagnóstico para comparar hipótesis con tus observaciones. Las respuestas se conservan mientras navegas dentro de esta sesión.</p><div className="actions"><a className="button button-primary button-link" href="#/diagnostico/planta">Ir al diagnóstico</a></div></div></section>}

      {route === '/aula' && <ClassroomHome />}
      {route === '/mis-plantas' && <MyPlantsView plants={plants} onSelectPlant={setSelectedPlantId} />}
      {route === '/aula/sustratos' && <SubstrateIndex />}
      {route.startsWith('/aula/sustratos/') && <SubstrateDetail plantId={route.split('/')[3]} />}
      {route === '/aula/nutrientes' && <NutrientIndex />}
      {route.startsWith('/aula/nutrientes/') && <NutrientDetail symbol={route.split('/')[3]} />}
      {route === '/aula/conceptos' && <ConceptsPage />}
      {route === '/aula/especies' && <SpeciesChemistryIndex />}
      {route === '/aula/comparador' && <NutrientComparator />}
      {route === '/aula/ph' && <PhSimulator />}
      {route === '/aula/laboratorio' && <MobilityLab />}
      {route === '/aula/glosario' && <GlossaryPage />}
      {!['/inicio', '/resultados', '/aula', '/aula/sustratos', '/aula/nutrientes', '/aula/conceptos', '/aula/especies', '/aula/comparador', '/aula/ph', '/aula/laboratorio', '/aula/glosario'].includes(route) && !route.startsWith('/diagnostico/') && !route.startsWith('/aula/sustratos/') && !route.startsWith('/aula/nutrientes/') && <NotFoundPage />}

      <footer className="page-footer"><span>Leaf · Guía educativa de observación vegetal</span><span>Rosa · Tomate · Albahaca · Cactus · Monstera</span></footer>
    </main>
  )
}

export default App
