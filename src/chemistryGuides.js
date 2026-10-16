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
  },
]

export const chemicalElements = [
  { symbol: 'N', ion: 'NO₃⁻ / NH₄⁺', name: 'Nitrógeno', function: 'La planta absorbe principalmente nitrato o amonio y los incorpora a aminoácidos, proteínas, enzimas y clorofila. Participa en la formación de hojas y tejidos nuevos.' },
  { symbol: 'P', ion: 'H₂PO₄⁻ / HPO₄²⁻', name: 'Fósforo', function: 'Como fosfato, participa en la transferencia de energía celular (ATP), material genético y membranas. La planta lo necesita para procesos de crecimiento y raíces.' },
  { symbol: 'K', ion: 'K⁺', name: 'Potasio', function: 'El ion potasio regula el balance de agua y la apertura de estomas, y activa enzimas. No forma una molécula estructural como el nitrógeno en las proteínas.' },
  { symbol: 'Ca', ion: 'Ca²⁺', name: 'Calcio', function: 'Contribuye a la estabilidad de paredes celulares y membranas y participa en señales celulares. Se desplaza con el agua; el estrés hídrico puede limitar su llegada a tejidos jóvenes o frutos.' },
  { symbol: 'Mg', ion: 'Mg²⁺', name: 'Magnesio', function: 'Es el átomo central de la molécula de clorofila y también activa enzimas del metabolismo. Por eso una carencia puede afectar el verdor y la fotosíntesis.' },
  { symbol: 'Fe', ion: 'Fe²⁺ / Fe³⁺', name: 'Hierro', function: 'Participa en proteínas y reacciones de transferencia de electrones necesarias para el metabolismo. No es el átomo central de la clorofila; su baja disponibilidad puede reducir su formación.' },
]

export const chemistrySources = [
  { label: 'Texas A&M AgriLife Extension — nutrientes esenciales y funciones', url: 'https://agrilifeextension.tamu.edu/library/gardening/essential-nutrients-for-plants/' },
  { label: 'UF/IFAS Extension — funciones y síntomas de nutrientes vegetales', url: 'https://ask.ifas.ufl.edu/publication/AG462' },
  { label: 'Penn State Extension — sustratos para hortalizas en contenedor', url: 'https://extension.psu.edu/container-vegetable-gardening-four-keys-to-success' },
  { label: 'UC IPM — prácticas culturales para rosas', url: 'https://ipm.ucanr.edu/home-and-landscape/roses-cultural-practices-and-weed-control/' },
  { label: 'University of Minnesota Extension — cultivo de albahaca', url: 'https://extension.umn.edu/garden-and-home/yard-and-garden/yard-and-garden-problems/growing-basil' },
  { label: 'University of Maryland Extension — pudrición apical en hortalizas', url: 'https://www.extension.umd.edu/resource/blossom-end-rot-vegetables' },
]
