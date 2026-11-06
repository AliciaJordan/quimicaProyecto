import { useState } from 'react'
import { chemistryPlants, chemicalElements, chemistrySources } from '../chemistryGuides.js'
import { plantProfileList } from '../plantProfiles.js'

export function PageHeading({ eyebrow, title, description, back }) {
  return <div className="learning-heading page-heading"><div>{back && <a className="breadcrumb-link" href={back.href}>{back.label}</a>}<p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{description && <p>{description}</p>}</div>
}

function EducationSelect({ label, value, onChange, options, id }) {
  return <label className="field education-select" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
}

export function ClassroomHome() {
  return <section className="learning-section" aria-label="Aula de química vegetal">
    <PageHeading eyebrow="Recursos educativos" title="Aula de química vegetal" description="Explora cómo el sustrato, el pH y los nutrientes influyen en las condiciones de crecimiento. El contenido es orientativo y conserva sus referencias técnicas." />
    <div className="resource-grid classroom-resource-grid">
      <a className="resource-link-card" href="#/aula/sustratos"><span className="resource-index">01</span><h2>Guías de sustrato</h2><p>Consulta mezclas educativas para maceta, materiales, funciones y pasos de preparación por especie.</p><span>Explorar guías →</span></a>
      <a className="resource-link-card" href="#/aula/nutrientes"><span className="resource-index">02</span><h2>Nutrientes</h2><p>Revisa los elementos minerales, sus formas iónicas y sus funciones descritas en las fuentes del proyecto.</p><span>Consultar nutrientes →</span></a>
      <a className="resource-link-card" href="#/aula/conceptos"><span className="resource-index">03</span><h2>Conceptos químicos</h2><p>Relaciona pH, solubilidad, movilidad, absorción y transporte con lo que observas en la planta.</p><span>Aprender conceptos →</span></a>
      <a className="resource-link-card" href="#/aula/especies"><span className="resource-index">04</span><h2>Química por especie</h2><p>Compara las cinco plantas y reconoce cuándo el agua, la luz, las raíces o el sustrato pesan más que la nutrición.</p><span>Explorar especies →</span></a>
      <a className="resource-link-card" href="#/aula/comparador"><span className="resource-index">05</span><h2>Comparador</h2><p>Compara dos nutrientes por función, movilidad, señales orientativas y disponibilidad.</p><span>Comparar nutrientes →</span></a>
      <a className="resource-link-card" href="#/aula/laboratorio"><span className="resource-index">06</span><h2>Laboratorio educativo</h2><p>Explora escenarios de movilidad, deficiencia y exceso sin convertirlos en diagnósticos automáticos.</p><span>Abrir laboratorio →</span></a>
      <a className="resource-link-card" href="#/aula/ph"><span className="resource-index">07</span><h2>Simulador de pH</h2><p>Mueve el pH y observa cómo cambia la disponibilidad orientativa de distintos elementos.</p><span>Simular pH →</span></a>
      <a className="resource-link-card" href="#/aula/glosario"><span className="resource-index">08</span><h2>Glosario químico</h2><p>Consulta términos básicos para leer las fichas y los resultados del diagnóstico.</p><span>Consultar glosario →</span></a>
    </div>
    <aside className="chemical-caution"><strong>Uso responsable</strong><p>Las guías no sustituyen un análisis de suelo o sustrato. No incluyen dosis de fertilizantes y no confirman deficiencias.</p></aside>
  </section>
}

export function SubstrateIndex() {
  return <section className="learning-section" aria-label="Guías de sustrato">
    <PageHeading eyebrow="Aula · Sustratos" title="Elige una especie" description="Abre una guía para consultar sus ingredientes y el procedimiento de preparación." back={{ href: '#/aula', label: '← Aula de química' }} />
    <div className="resource-grid species-resource-grid">{chemistryPlants.map((plant) => <a className="resource-link-card" href={`#/aula/sustratos/${plant.id}`} key={plant.id}><span className="resource-index">{plant.nameTag}</span><h2>{plant.name}</h2><p>{plant.focus}</p><span>Ver guía de sustrato →</span></a>)}</div>
  </section>
}

