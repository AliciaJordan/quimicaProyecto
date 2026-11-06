export const plantProfiles = {
  rose: {
    id: 'rose', label: 'Rosa', scientificName: 'Rosa spp.', family: 'Rosaceae',
    description: 'Planta leñosa de floración; interpreta follaje, brotes, raíces y agua en conjunto.', physiology: 'Tallo leñoso, hojas compuestas, brotes y flores; el flujo de agua conecta raíces y follaje.', factors: 'pH, drenaje, edad de hojas, luz y estabilidad del riego.', chemistry: 'Movilidad de nutrientes y relación entre pH, raíces y disponibilidad iónica.',
    symptoms: ['general_yellowing', 'interveinal_yellowing', 'dry_edges', 'brown_spots', 'slow_growth', 'young_green_veins', 'damaged_new_shoots'],
    locations: ['old_leaves', 'young_leaves', 'leaves', 'shoots', 'stem', 'flower'],
    questions: [],
  },
  tomato: {
    id: 'tomato', label: 'Tomate', scientificName: 'Solanum lycopersicum', family: 'Solanaceae',
    description: 'Hortaliza de crecimiento rápido; fruto, raíces y estabilidad del agua aportan contexto.', physiology: 'Tallo herbáceo, hojas compuestas, flores y frutos; el transporte de agua es clave durante la fructificación.', factors: 'pH, drenaje, riego, raíces, luz y carga de frutos.', chemistry: 'Transporte de calcio, balance hídrico y disponibilidad de iones en el sustrato.',
    symptoms: ['general_yellowing', 'interveinal_yellowing', 'dry_edges', 'brown_spots', 'slow_growth', 'young_green_veins', 'damaged_new_shoots', 'blossom_end_rot'],
    locations: ['old_leaves', 'young_leaves', 'leaves', 'shoots', 'stem', 'flower', 'fruit', 'fruit_tip'],
    questions: [],
  },
  basil: {
    id: 'basil', label: 'Albahaca', scientificName: 'Ocimum basilicum', family: 'Lamiaceae',
    description: 'Planta de follaje; luz, humedad del sustrato y edad de las hojas cambian la lectura del síntoma.', physiology: 'Hojas aromáticas, tallos tiernos y raíces sensibles al encharcamiento prolongado.', factors: 'Luz, humedad, aireación, edad de hojas y sales del sustrato.', chemistry: 'Clorofila, movilidad de nitrógeno y magnesio, y efecto del pH en hierro.',
    symptoms: ['general_yellowing', 'interveinal_yellowing', 'dry_edges', 'brown_spots', 'slow_growth', 'young_green_veins', 'damaged_new_shoots'],
    locations: ['old_leaves', 'young_leaves', 'leaves', 'shoots', 'stem', 'flower'],
    questions: [],
  },
  cactus: {
    id: 'cactus', label: 'Cactus', scientificName: 'Echinopsis spp.', family: 'Cactaceae',
    description: 'Suculenta ornamental con tallos fotosintéticos, areolas y tejidos especializados en almacenar agua.', physiology: 'Tallos fotosintéticos con tejidos de reserva; hojas modificadas en espinas y areolas; raíces adaptadas a pulsos de humedad.', factors: 'Drenaje, tiempo de secado, luz, firmeza del tallo y sustrato mineral.', chemistry: 'Oxígeno en poros, transporte de agua y disponibilidad de nutrientes sin saturar las raíces.',
    symptoms: ['cactus_stem_yellowing', 'cactus_softness', 'cactus_wrinkling', 'cactus_dark_spots', 'cactus_stunted_growth', 'cactus_base_rot', 'cactus_shoot_changes', 'cactus_no_flowering'],
    locations: ['cactus_stem', 'cactus_shoots', 'cactus_base', 'cactus_roots', 'cactus_areoles', 'cactus_flower'],
    questions: [
      { id: 'cactus_substrate_moisture', label: '¿El sustrato permanece húmedo durante varios días?', options: [{ value: 'same_day', label: 'No, seca el mismo día' }, { value: 'few_days', label: 'Sí, varios días' }, { value: 'week_plus', label: 'Sí, más de una semana' }, { value: 'unknown', label: 'No estoy seguro' }] },
      { id: 'cactus_drainage', label: '¿La maceta tiene orificios de drenaje?', options: [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }, { value: 'unknown', label: 'No estoy seguro' }] },
      { id: 'cactus_light', label: '¿Qué iluminación recibe?', options: [{ value: 'direct', label: 'Luz directa' }, { value: 'indirect', label: 'Luz indirecta' }, { value: 'low', label: 'Poca luz' }] },
    ],
  },
  monstera: {
    id: 'monstera', label: 'Monstera', scientificName: 'Monstera deliciosa', family: 'Araceae',
    description: 'Trepadora tropical con hojas grandes, pecíolos y raíces aéreas; las fenestraciones aparecen con madurez y condiciones adecuadas.', physiology: 'Hojas grandes, pecíolos, tallo trepador y raíces aéreas; las fenestraciones dependen de la madurez y el entorno.', factors: 'Luz indirecta, humedad ambiental, frecuencia de riego, drenaje y madurez de hojas.', chemistry: 'pH, disponibilidad de hierro y magnesio, oxígeno radicular y transporte de agua.',
    symptoms: ['monstera_general_yellowing', 'monstera_interveinal_chlorosis', 'monstera_brown_edges', 'monstera_dry_tips', 'monstera_dark_spots', 'monstera_deformed_new_leaves', 'monstera_no_fenestrations', 'monstera_slow_growth', 'monstera_wilting', 'monstera_root_problems'],
    locations: ['monstera_lower_leaves', 'monstera_upper_leaves', 'monstera_young_leaves', 'monstera_edges', 'monstera_veins', 'monstera_stem', 'monstera_petiole', 'monstera_aerial_roots', 'monstera_roots'],
    questions: [
      { id: 'monstera_light', label: '¿Qué iluminación recibe?', options: [{ value: 'bright_indirect', label: 'Indirecta brillante' }, { value: 'medium', label: 'Luz media' }, { value: 'low', label: 'Poca luz' }] },
      { id: 'monstera_aerial_roots', label: '¿Tiene raíces aéreas visibles?', options: [{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }, { value: 'unknown', label: 'No estoy seguro' }] },
      { id: 'monstera_watering_frequency', label: '¿Con qué frecuencia riegas?', options: [{ value: 'every_few_days', label: 'Cada pocos días' }, { value: 'weekly', label: 'Aproximadamente semanal' }, { value: 'when_dry', label: 'Cuando el sustrato se seca' }, { value: 'unknown', label: 'Variable o no estoy seguro' }] },
      { id: 'monstera_leaf_maturity', label: '¿Las hojas afectadas son nuevas o maduras?', options: [{ value: 'young', label: 'Nuevas' }, { value: 'mature', label: 'Maduras' }, { value: 'unknown', label: 'No estoy seguro' }] },
    ],
  },
}

export const plantProfileList = Object.values(plantProfiles)

export function getPlantProfile(plant) {
  return plantProfiles[plant] || null
}
