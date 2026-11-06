export const chemistryPlants = [
  {
    id: 'rose', name: 'Rosa', nameTag: 'Floración y estructura',
    focus: 'Una rosa en maceta necesita raíces con aire y humedad estable; un medio rico en materia orgánica aporta retención de agua y nutrientes sin compactarse.',
    ph: 'Como referencia general para rosas, el suelo suele manejarse cerca de pH 6–7. Mide antes de intentar corregirlo.',
    mix: [
      { amount: '2 partes', ingredient: 'fibra de coco hidratada', role: 'Retiene agua y deja poros para el aire; aporta pocos nutrientes por sí sola.' },
      { amount: '1 parte', ingredient: 'compost maduro y cernido', role: 'Aporta materia orgánica y nutrientes de liberación variable; su composición depende de los materiales de origen.' },
      { amount: '1 parte', ingredient: 'corteza compostada para horticultura', role: 'Conserva estructura y espacios de aire alrededor de las raíces.' },
    ],
    note: 'Para rosas plantadas directamente en jardín, no reemplaces el suelo con esta receta de maceta. Revisa drenaje y análisis del suelo; una capa de compost puede ser suficiente según el sitio.',
    nutrition: [
      { symbol: 'N', label: 'Nitrógeno', focus: 'Follaje verde y brotes', cue: 'Prioriza un crecimiento equilibrado; demasiado nitrógeno puede favorecer hojas tiernas y menos floración.' },
      { symbol: 'P', label: 'Fósforo', focus: 'Raíces y floración', cue: 'La floración no se corrige automáticamente con fósforo: verifica raíces, luz y pH antes de añadirlo.' },
      { symbol: 'K', label: 'Potasio', focus: 'Agua y resistencia', cue: 'Apoya la regulación hídrica; revisa bordes secos junto con riego y sales acumuladas.' },
      { symbol: 'Fe', label: 'Hierro', focus: 'Hojas jóvenes', cue: 'El amarillamiento entre nervaduras en brotes nuevos pide revisar pH y disponibilidad, no solo aplicar hierro.' },
    ],
  },
  {
    id: 'tomato', name: 'Tomate', nameTag: 'Crecimiento y fruto',
    focus: 'El tomate en contenedor requiere un sustrato estable, aireado y capaz de mantener agua disponible durante el crecimiento y la formación del fruto.',
    ph: 'Como referencia, muchos manejos de tomate sitúan el pH alrededor de 6–6.8. El valor adecuado depende del suelo, agua y sistema de cultivo.',
    mix: [
      { amount: '2 partes', ingredient: 'fibra de coco hidratada', role: 'Da volumen ligero y almacena parte del agua entre riegos.' },
      { amount: '1 parte', ingredient: 'compost maduro y cernido', role: 'Incorpora materia orgánica y nutrientes; no equivale a una fórmula completa ni constante.' },
      { amount: '1 parte', ingredient: 'perlita hortícola', role: 'Mineral poroso que crea espacios de aire y facilita el drenaje del exceso de agua.' },
    ],
    note: 'No agregues calcio automáticamente por una mancha apical: la pudrición puede aparecer aunque haya calcio en el suelo, cuando el agua no lo transporta de forma estable al fruto. Primero revisa humedad, raíces y análisis.',
    nutrition: [
      { symbol: 'N', label: 'Nitrógeno', focus: 'Crecimiento vegetativo', cue: 'Un exceso puede producir mucho follaje y retrasar el balance con flores y frutos.' },
      { symbol: 'K', label: 'Potasio', focus: 'Fruto y agua', cue: 'Interviene en balance hídrico; interpreta bordes secos junto con conductividad, riego y raíces.' },
      { symbol: 'Ca', label: 'Calcio', focus: 'Tejidos jóvenes y fruto', cue: 'La mancha apical suele relacionarse con transporte irregular de agua; estabiliza el riego antes de suplementar.' },
      { symbol: 'B', label: 'Boro', focus: 'Flores y crecimiento', cue: 'Requiere cantidades pequeñas; no lo apliques sin análisis porque el margen entre aporte y exceso es estrecho.' },
    ],
  },
  {
    id: 'basil', name: 'Albahaca', nameTag: 'Follaje y raíces',
    focus: 'La albahaca responde bien a un medio que conserve algo de humedad, pero drene y mantenga oxígeno para las raíces; el encharcamiento prolongado las estresa.',
    ph: 'La referencia de Minnesota Extension para albahaca es pH 6–7.5. Es una guía, no una medición de tu mezcla.',
    mix: [
      { amount: '2 partes', ingredient: 'fibra de coco hidratada', role: 'Retiene agua y ayuda a que el sustrato no se seque de inmediato.' },
      { amount: '1 parte', ingredient: 'perlita hortícola', role: 'Aumenta la porosidad; mejora el paso de aire y salida del agua sobrante.' },
      { amount: '1 parte', ingredient: 'compost maduro y cernido', role: 'Añade materia orgánica y un aporte variable de nutrientes.' },
      { amount: '1 parte', ingredient: 'corteza compostada fina', role: 'Contribuye a conservar estructura y poros en la mezcla.' },
    ],
    note: 'Evita usar tierra de jardín pesada en macetas: puede compactarse y perder aireación. En una cama de jardín, adapta el suelo existente en lugar de aplicar esta receta de contenedor.',
    nutrition: [
      { symbol: 'N', label: 'Nitrógeno', focus: 'Hojas y aroma', cue: 'La falta puede limitar el crecimiento, pero el exceso genera tejido muy tierno y más sensible al estrés.' },
      { symbol: 'Mg', label: 'Magnesio', focus: 'Verdor de las hojas', cue: 'El amarillamiento entre nervaduras en hojas viejas es una pista; confirma el patrón y el pH antes de corregir.' },
      { symbol: 'Fe', label: 'Hierro', focus: 'Hojas nuevas', cue: 'Las hojas jóvenes pálidas con nervaduras verdes orientan a disponibilidad de hierro, especialmente con pH alto.' },
      { symbol: 'K', label: 'Potasio', focus: 'Equilibrio hídrico', cue: 'Bordes secos también pueden venir de riego irregular, aire seco o acumulación de sales.' },
    ],
  },
  {
    id: 'cactus', name: 'Cactus', nameTag: 'Reserva y drenaje',
    focus: 'Referencia: Echinopsis spp. Sus tallos almacenan agua y requieren un medio aireado que seque de forma predecible.',
    ph: 'Como referencia educativa, muchas mezclas para suculentas se manejan cerca de pH ligeramente ácido a neutro; mide el medio antes de corregirlo.',
    mix: [
      { amount: '2 partes', ingredient: 'material mineral poroso', role: 'Aporta estructura y espacios de aire; reduce la permanencia de agua alrededor de las raíces.' },
      { amount: '1 parte', ingredient: 'fibra de coco o sustrato orgánico ligero', role: 'Retiene una fracción de humedad sin convertir la mezcla en un medio pesado.' },
      { amount: '1 parte', ingredient: 'compost muy maduro y cernido', role: 'Aporta materia orgánica variable; debe usarse con moderación y nunca sustituye el drenaje.' },
    ],
    note: 'La mezcla es educativa y no una receta universal. En cactus, una base blanda o un tallo oscuro pide revisar agua, raíces y drenaje antes de pensar en fertilización.',
    nutrition: [
      { symbol: 'K', label: 'Potasio', focus: 'Balance hídrico', cue: 'Participa en regulación osmótica, pero los síntomas de agua y sales pueden parecer nutricionales.' },
      { symbol: 'N', label: 'Nitrógeno', focus: 'Crecimiento del tallo', cue: 'El crecimiento detenido no demuestra falta de nitrógeno; considera luz, raíces y temporada.' },
      { symbol: 'Ca', label: 'Calcio', focus: 'Estructura celular', cue: 'No añadas calcio sin conocer pH y análisis; la firmeza también depende de agua y raíces.' },
      { symbol: 'Fe', label: 'Hierro', focus: 'Verdor del tallo', cue: 'El amarillamiento requiere diferenciar baja disponibilidad de hierro de exceso de humedad o luz inadecuada.' },
    ],
  },
  {
    id: 'monstera', name: 'Monstera', nameTag: 'Follaje y raíces aéreas',
    focus: 'Referencia: Monstera deliciosa. Sus hojas grandes y raíces aéreas necesitan luz indirecta, soporte, humedad equilibrada y aireación.',
    ph: 'Como referencia general para plantas de follaje en contenedor, mide el pH del sustrato y agua antes de intentar modificarlo.',
    mix: [
      { amount: '2 partes', ingredient: 'corteza compostada', role: 'Aporta estructura y espacios de aire para raíces del sustrato y raíces aéreas.' },
      { amount: '1 parte', ingredient: 'fibra de coco hidratada', role: 'Retiene humedad sin ser una medida de frecuencia de riego por sí sola.' },
      { amount: '1 parte', ingredient: 'perlita hortícola', role: 'Favorece drenaje y oxigenación cuando la maceta tiene salida de agua.' },
    ],
    note: 'La ausencia de fenestraciones en una hoja joven puede ser parte del desarrollo normal. Antes de fertilizar, revisa luz, raíces, drenaje, humedad ambiental y madurez de la hoja.',
    nutrition: [
      { symbol: 'N', label: 'Nitrógeno', focus: 'Hojas y crecimiento', cue: 'El crecimiento lento puede tener causas ambientales; no atribuyas el síntoma al nitrógeno sin revisar luz y raíces.' },
      { symbol: 'Mg', label: 'Magnesio', focus: 'Clorosis intervenal', cue: 'La edad de la hoja y el patrón entre nervaduras ayudan a valorar magnesio, pero no sustituyen un análisis.' },
      { symbol: 'Fe', label: 'Hierro', focus: 'Hojas jóvenes', cue: 'El pH alto puede reducir disponibilidad de hierro; confirma raíces y pH antes de corregir.' },
      { symbol: 'K', label: 'Potasio', focus: 'Bordes y agua', cue: 'Bordes cafés pueden relacionarse con agua, ambiente o sales además de potasio.' },
    ],
  },
]

