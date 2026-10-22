import { chemistryPlants, chemicalElements, chemistrySources } from '../chemistryGuides.js'

export function PageHeading({ eyebrow, title, description, back }) {
  return <div className="learning-heading page-heading"><div>{back && <a className="breadcrumb-link" href={back.href}>{back.label}</a>}<p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{description && <p>{description}</p>}</div>
}

export function ClassroomHome() {
  return <section className="learning-section" aria-label="Aula de química vegetal">
    <PageHeading eyebrow="Recursos educativos" title="Aula de química vegetal" description="Explora cómo el sustrato, el pH y los nutrientes influyen en las condiciones de crecimiento. El contenido es orientativo y conserva sus referencias técnicas." />
    <div className="resource-grid">
      <a className="resource-link-card" href="#/aula/sustratos"><span className="resource-index">01</span><h2>Guías de sustrato</h2><p>Consulta mezclas educativas para maceta, materiales, funciones y pasos de preparación por especie.</p><span>Explorar guías →</span></a>
      <a className="resource-link-card" href="#/aula/nutrientes"><span className="resource-index">02</span><h2>Nutrientes</h2><p>Revisa los elementos minerales, sus formas iónicas y sus funciones descritas en las fuentes del proyecto.</p><span>Consultar nutrientes →</span></a>
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
    <details className="sources-details"><summary>Fuentes técnicas consultadas</summary><ul>{chemistrySources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
  </section>
}

export function NutrientIndex() {
  const groups = [{ title: 'Macronutrientes', elements: chemicalElements.filter((element) => element.symbol !== 'Fe') }, { title: 'Micronutrientes', elements: chemicalElements.filter((element) => element.symbol === 'Fe') }]
  return <section className="learning-section" aria-label="Consulta de nutrientes">
    <PageHeading eyebrow="Aula · Nutrientes" title="Elementos y sus funciones" description="Consulta por categoría y abre cada ficha para leer la función química descrita en el proyecto." back={{ href: '#/aula', label: '← Aula de química' }} />
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
    <article className="nutrient-detail-card"><div className="nutrient-detail-symbol">{element.symbol}<span>{element.ion}</span></div><div><h2>Función en la planta</h2><p>{element.function}</p><p>La absorción y disponibilidad de los elementos depende del medio de cultivo y de las condiciones de agua y pH. Esta ficha no permite inferir una deficiencia a partir de un síntoma aislado.</p>{nutrientSource && <p><strong>Referencia relacionada:</strong> <a href={nutrientSource.url} target="_blank" rel="noreferrer">{nutrientSource.label}</a></p>}</div></article>
    <details className="sources-details"><summary>Ver todas las fuentes técnicas</summary><ul>{chemistrySources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
  </section>
}

export function NotFoundPage() {
  return <section className="learning-section"><PageHeading eyebrow="Página no disponible" title="No encontramos este recurso" description="Regresa al Aula para elegir una guía o una ficha disponible." back={{ href: '#/aula', label: '← Aula de química' }} /></section>
}

