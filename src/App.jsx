import { useMemo, useState } from 'react'
import { diagnose, diagnosticOptions, getAvailableSymptoms } from './diagnosticRules.js'
import { chemistryPlants, chemicalElements, chemistrySources } from './chemistryGuides.js'

const initialAnswers = { plant: '', location: '', symptom: '', ph: '', irrigation: '' }

function StepIndicator({ current }) {
  const labels = ['Planta', 'Síntomas', 'Resultado']
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
  const [error, setError] = useState('')
  const availableSymptoms = useMemo(() => getAvailableSymptoms(answers.plant), [answers.plant])
  const result = useMemo(() => step === 3 ? diagnose(answers) : null, [step, answers])

  function update(field, value) {
    setAnswers((previous) => ({ ...previous, [field]: value }))
    setError('')
  }

  function choosePlant(value) {
    setGuidePlant(value)
    setAnswers((previous) => ({ ...previous, plant: value, symptom: previous.symptom === 'blossom_end_rot' && value !== 'tomato' ? '' : previous.symptom }))
    setError('')
  }

  function continueToSymptoms() {
    if (!answers.plant) return setError('Selecciona una planta para continuar.')
    setStep(2)
    setError('')
  }

  function showResult(event) {
    event.preventDefault()
    if (!answers.location || !answers.symptom || !answers.irrigation) {
      setError('Completa la ubicación, el síntoma y el tipo de riego. El pH es opcional.')
      return
    }
    setStep(3)
    setError('')
  }

  function restart() {
    setAnswers(initialAnswers)
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
            <div><p className="eyebrow">Paso 1 de 3</p><h2>¿Qué planta quieres revisar?</h2></div>
            <p className="section-note">Elige una especie para continuar.</p>
          </div>
          <div className="plant-grid">
            {diagnosticOptions.plants.map((plant) => <PlantCard key={plant.value} plant={plant} selected={answers.plant === plant.value} onSelect={choosePlant} />)}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions actions-right"><button className="button button-primary" type="button" onClick={continueToSymptoms}>Continuar</button></div>
        </div>}

        {step === 2 && <form className="step-content" onSubmit={showResult}>
          <div className="section-heading">
            <div><p className="eyebrow">Paso 2 de 3</p><h2>Registra lo que observas</h2></div>
            <p className="section-note">Planta seleccionada: <strong>{diagnosticOptions.plants.find((plant) => plant.value === answers.plant)?.label}</strong></p>
          </div>
          <div className="form-grid">
            <SelectField id="location" label="¿Dónde aparece el síntoma?" value={answers.location} onChange={(value) => update('location', value)} options={diagnosticOptions.locations} />
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
            <span className={`certainty certainty-${result.certainty}`}><span className="certainty-dot" />Certeza {result.certainty}</span>
          </div>
          <div className="result-panel">
            <p className="result-kicker">Posible causa</p>
            <h3>{result.cause}</h3>
            <p>{result.explanation}</p>
            <div className="recommendation"><h4>Recomendación general</h4><p>{result.recommendation}</p></div>
          </div>
          <div className="result-notes">
            <h3>Qué conviene revisar</h3>
            <ul>{result.reasons.map((reason, index) => <li key={`${index}-${reason}`}>{reason}</li>)}</ul>
            {answers.ph === '' && <p className="ph-note"><strong>Sobre el pH:</strong> No se registró una medición. Si el amarillamiento afecta hojas jóvenes y las nervaduras permanecen verdes, medirlo puede ayudar a valorar la disponibilidad de hierro.</p>}
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