export const chemicalElements = [
  { symbol: 'N', group: 'Macronutriente', ion: 'NO₃⁻ / NH₄⁺', name: 'Nitrógeno', function: 'La planta absorbe principalmente nitrato o amonio y los incorpora a aminoácidos, proteínas, enzimas y clorofila.', mobility: 'Móvil', signs: 'Hojas viejas amarillas y crecimiento reducido.', availability: 'Depende de materia orgánica, pH, humedad y actividad microbiana.' },
  { symbol: 'P', group: 'Macronutriente', ion: 'H₂PO₄⁻ / HPO₄²⁻', name: 'Fósforo', function: 'Como fosfato, participa en ATP, material genético y membranas; apoya raíces y transferencia de energía.', mobility: 'Móvil', signs: 'Crecimiento lento o tonos oscuros; son señales inespecíficas.', availability: 'Puede quedar fijado en medios con pH extremo.' },
  { symbol: 'K', group: 'Macronutriente', ion: 'K⁺', name: 'Potasio', function: 'Regula balance de agua, apertura de estomas y activación de enzimas.', mobility: 'Móvil', signs: 'Bordes secos o clorosis marginal, también causados por estrés hídrico o sales.', availability: 'La humedad y la competencia con otros cationes influyen en su absorción.' },
  { symbol: 'Ca', group: 'Macronutriente', ion: 'Ca²⁺', name: 'Calcio', function: 'Estabiliza paredes celulares y membranas y participa en señales celulares.', mobility: 'Poco móvil', signs: 'Daño en tejidos jóvenes o frutos; el transporte depende del flujo de agua.', availability: 'El pH, las raíces y la continuidad del riego son determinantes.' },
  { symbol: 'Mg', group: 'Macronutriente', ion: 'Mg²⁺', name: 'Magnesio', function: 'Es el átomo central de la clorofila y activa enzimas del metabolismo.', mobility: 'Móvil', signs: 'Clorosis entre nervaduras, a menudo primero en hojas viejas.', availability: 'Puede competir con calcio y potasio; interpreta con el pH del sustrato.' },
  { symbol: 'S', group: 'Macronutriente', ion: 'SO₄²⁻', name: 'Azufre', function: 'Forma parte de aminoácidos y proteínas y participa en reacciones de óxido-reducción.', mobility: 'Poco móvil', signs: 'Amarillamiento más uniforme en hojas jóvenes; se confunde con nitrógeno.', availability: 'La materia orgánica y el sulfato del agua pueden aportar parte del requerimiento.' },
  { symbol: 'Fe', group: 'Micronutriente', ion: 'Fe²⁺ / Fe³⁺', name: 'Hierro', function: 'Participa en proteínas y transferencia de electrones; es necesario para formar clorofila, pero no es su átomo central.', mobility: 'Poco móvil', signs: 'Hojas jóvenes amarillas con nervaduras verdes.', availability: 'Suele disminuir con pH alto, aunque el análisis del medio es la mejor guía.' },
  { symbol: 'B', group: 'Micronutriente', ion: 'H₃BO₃ / BO₃³⁻', name: 'Boro', function: 'Contribuye a paredes celulares, crecimiento de meristemos y desarrollo reproductivo.', mobility: 'Poco móvil', signs: 'Brotes deformados o problemas de flores; síntomas poco específicos.', availability: 'Se requiere en cantidades pequeñas y el exceso puede ser tóxico.' },
  { symbol: 'Mn', group: 'Micronutriente', ion: 'Mn²⁺', name: 'Manganeso', function: 'Participa en fotosíntesis y activa enzimas del metabolismo.', mobility: 'Poco móvil', signs: 'Clorosis moteada entre nervaduras en hojas jóvenes o medias.', availability: 'La disponibilidad suele reducirse en medios alcalinos.' },
  { symbol: 'Zn', group: 'Micronutriente', ion: 'Zn²⁺', name: 'Zinc', function: 'Activa enzimas y participa en la regulación del crecimiento y la síntesis de proteínas.', mobility: 'Poco móvil', signs: 'Hojas pequeñas, entrenudos cortos o crecimiento irregular.', availability: 'El pH alto y un exceso de fósforo pueden reducir su disponibilidad.' },
  { symbol: 'Cu', group: 'Micronutriente', ion: 'Cu²⁺', name: 'Cobre', function: 'Interviene en enzimas, fotosíntesis y formación de estructuras reproductivas.', mobility: 'Poco móvil', signs: 'Marchitez de puntas o brotes débiles; no es un diagnóstico aislado.', availability: 'La materia orgánica puede retenerlo; el exceso es dañino para raíces.' },
  { symbol: 'Mo', group: 'Micronutriente', ion: 'MoO₄²⁻', name: 'Molibdeno', function: 'Ayuda a transformar nitrato y participa en el metabolismo del nitrógeno.', mobility: 'Móvil', signs: 'Amarillamiento y deformación de hojas; poco frecuente en medios bien manejados.', availability: 'Su disponibilidad suele aumentar con pH ligeramente más alto.' },
  { symbol: 'Cl', group: 'Micronutriente', ion: 'Cl⁻', name: 'Cloro', function: 'Participa en equilibrio osmótico, carga eléctrica y reacciones de fotosíntesis.', mobility: 'Móvil', signs: 'Deficiencia rara; exceso de sales puede ser más relevante.', availability: 'Normalmente llega con el agua o sales del sustrato.' },
  { symbol: 'Ni', group: 'Micronutriente', ion: 'Ni²⁺', name: 'Níquel', function: 'Es necesario para la enzima ureasa y el aprovechamiento de nitrógeno.', mobility: 'Móvil', signs: 'Deficiencia muy rara; puede alterar hojas y acumulación de urea.', availability: 'Se necesita en trazas; no se recomienda añadirlo sin análisis.' },
]

