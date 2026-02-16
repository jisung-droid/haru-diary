export interface PlantStage {
  name: string;
  minStreak: number;
  image: string; // asset key
  description: string;
}

export const PLANT_STAGES: PlantStage[] = [
  { name: 'Seed', minStreak: 0, image: 'plant-seed', description: 'Plant your first seed!' },
  { name: 'Sprout', minStreak: 1, image: 'plant-sprout', description: 'A tiny sprout appears!' },
  { name: 'Small Plant', minStreak: 4, image: 'plant-small', description: 'Growing steadily!' },
  { name: 'Flowering', minStreak: 8, image: 'plant-flowering', description: 'Beautiful flowers bloom!' },
  { name: 'Full Tree', minStreak: 15, image: 'plant-tree', description: 'A magnificent tree!' },
];

export const WITHERED_STAGE = {
  name: 'Withered',
  image: 'plant-withered',
  description: 'Your plant needs attention! Write today.',
};

// Use emoji placeholders instead of images for now
export const PLANT_EMOJIS: Record<string, string> = {
  'plant-seed': '🌱',
  'plant-sprout': '🌿',
  'plant-small': '🪴',
  'plant-flowering': '🌺',
  'plant-tree': '🌳',
  'plant-withered': '🥀',
};
