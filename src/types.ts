export interface Species {
  id: string;
  name: string;
  scientificName: string;
  type: 'Grass' | 'Legume';
  description: string;
  benefits: string[];
  philippineContext?: string;
  image?: string;
}

export interface IdentificationResult {
  species: Species;
  confidence: number;
  detectedAt: string;
}

export const FORAGE_SPECIES: Species[] = [
  // Legumes
  {
    id: 'madre-de-agua',
    name: 'Madre de Agua',
    scientificName: 'Trichanthera gigantea',
    type: 'Legume',
    description: 'A multi-purpose fodder tree known for high protein content.',
    benefits: ['High protein (18-22%)', 'Drought tolerant', 'Easy to propagate'],
    philippineContext: 'Widely used in the Philippines for goats and swine.'
  },
  {
    id: 'ipil-ipil',
    name: 'Ipil-ipil',
    scientificName: 'Leucaena leucocephala',
    type: 'Legume',
    description: 'Fast-growing nitrogen-fixing tree used for forage.',
    benefits: ['Nitrogen fixation', 'Rich in vitamins', 'High biomass yield'],
    philippineContext: 'Commonly found in local pasture lands.'
  },
  {
    id: 'centro',
    name: 'Centro',
    scientificName: 'Centrosema pubescens',
    type: 'Legume',
    description: 'A vigorous perennial vine that forms a dense cover.',
    benefits: ['Soil conservation', 'Palatable to cattle', 'Persistent'],
    philippineContext: 'Adapts well to humid tropical conditions.'
  },
  {
    id: 'stylo',
    name: 'Stylo',
    scientificName: 'Stylosanthes guianensis',
    type: 'Legume',
    description: 'A robust, erect perennial legume.',
    benefits: ['Acid soil tolerance', 'High dry matter', 'Pest resistant'],
  },
  {
    id: 'calopo',
    name: 'Calopo',
    scientificName: 'Calopogonium mucunoides',
    type: 'Legume',
    description: 'A creeping, twinning perennial herb.',
    benefits: ['Fast ground cover', 'Suppresses weeds', 'Improves soil'],
  },
  {
    id: 'desmanthus',
    name: 'Desmanthus',
    scientificName: 'Desmanthus virgatus',
    type: 'Legume',
    description: 'A small shrubby legume suitable for heavy soils.',
    benefits: ['Heavy soil tolerance', 'Highly palatable', 'Productive'],
  },
  {
    id: 'pinto-peanut',
    name: 'Arachis pintoi',
    scientificName: 'Arachis pintoi',
    type: 'Legume',
    description: 'Also known as Peanut Grass, a low-growing perennial.',
    benefits: ['Persistent under grazing', 'Excellent nutrition', 'Good shade tolerance'],
    philippineContext: 'Popular for integrated livestock-orchard systems.'
  },
  // Grasses
  {
    id: 'napier',
    name: 'Napier Grass',
    scientificName: 'Pennisetum purpureum',
    type: 'Grass',
    description: 'A high-yielding perennial grass for cut-and-carry systems.',
    benefits: ['Rapid growth', 'High biomass', 'Carbon sequestration'],
    philippineContext: 'Most popular "cut and carry" forage in the PH.'
  },
  {
    id: 'guinea-grass',
    name: 'Guinea Grass',
    scientificName: 'Panicum maximum',
    type: 'Grass',
    description: 'A tall, bunch-forming perennial grass.',
    benefits: ['Shade tolerance', 'Highly palatable', 'Resilient'],
  },
  {
    id: 'signal-grass',
    name: 'Signal Grass',
    scientificName: 'Brachiaria decumbens',
    type: 'Grass',
    description: 'A prostrate to semi-erect perennial grass.',
    benefits: ['Heavy grazing resistance', 'Strong spreading habit', 'Weed control'],
  },
  {
    id: 'mulato',
    name: 'Mulato II',
    scientificName: 'Brachiaria hybrid',
    type: 'Grass',
    description: 'A high-performance hybrid grass for intensive production.',
    benefits: ['High nutritional value', 'Drought resistance', 'Rapid recovery'],
  },
  {
    id: 'para-grass',
    name: 'Para Grass',
    scientificName: 'Brachiaria mutica',
    type: 'Grass',
    description: 'A stoloniferous perennial grass that likes wet areas.',
    benefits: ['Flooding tolerance', 'Good for wetlands', 'Very palatable'],
  },
  {
    id: 'star-grass',
    name: 'Star Grass',
    scientificName: 'Cynodon nlemfuensis',
    type: 'Grass',
    description: 'A spreading, highly productive perennial grass.',
    benefits: ['Rapid establishment', 'Durable', 'High protein potential'],
  },
  {
    id: 'rhodes-grass',
    name: 'Rhodes Grass',
    scientificName: 'Chloris gayana',
    type: 'Grass',
    description: 'A versatile grass adaptable to various soil types.',
    benefits: ['Salt tolerance', 'Erosion control', 'Nutritious'],
  }
];