export const chemistrySources = [
  { label: 'Texas A&M AgriLife Extension — nutrientes esenciales y funciones', url: 'https://agrilifeextension.tamu.edu/library/gardening/essential-nutrients-for-plants/' },
  { label: 'UF/IFAS Extension — funciones y síntomas de nutrientes vegetales', url: 'https://ask.ifas.ufl.edu/publication/AG462' },
  { label: 'Penn State Extension — sustratos para hortalizas en contenedor', url: 'https://extension.psu.edu/container-vegetable-gardening-four-keys-to-success' },
  { label: 'UC IPM — prácticas culturales para rosas', url: 'https://ipm.ucanr.edu/home-and-landscape/roses-cultural-practices-and-weed-control/' },
  { label: 'University of Minnesota Extension — cultivo de albahaca', url: 'https://extension.umn.edu/garden-and-home/yard-and-garden/yard-and-garden-problems/growing-basil' },
  { label: 'University of Maryland Extension — pudrición apical en hortalizas', url: 'https://www.extension.umd.edu/resource/blossom-end-rot-vegetables' },
  { label: 'Royal Horticultural Society — cultivo de cactus y suculentas', url: 'https://www.rhs.org.uk/plants/types/cacti-succulents/houseplants/growing-guide' },
  { label: 'Royal Horticultural Society — Monstera y fenestraciones', url: 'https://www.rhs.org.uk/plants/swiss-cheese-plants' },
  { label: 'University of Minnesota Extension — propagación de Monstera deliciosa', url: 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/propagating-monstera-deliciosa' },
]
