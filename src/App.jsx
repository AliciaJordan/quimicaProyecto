import { useMemo, useState } from 'react'
import { diagnose, diagnosticOptions, getAvailableSymptoms, validateDiagnosticInput } from './diagnosticRules.js'
import { diagnosticReferences } from './diagnosticReferences.js'
import { chemistryPlants, chemicalElements, chemistrySources } from './chemistryGuides.js'
import { activatePlantRegion, canContinueToSymptoms, getPlantRegion, plantRegions, resolvePlantRegion } from './plantRegions.js'
import RoseIllustration from './illustrations/RoseIllustration.jsx'
import TomatoIllustration from './illustrations/TomatoIllustration.jsx'
import BasilIllustration from './illustrations/BasilIllustration.jsx'

const initialAnswers = { plant: '', location: '', symptom: '', ph: '', irrigation: '' }

function StepIndicator({ current }) {
  const labels = ['Planta y zona', 'Síntomas', 'Resultado']
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
  return (
    <button className={`plant-card ${selected ? 'selected' : ''}`} type="button" aria-pressed={selected} onClick={() => onSelect(plant.value)}>
      <span className="plant-initial" aria-hidden="true">{plant.label.charAt(0)}</span>
      <span className="plant-name">{plant.label}</span>
      <span className="plant-prompt">Seleccionar</span>
    </button>
  )
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

function HypothesisCard({ hypothesis, index }) {
  return (
    <article className="hypothesis-card">
      <div className="hypothesis-heading">
        <div><span className="hypothesis-rank">{index === 0 ? 'Mayor compatibilidad' : 'También considerar'}</span><h4>{hypothesis.title}</h4></div>
        <span className="hypothesis-type">{hypothesis.kind === 'nutrient' ? 'Nutricional' : 'Alternativa'}</span>
      </div>
      <p className="hypothesis-mechanism">{hypothesis.mechanism}</p>
      {hypothesis.evidence.length > 0 && <div className="hypothesis-evidence"><strong>Qué coincide</strong><ul>{hypothesis.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>}
      {hypothesis.missing.length > 0 && <div className="hypothesis-missing"><strong>Qué falta o no coincide</strong><ul>{hypothesis.missing.map((item) => <li key={item}>{item}</li>)}</ul></div>}
      {hypothesis.notes.map((note) => <p className="hypothesis-note" key={note}>{note}</p>)}
      <p className="species-context"><strong>Contexto de especie:</strong> {hypothesis.plantContext}</p>
      {hypothesis.sourceIds?.length > 0 && <p className="hypothesis-sources"><strong>Referencias:</strong> {hypothesis.sourceIds.map((sourceId) => diagnosticReferences[sourceId]).filter(Boolean).map((source, sourceIndex) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}{sourceIndex < hypothesis.sourceIds.length - 1 ? ' · ' : ''}</a>)}</p>}
      <p className="hypothesis-action"><strong>Siguiente paso:</strong> {hypothesis.recommendation}</p>
    </article>
  )
}

function ChemistryGuides({ selectedPlant, onSelectPlant }) {
  const plant = chemistryPlants.find((item) => item.id === selectedPlant) || chemistryPlants[0]
  return (
    <section className="learning-section" aria-labelledby="chemistry-title">
      <div className="learning-heading">
        <p className="eyebrow">Aula de química vegetal</p>
        <h2 id="chemistry-title">Sustrato, nutrientes y crecimiento</h2>
        <p>Una mezcla equilibrada ofrece agua, aire, soporte y nutrientes disponibles. Estas recetas son una base educativa para <strong>macetas</strong>; no sustituyen un análisis ni una recomendación de fertilización.</p>
      </div>
      <div className="guide-tabs" role="tablist" aria-label="Guías por planta">
        {chemistryPlants.map((item) => <button key={item.id} type="button" role="tab" aria-selected={selectedPlant === item.id} className={selectedPlant === item.id ? 'guide-tab active' : 'guide-tab'} onClick={() => onSelectPlant(item.id)}>{item.name}</button>)}
      </div>
      <article className="guide-card">
        <header className="guide-title"><div><span>{plant.nameTag}</span><h3>Mezcla para {plant.name.toLowerCase()} en maceta</h3></div><span className="guide-label">Por volumen</span></header>
        <p className="guide-intro">{plant.focus}</p>
        <div className="recipe-list">
          {plant.mix.map((item) => <div className="recipe-row" key={item.ingredient}><strong className="recipe-amount">{item.amount}</strong><div><h4>{item.ingredient}</h4><p>{item.role}</p></div></div>)}
        </div>
        <div className="tutorial">
          <h4>Tutorial: prepara la mezcla</h4>
          <ol>
            <li>Usa un recipiente limpio y mide cada parte con el mismo bote o cubeta; las proporciones son de volumen.</li>
            <li>Hidrata primero la fibra de coco según su empaque. Usa compost completamente maduro y corteza compostada para horticultura.</li>
            <li>Mezcla los componentes hasta que el color y la textura sean uniformes. Humedece poco a poco: debe sentirse húmeda al apretarla, sin gotear.</li>
            <li>Llena una maceta con orificios de drenaje y prueba el riego. El agua debe atravesar la mezcla y no quedar acumulada en un plato.</li>
            <li>Observa cómo seca durante los siguientes riegos. Si queda compacta o permanece saturada, revisa el drenaje y la estructura antes de plantar.</li>
          </ol>
        </div>
        <div className="chemistry-callout"><strong>¿Por qué estos materiales?</strong><p>La fibra de coco almacena agua; la perlita o corteza compostada crea poros con aire; el compost aporta materia orgánica y nutrientes de composición variable. Juntos buscan un balance entre retención y drenaje para que las raíces respiren y absorban agua e iones minerales.</p></div>
        <div className="ph-callout"><strong>pH de referencia</strong><p>{plant.ph}</p></div>
        <p className="guide-note">{plant.note}</p>
      </article>

      <div className="nutrient-heading"><div><p className="eyebrow">Qué ocurre a nivel molecular</p><h3>Elementos que la planta absorbe</h3></div><p>La raíz absorbe formas iónicas disueltas en agua; la disponibilidad depende, entre otros factores, del pH, el agua y la composición del sustrato.</p></div>
      <div className="element-grid">
        {chemicalElements.map((element) => <article className="element-card" key={element.symbol}><div className="element-symbol">{element.symbol}<span>{element.ion}</span></div><div><h4>{element.name}</h4><p>{element.function}</p></div></article>)}
      </div>
      <aside className="chemical-caution"><strong>Antes de añadir nutrientes</strong><p>Más no significa mejor: un exceso o un pH fuera de rango puede interferir con otros nutrientes y dañar raíces. El compost no tiene composición fija y las señales visibles se parecen entre sí. Mide el pH y, si el problema persiste, solicita un análisis del sustrato antes de corregirlo. Estas recetas no incluyen dosis de fertilizantes.</p></aside>
      <details className="sources-details"><summary>Fuentes técnicas consultadas</summary><ul>{chemistrySources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
    </section>
  )
}

function App() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState(initialAnswers)
  const [guidePlant, setGuidePlant] = useState('rose')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [leafAge, setLeafAge] = useState('')
  const [error, setError] = useState('')
  const availableSymptoms = useMemo(() => getAvailableSymptoms(answers.plant), [answers.plant])
  const result = useMemo(() => step === 3 ? diagnose(answers) : null, [step, answers])

  function update(field, value) {
    setAnswers((previous) => ({ ...previous, [field]: value }))
    setError('')
  }

  function choosePlant(value) {
    setGuidePlant(value)
    if (answers.plant !== value) {
      setSelectedRegion('')
      setLeafAge('')
      setAnswers((previous) => ({ ...previous, plant: value, location: '', symptom: previous.symptom === 'blossom_end_rot' && value !== 'tomato' ? '' : previous.symptom }))
    }
    setError('')
  }

  function selectRegion(region) {
    setSelectedRegion(region.id)
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
    if (!canContinueToSymptoms({ plant: answers.plant, location: answers.location, selectedRegion, leafAge })) {
      return setError('Selecciona una zona. Si elegiste hojas, confirma si son viejas, jóvenes o si no estás seguro.')
    }
    setStep(2)
    setError('')
  }

  function showResult(event) {
    event.preventDefault()
    const validation = validateDiagnosticInput(answers)
    if (!validation.valid) {
      setError(validation.errors.map((item) => item.message).join(' '))
      return
    }
    setStep(3)
    setError('')
  }

  function restart() {
    setAnswers(initialAnswers)
    setSelectedRegion('')
    setLeafAge('')
    setStep(1)
    setError('')
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="#inicio" onClick={(event) => { event.preventDefault(); restart() }}>
          <span className="wordmark-mark" aria-hidden="true">Q</span><span>Guía de observación vegetal</span>
        </a>
        <span className="header-tag">Herramienta educativa</span>
      </header>

      <section className="intro" id="inicio">
        <p className="eyebrow">Orientación para el cuidado de tus plantas</p>
        <h1>¿Qué necesita tu planta?</h1>
        <p className="intro-copy">Registra lo que observas para explorar posibles causas nutricionales en rosas, tomates y albahaca.</p>
      </section>

      <section className="workflow-card" aria-live="polite">
        <StepIndicator current={step} />

        {step === 1 && <div className="step-content">
          <div className="section-heading">
            <div><p className="eyebrow">Paso 1 de 3</p><h2>Elige una planta y señala la zona</h2></div>
            <p className="section-note">Selecciona una parte de la ilustración.</p>
          </div>
          <div className="plant-grid">
            {diagnosticOptions.plants.map((plant) => <PlantCard key={plant.value} plant={plant} selected={answers.plant === plant.value} onSelect={choosePlant} />)}
          </div>
          {answers.plant && <div className="illustration-panel">
            <div className="illustration-heading"><div><p className="eyebrow">Selecciona la parte afectada</p><h3>{diagnosticOptions.plants.find((plant) => plant.value === answers.plant)?.label}</h3></div><p>Haz clic en la zona o enfócala y presiona Enter o Espacio.</p></div>
            <div className="illustration-stage">
              {(() => {
                const Illustration = { rose: RoseIllustration, tomato: TomatoIllustration, basil: BasilIllustration }[answers.plant]
                return <Illustration selectedRegion={selectedRegion} onSelect={selectRegion} />
              })()}
            </div>
            <div className="region-controls">
              <p className="region-controls-title">O elige una zona de esta lista</p>
              <div className="region-button-list">{plantRegions[answers.plant].map((region) => <button type="button" key={region.id} className={`region-button ${selectedRegion === region.id ? 'selected' : ''}`} aria-pressed={selectedRegion === region.id} onClick={() => activatePlantRegion(answers.plant, region.id, selectRegion)}>{region.label}</button>)}</div>
            </div>
            {selectedRegion && (() => {
              const selected = resolvePlantRegion(selectedRegion, leafAge, answers.plant)
              return selected?.leafGroup ? <div className="leaf-age-question" role="group" aria-labelledby="leaf-age-title">
                <p className="selected-region" role="status">Zona seleccionada: <strong>{getPlantRegion(answers.plant, selectedRegion)?.label}</strong></p>
                <h4 id="leaf-age-title">La ilustración no permite saber la edad real de la hoja</h4>
                <p>Indícala según lo que observas; si no puedes determinarlo, elige esa opción.</p>
                <div className="leaf-age-options">
                  <button type="button" aria-pressed={leafAge === 'old'} className={leafAge === 'old' ? 'selected' : ''} onClick={() => confirmLeafAge('old')}>Hojas viejas</button>
                  <button type="button" aria-pressed={leafAge === 'young'} className={leafAge === 'young' ? 'selected' : ''} onClick={() => confirmLeafAge('young')}>Hojas jóvenes</button>
                  <button type="button" aria-pressed={leafAge === 'unknown'} className={leafAge === 'unknown' ? 'selected' : ''} onClick={() => confirmLeafAge('unknown')}>No estoy seguro</button>
                </div>
              </div> : <p className="selected-region" role="status">Zona seleccionada: <strong>{selected?.label}</strong></p>
            })()}
          </div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions actions-between"><button className="button button-secondary" type="button" onClick={() => { setSelectedRegion(''); setLeafAge(''); setAnswers((previous) => ({ ...previous, plant: '', location: '' })); setError('') }}>Cambiar planta</button><button className="button button-primary" type="button" onClick={continueToSymptoms}>Continuar a síntomas</button></div>
        </div>}

        {step === 2 && <form className="step-content" onSubmit={showResult}>
          <div className="section-heading">
            <div><p className="eyebrow">Paso 2 de 3</p><h2>Registra lo que observas</h2></div>
            <p className="section-note">Planta seleccionada: <strong>{diagnosticOptions.plants.find((plant) => plant.value === answers.plant)?.label}</strong></p>
          </div>
          <div className="form-grid">
            <div className="selected-location-field"><span>Zona seleccionada</span><strong>{diagnosticOptions.locations.find((location) => location.value === answers.location)?.label}</strong><button className="text-button" type="button" onClick={() => setStep(1)}>Cambiar zona</button></div>
            <SelectField id="symptom" label="¿Qué observas?" value={answers.symptom} onChange={(value) => update('symptom', value)} options={availableSymptoms} />
            <label className="field" htmlFor="ph">
              <span>pH medido <span className="optional">(opcional)</span></span>
              <input id="ph" type="number" min="0" max="14" step="0.1" inputMode="decimal" placeholder="Por ejemplo, 6.5" value={answers.ph} onChange={(event) => update('ph', event.target.value)} />
              <span className="field-hint">Usa un valor de 0 a 14. Si no lo conoces, déjalo vacío.</span>
            </label>
            <SelectField id="irrigation" label="¿Cómo es el riego?" value={answers.irrigation} onChange={(value) => update('irrigation', value)} options={diagnosticOptions.irrigation} />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions actions-between">
            <button className="button button-secondary" type="button" onClick={() => { setStep(1); setError('') }}>Regresar</button>
            <button className="button button-primary" type="submit">Ver orientación</button>
          </div>
        </form>}

        {step === 3 && result && <div className="step-content result-content">
          <div className="section-heading">
            <div><p className="eyebrow">Paso 3 de 3</p><h2>Orientación inicial</h2></div>
            <span className={`certainty certainty-${result.certainty}`}><span className="certainty-dot" />Compatibilidad {result.certainty}</span>
          </div>
          <div className="result-panel">
            <p className="result-kicker">Posible causa</p>
            <h3>{result.cause}</h3>
            <p>{result.explanation}</p>
            <div className="recommendation"><h4>Recomendación general</h4><p>{result.recommendation}</p></div>
          </div>
          {result.hypotheses.length > 0 && <section className="differential" aria-labelledby="differential-title">
            <div className="differential-heading"><h3 id="differential-title">Comparación de causas posibles</h3><p>Ordenadas por coincidencia con lo que registraste; no son probabilidades. Aun una compatibilidad media requiere confirmación.</p></div>
            <div className="hypothesis-list">{result.hypotheses.map((hypothesis, index) => <HypothesisCard hypothesis={hypothesis} index={index} key={hypothesis.id} />)}</div>
          </section>}
          <div className="result-notes">
            <h3>Contexto y datos por completar</h3>
            <ul>{result.reasons.map((reason, index) => <li key={`${index}-${reason}`}>{reason}</li>)}</ul>
            {result.missingData.length > 0 && <ul className="missing-list">{result.missingData.map((item) => <li key={item}>{item}</li>)}</ul>}
            {answers.ph === '' && <p className="ph-note"><strong>Sobre el pH:</strong> No se registró una medición. Cuando se considera baja disponibilidad de hierro, medirlo puede ayudar a interpretar la hipótesis.</p>}
            <p className="educational-note">Esta orientación es educativa y no confirma una deficiencia. Si el problema persiste, empeora o afecta varias plantas, consulta a un especialista o solicita un análisis del sustrato.</p>
          </div>
          <div className="actions actions-between result-actions">
            <button className="button button-secondary" type="button" onClick={() => { setStep(2); setError('') }}>Modificar respuestas</button>
            <button className="button button-primary" type="button" onClick={restart}>Empezar de nuevo</button>
          </div>
        </div>}
      </section>

      <ChemistryGuides selectedPlant={guidePlant} onSelectPlant={setGuidePlant} />

      <footer className="page-footer"><span>Observa primero. Ajusta el manejo con información suficiente.</span><span>Rosa · Tomate · Albahaca</span></footer>
    </main>
  )
}

export default App