export function SubstrateDetail({ plantId }) {
  const plant = chemistryPlants.find((item) => item.id === plantId)
  if (!plant) return <NotFoundPage />
  return <section className="learning-section" aria-label={`Guía de sustrato para ${plant.name}`}>
    <PageHeading eyebrow={`Aula · Sustratos · ${plant.name}`} title={`Mezcla para ${plant.name.toLowerCase()} en maceta`} description={plant.focus} back={{ href: '#/aula/sustratos', label: '← Guías de sustrato' }} />
    <div className="guide-layout">
      <article className="guide-card">
        <header className="guide-title"><div><span>{plant.nameTag}</span><h2>Ingredientes por volumen</h2></div><span className="guide-label">Por volumen</span></header>
        <div className="recipe-list">{plant.mix.map((item) => <div className="recipe-row" key={item.ingredient}><strong className="recipe-amount">{item.amount}</strong><div><h3>{item.ingredient}</h3><p>{item.role}</p></div></div>)}</div>
        <div className="tutorial"><h3>Tutorial: prepara la mezcla</h3><ol>
          <li>Usa un recipiente limpio y mide cada parte con el mismo bote o cubeta; las proporciones son de volumen.</li>
          <li>Hidrata primero la fibra de coco según su empaque. Usa compost completamente maduro y corteza compostada para horticultura.</li>
          <li>Mezcla los componentes hasta que el color y la textura sean uniformes. Humedece poco a poco: debe sentirse húmeda al apretarla, sin gotear.</li>
          <li>Llena una maceta con orificios de drenaje y prueba el riego. El agua debe atravesar la mezcla y no quedar acumulada en un plato.</li>
          <li>Observa cómo seca durante los siguientes riegos. Si queda compacta o permanece saturada, revisa el drenaje y la estructura antes de plantar.</li>
        </ol></div>
      </article>
      <aside className="guide-aside" aria-label={`Notas para ${plant.name}`}>
        <div className="chemistry-callout"><strong>¿Por qué estos materiales?</strong><p>La fibra de coco almacena agua; la perlita o corteza compostada crea poros con aire; el compost aporta materia orgánica y nutrientes de composición variable. Juntos buscan un balance entre retención y drenaje para que las raíces respiren y absorban agua e iones minerales.</p></div>
        <div className="ph-callout"><strong>pH de referencia</strong><p>{plant.ph}</p></div><p className="guide-note">{plant.note}</p>
      </aside>
    </div>
    <section className="plant-nutrition-section" aria-labelledby="plant-nutrition-title">
      <div className="nutrient-heading"><div><p className="eyebrow">Lectura por especie</p><h2 id="plant-nutrition-title">Nutrición que conviene observar</h2></div><p>No son dosis ni recetas de fertilización. Son pistas para relacionar la función del elemento con el estado de esta planta.</p></div>
      <div className="plant-nutrition-grid">{plant.nutrition.map((item) => {
        const element = chemicalElements.find((candidate) => candidate.symbol === item.symbol)
        return <a className="plant-nutrition-card" href={`#/aula/nutrientes/${encodeURIComponent(item.symbol)}`} key={item.symbol}><span className="nutrition-symbol">{item.symbol}</span><div><div className="nutrition-card-heading"><h3>{item.label}</h3><span>{element?.group}</span></div><strong>{item.focus}</strong><p>{item.cue}</p><span className="nutrition-link">Abrir ficha →</span></div></a>
      })}</div>
    </section>
    <details className="sources-details"><summary>Fuentes técnicas consultadas</summary><ul>{chemistrySources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
  </section>
}

export function NutrientIndex() {
  const [filter, setFilter] = useState('all')
  const filteredElements = chemicalElements.filter((element) => filter === 'all' || element.group === filter)
  const groups = ['Macronutriente', 'Micronutriente'].map((group) => ({ title: `${group}s`, elements: filteredElements.filter((element) => element.group === group) })).filter((group) => group.elements.length > 0)
  return <section className="learning-section" aria-label="Consulta de nutrientes">
    <PageHeading eyebrow="Aula · Nutrientes" title="Elementos y sus funciones" description="Consulta por categoría y abre cada ficha para leer la función química descrita en el proyecto." back={{ href: '#/aula', label: '← Aula de química' }} />
    <div className="filter-tabs" role="group" aria-label="Filtrar nutrientes">{[['all', 'Todos'], ['Macronutriente', 'Macronutrientes'], ['Micronutriente', 'Micronutrientes']].map(([value, label]) => <button className={filter === value ? 'active' : ''} type="button" key={value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    {groups.map((group) => <section className="nutrient-category" key={group.title}><h2>{group.title}</h2><div className="element-grid">{group.elements.map((element) => <a className="element-card nutrient-card-link" href={`#/aula/nutrientes/${encodeURIComponent(element.symbol)}`} key={element.symbol}><div className="element-symbol">{element.symbol}<span>{element.ion}</span></div><div><h3>{element.name}</h3><p>{element.function}</p><span>Ver ficha →</span></div></a>)}</div></section>)}
    <aside className="chemical-caution"><strong>Antes de añadir nutrientes</strong><p>Un exceso o un pH fuera de rango puede interferir con otros nutrientes y dañar raíces. Mide antes de corregir y solicita un análisis si el problema persiste.</p></aside>
    <details className="sources-details"><summary>Fuentes técnicas consultadas</summary><ul>{chemistrySources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
  </section>
}

export function NutrientDetail({ symbol }) {
  const element = chemicalElements.find((item) => item.symbol.toLowerCase() === decodeURIComponent(symbol || '').toLowerCase())
  if (!element) return <NotFoundPage />
  const nutrientSource = chemistrySources.find((source) => /nutrientes esenciales|funciones y síntomas/i.test(source.label))
  return <section className="learning-section" aria-label={`Ficha de ${element.name}`}>
    <PageHeading eyebrow="Aula · Nutrientes · Ficha" title={element.name} description="Resumen químico educativo disponible en la biblioteca actual del proyecto." back={{ href: '#/aula/nutrientes', label: '← Nutrientes' }} />
    <article className="nutrient-detail-card"><div className="nutrient-detail-symbol">{element.symbol}<span>{element.ion}</span><small>{element.group}</small></div><div><h2>Función en la planta</h2><p>{element.function}</p><div className="nutrient-facts"><div><strong>Movilidad</strong><span>{element.mobility}</span></div><div><strong>Qué observar</strong><span>{element.signs}</span></div><div><strong>Disponibilidad</strong><span>{element.availability}</span></div></div><p>La absorción depende del medio de cultivo, las raíces, el agua y el pH. Esta ficha no permite inferir una deficiencia a partir de un síntoma aislado.</p>{nutrientSource && <p><strong>Referencia relacionada:</strong> <a href={nutrientSource.url} target="_blank" rel="noreferrer">{nutrientSource.label}</a></p>}</div></article>
    <details className="sources-details"><summary>Ver todas las fuentes técnicas</summary><ul>{chemistrySources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
  </section>
}

const chemistryConcepts = [
  ['pH', 'Medida de acidez o alcalinidad del medio; modifica la forma química y la disponibilidad de varios nutrientes.'],
  ['Solubilidad', 'Capacidad de una sustancia para permanecer disuelta en el agua; no todo lo presente en el sustrato está disponible para la raíz.'],
  ['Disponibilidad', 'Conjunto de condiciones que permiten que un elemento esté accesible para la planta, incluyendo pH, agua, oxígeno y raíces.'],
  ['Movilidad', 'Facilidad con la que un elemento se redistribuye dentro de la planta; ayuda a interpretar si el síntoma aparece primero en hojas viejas o jóvenes.'],
  ['Absorción', 'Entrada de agua e iones a través de la raíz; depende de la superficie radicular, concentración, oxígeno y condiciones del medio.'],
  ['Transporte', 'Movimiento de agua y solutos por los tejidos; un problema de raíces o riego puede limitarlo aunque exista un nutriente en el sustrato.'],
]

export function ConceptsPage() {
  return <section className="learning-section" aria-label="Conceptos químicos"><PageHeading eyebrow="Aula · Conceptos" title="Química que ayuda a interpretar" description="Estos conceptos explican por qué un síntoma no basta por sí solo para confirmar una deficiencia." back={{ href: '#/aula', label: '← Aula de química' }} /><div className="concept-grid">{chemistryConcepts.map(([title, text], index) => <article className="concept-card" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{text}</p></article>)}</div><aside className="chemical-caution"><strong>Lectura responsable</strong><p>El pH y la nutrición interactúan con agua, raíces, luz y temperatura. Una medición aislada no reemplaza la observación del sistema completo.</p></aside></section>
}

export function SpeciesChemistryIndex() {
  return <section className="learning-section" aria-label="Química por especie"><PageHeading eyebrow="Aula · Especies" title="Cinco plantas, cinco contextos" description="La misma señal puede tener causas distintas según la anatomía, el agua, la luz y la madurez de cada planta." back={{ href: '#/aula', label: '← Aula de química' }} /><div className="species-knowledge-grid">{plantProfileList.map((profile) => { const plant = chemistryPlants.find((item) => item.id === profile.id); return <article className="species-knowledge-card" key={profile.id}><div className="species-knowledge-heading"><span>{profile.family}</span><h2>{profile.label}</h2><p>{profile.scientificName}</p></div><p>{profile.description}</p><div className="knowledge-block"><strong>Fisiología</strong><p>{profile.physiology}</p></div><div className="knowledge-block"><strong>Factores de disponibilidad</strong><p>{profile.factors}</p></div><div className="knowledge-block"><strong>Química relacionada</strong><p>{profile.chemistry}</p></div><div className="species-nutrition-tags">{(plant?.nutrition || []).map((item) => <a href={`#/aula/nutrientes/${encodeURIComponent(item.symbol)}`} key={item.symbol}>{item.symbol} · {item.label}</a>)}</div><p className="species-knowledge-note">{profile.id === 'cactus' || profile.id === 'monstera' ? 'En esta especie, revisa primero agua, raíces, luz y sustrato antes de asumir una deficiencia nutricional.' : 'Relaciona la nutrición con edad de hojas, raíces, pH y condiciones de cultivo antes de corregir.'}</p></article> })}</div></section>
}

export function NutrientComparator() {
  const [firstSymbol, setFirstSymbol] = useState('N')
  const [secondSymbol, setSecondSymbol] = useState('Fe')
  const first = chemicalElements.find((item) => item.symbol === firstSymbol)
  const second = chemicalElements.find((item) => item.symbol === secondSymbol)
  return <section className="learning-section" aria-label="Comparador de nutrientes"><PageHeading eyebrow="Aula · Comparador" title="Compara dos nutrientes" description="Observa diferencias de movilidad, señales y disponibilidad. La comparación es educativa y no propone dosis." back={{ href: '#/aula', label: '← Aula de química' }} /><div className="comparator-controls"><EducationSelect id="compare-first" label="Primer nutriente" value={firstSymbol} onChange={setFirstSymbol} options={chemicalElements.map((item) => ({ value: item.symbol, label: `${item.symbol} · ${item.name}` }))} /><EducationSelect id="compare-second" label="Segundo nutriente" value={secondSymbol} onChange={setSecondSymbol} options={chemicalElements.map((item) => ({ value: item.symbol, label: `${item.symbol} · ${item.name}` }))} /></div><div className="comparison-grid">{[first, second].map((element) => <article className="comparison-card" key={element.symbol}><div className="comparison-symbol">{element.symbol}<span>{element.group}</span></div><h2>{element.name}</h2><p>{element.function}</p><dl><div><dt>Movilidad</dt><dd>{element.mobility}</dd></div><div><dt>Qué observar</dt><dd>{element.signs}</dd></div><div><dt>Disponibilidad</dt><dd>{element.availability}</dd></div></dl></article>)}</div></section>
}

function phReading(ph, element) {
  if (['Fe', 'Mn', 'Zn', 'Cu'].includes(element.symbol) && ph > 7) return 'La disponibilidad puede disminuir en medios alcalinos; confirma con medición y contexto.'
  if (element.symbol === 'P' && (ph < 5.5 || ph > 7.5)) return 'El fosfato puede quedar menos disponible en rangos extremos.'
  if (['Ca', 'Mg', 'K'].includes(element.symbol) && ph >= 5.5 && ph <= 7.5) return 'Este rango suele ser compatible con disponibilidad, pero el agua y las raíces siguen siendo determinantes.'
  return 'El pH no actúa solo: interpreta junto con sustrato, agua, raíces y análisis.'
}

export function PhSimulator() {
  const [ph, setPh] = useState(6.5)
  const highlighted = chemicalElements.filter((element) => ['Fe', 'P', 'Mg', 'K'].includes(element.symbol))
  return <section className="learning-section" aria-label="Simulador de pH"><PageHeading eyebrow="Aula · Simulador" title="Explora el efecto del pH" description="Mueve el valor para observar relaciones orientativas de disponibilidad. No es una recomendación de corrección." back={{ href: '#/aula', label: '← Aula de química' }} /><div className="ph-simulator"><div className="ph-slider-heading"><strong>pH simulado: {ph.toFixed(1)}</strong><span>{ph < 5.5 ? 'Ácido' : ph > 7.5 ? 'Alcalino' : 'Ligeramente ácido a neutro'}</span></div><input type="range" min="3" max="10" step="0.1" value={ph} onChange={(event) => setPh(Number(event.target.value))} aria-label="pH simulado" /><div className="ph-scale"><span>3 ácido</span><span>6–7 referencia frecuente</span><span>10 alcalino</span></div><div className="ph-reading-grid">{highlighted.map((element) => <article key={element.symbol}><strong>{element.symbol} · {element.name}</strong><p>{phReading(ph, element)}</p></article>)}</div></div><aside className="chemical-caution"><strong>Antes de corregir</strong><p>Mide el pH real del agua o sustrato y revisa drenaje y raíces. No añadas ácidos, bases o fertilizantes solo por mover este simulador.</p></aside></section>
}

export function MobilityLab() {
  const [symbol, setSymbol] = useState('Fe')
  const [mode, setMode] = useState('deficiency')
  const element = chemicalElements.find((item) => item.symbol === symbol)
  return <section className="learning-section" aria-label="Laboratorio educativo"><PageHeading eyebrow="Aula · Laboratorio" title="Movilidad, deficiencia y exceso" description="Cambia el nutriente y el escenario para practicar una lectura comparativa, sin convertirla en un diagnóstico." back={{ href: '#/aula', label: '← Aula de química' }} /><div className="lab-controls"><EducationSelect id="lab-element" label="Elemento" value={symbol} onChange={setSymbol} options={chemicalElements.map((item) => ({ value: item.symbol, label: `${item.symbol} · ${item.name}` }))} /><EducationSelect id="lab-mode" label="Escenario educativo" value={mode} onChange={setMode} options={[{ value: 'deficiency', label: 'Posible baja disponibilidad' }, { value: 'excess', label: 'Posible exceso o acumulación' }, { value: 'transport', label: 'Problema de transporte' }]} /></div><article className="lab-result"><div className="comparison-symbol">{element.symbol}<span>{element.mobility}</span></div><div><h2>{mode === 'deficiency' ? `Si hubiera baja disponibilidad de ${element.name.toLowerCase()}` : mode === 'excess' ? `Si hubiera exceso o acumulación de ${element.name.toLowerCase()}` : `Si el transporte de ${element.name.toLowerCase()} estuviera limitado`}</h2><p>{mode === 'deficiency' ? element.signs : mode === 'excess' ? `El exceso también puede interferir con otros elementos o dañar raíces. La señal “${element.signs.toLowerCase()}” no confirma por sí sola un exceso.` : `Aunque el elemento exista en el medio, raíces dañadas, falta de oxígeno o agua irregular pueden limitar su llegada a los tejidos.`}</p><p><strong>Disponibilidad:</strong> {element.availability}</p></div></article><p className="lab-note">Compara siempre edad de hojas, patrón espacial, raíces, pH, riego y evolución antes de interpretar una señal.</p></section>
}

export function GlossaryPage() {
  const terms = [...chemistryConcepts, ['Fenestración', 'Abertura natural en una hoja madura de algunas plantas, como Monstera; su ausencia en una hoja joven no demuestra una deficiencia.'], ['Areola', 'Estructura característica de cactus donde se originan espinas, pelos o flores.'], ['Clorosis', 'Pérdida de color verde en el tejido foliar; puede deberse a nutrición, raíces, pH, agua o luz.'], ['Sustrato', 'Medio que sostiene las raíces y regula agua, aire y disponibilidad de iones.']]
  return <section className="learning-section" aria-label="Glosario químico"><PageHeading eyebrow="Aula · Glosario" title="Glosario químico y botánico" description="Definiciones breves para interpretar las fichas y el diagnóstico." back={{ href: '#/aula', label: '← Aula de química' }} /><div className="glossary-list">{terms.map(([term, description]) => <article key={term}><h2>{term}</h2><p>{description}</p></article>)}</div></section>
}

export function NotFoundPage() {
  return <section className="learning-section"><PageHeading eyebrow="Página no disponible" title="No encontramos este recurso" description="Regresa al Aula para elegir una guía o una ficha disponible." back={{ href: '#/aula', label: '← Aula de química' }} /></section>
}

