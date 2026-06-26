// Java Edition 1.21 enchantment data

export type Rarity = 'common' | 'uncommon' | 'rare' | 'very_rare';

export interface Enchantment {
  id: string;
  name: string;    // English
  nameEs: string;  // Spanish
  maxLevel: number;
  rarity: Rarity;
  incompatible: string[];
}

// Anvil cost multiplier per level when the SACRIFICE is a book.
// Item multipliers are 1/2/4/8; books are half (min 1): 1/1/2/4.
export const BOOK_MULT: Record<Rarity, number> = {
  common: 1,
  uncommon: 1,
  rare: 2,
  very_rare: 4,
};

export const ENCHANTMENTS: Enchantment[] = [
  // Protection group (armour)
  { id: 'protection',            name: 'Protection',            nameEs: 'Protección',                        maxLevel: 4, rarity: 'common',    incompatible: ['fire_protection', 'blast_protection', 'projectile_protection'] },
  { id: 'fire_protection',       name: 'Fire Protection',       nameEs: 'Protección contra el fuego',        maxLevel: 4, rarity: 'uncommon',  incompatible: ['protection', 'blast_protection', 'projectile_protection'] },
  { id: 'blast_protection',      name: 'Blast Protection',      nameEs: 'Protección contra explosiones',     maxLevel: 4, rarity: 'rare',      incompatible: ['protection', 'fire_protection', 'projectile_protection'] },
  { id: 'projectile_protection', name: 'Projectile Protection', nameEs: 'Protección contra proyectiles',     maxLevel: 4, rarity: 'uncommon',  incompatible: ['protection', 'fire_protection', 'blast_protection'] },
  { id: 'feather_falling',       name: 'Feather Falling',       nameEs: 'Caída de pluma',                    maxLevel: 4, rarity: 'uncommon',  incompatible: [] },
  { id: 'thorns',                name: 'Thorns',                nameEs: 'Espinas',                           maxLevel: 3, rarity: 'very_rare', incompatible: [] },
  { id: 'respiration',           name: 'Respiration',           nameEs: 'Respiración',                       maxLevel: 3, rarity: 'rare',      incompatible: [] },
  { id: 'aqua_affinity',         name: 'Aqua Affinity',         nameEs: 'Afinidad acuática',                 maxLevel: 1, rarity: 'rare',      incompatible: [] },
  { id: 'depth_strider',         name: 'Depth Strider',         nameEs: 'Agilidad acuática',                 maxLevel: 3, rarity: 'rare',      incompatible: ['frost_walker'] },
  { id: 'frost_walker',          name: 'Frost Walker',          nameEs: 'Paso helado',                       maxLevel: 2, rarity: 'rare',      incompatible: ['depth_strider'] },
  { id: 'soul_speed',            name: 'Soul Speed',            nameEs: 'Velocidad de almas',                maxLevel: 3, rarity: 'very_rare', incompatible: [] },
  { id: 'swift_sneak',           name: 'Swift Sneak',           nameEs: 'Sigilo veloz',                      maxLevel: 3, rarity: 'very_rare', incompatible: [] },
  // Sword
  { id: 'sharpness',             name: 'Sharpness',             nameEs: 'Filo',                              maxLevel: 5, rarity: 'common',    incompatible: ['smite', 'bane_of_arthropods'] },
  { id: 'smite',                 name: 'Smite',                 nameEs: 'Castigo',                           maxLevel: 5, rarity: 'uncommon',  incompatible: ['sharpness', 'bane_of_arthropods'] },
  { id: 'bane_of_arthropods',    name: 'Bane of Arthropods',    nameEs: 'Perdición de los artrópodos',       maxLevel: 5, rarity: 'uncommon',  incompatible: ['sharpness', 'smite'] },
  { id: 'knockback',             name: 'Knockback',             nameEs: 'Empuje',                            maxLevel: 2, rarity: 'uncommon',  incompatible: [] },
  { id: 'fire_aspect',           name: 'Fire Aspect',           nameEs: 'Aspecto ígneo',                     maxLevel: 2, rarity: 'rare',      incompatible: [] },
  { id: 'looting',               name: 'Looting',               nameEs: 'Botín',                             maxLevel: 3, rarity: 'rare',      incompatible: [] },
  { id: 'sweeping_edge',         name: 'Sweeping Edge',         nameEs: 'Filo de barrido',                   maxLevel: 3, rarity: 'rare',      incompatible: [] },
  // Tools
  { id: 'efficiency',            name: 'Efficiency',            nameEs: 'Eficiencia',                        maxLevel: 5, rarity: 'common',    incompatible: [] },
  { id: 'silk_touch',            name: 'Silk Touch',            nameEs: 'Toque de seda',                     maxLevel: 1, rarity: 'very_rare', incompatible: ['fortune'] },
  { id: 'fortune',               name: 'Fortune',               nameEs: 'Fortuna',                           maxLevel: 3, rarity: 'rare',      incompatible: ['silk_touch'] },
  // Bow
  { id: 'power',                 name: 'Power',                 nameEs: 'Poder',                             maxLevel: 5, rarity: 'common',    incompatible: [] },
  { id: 'punch',                 name: 'Punch',                 nameEs: 'Retroceso',                         maxLevel: 2, rarity: 'rare',      incompatible: [] },
  { id: 'flame',                 name: 'Flame',                 nameEs: 'Fuego',                             maxLevel: 1, rarity: 'rare',      incompatible: [] },
  { id: 'infinity',              name: 'Infinity',              nameEs: 'Infinidad',                         maxLevel: 1, rarity: 'very_rare', incompatible: ['mending'] },
  // Crossbow
  { id: 'multishot',             name: 'Multishot',             nameEs: 'Multidisparo',                      maxLevel: 1, rarity: 'rare',      incompatible: ['piercing'] },
  { id: 'piercing',              name: 'Piercing',              nameEs: 'Perforación',                       maxLevel: 4, rarity: 'common',    incompatible: ['multishot'] },
  { id: 'quick_charge',          name: 'Quick Charge',          nameEs: 'Carga rápida',                      maxLevel: 3, rarity: 'uncommon',  incompatible: [] },
  // Trident
  { id: 'loyalty',               name: 'Loyalty',               nameEs: 'Lealtad',                           maxLevel: 3, rarity: 'uncommon',  incompatible: ['riptide'] },
  { id: 'riptide',               name: 'Riptide',               nameEs: 'Propulsión acuática',               maxLevel: 3, rarity: 'rare',      incompatible: ['loyalty', 'channeling'] },
  { id: 'channeling',            name: 'Channeling',            nameEs: 'Canalización',                      maxLevel: 1, rarity: 'very_rare', incompatible: ['riptide'] },
  { id: 'impaling',              name: 'Impaling',              nameEs: 'Empalamiento',                      maxLevel: 5, rarity: 'rare',      incompatible: [] },
  // Fishing
  { id: 'luck_of_the_sea',       name: 'Luck of the Sea',       nameEs: 'Suerte marina',                     maxLevel: 3, rarity: 'rare',      incompatible: [] },
  { id: 'lure',                  name: 'Lure',                  nameEs: 'Atracción',                         maxLevel: 3, rarity: 'rare',      incompatible: [] },
  // Universal
  { id: 'unbreaking',            name: 'Unbreaking',            nameEs: 'Irrompibilidad',                    maxLevel: 3, rarity: 'uncommon',  incompatible: [] },
  { id: 'mending',               name: 'Mending',               nameEs: 'Reparación',                        maxLevel: 1, rarity: 'rare',      incompatible: ['infinity'] },
  { id: 'curse_of_binding',      name: 'Curse of Binding',      nameEs: 'Maldición de ligamiento',           maxLevel: 1, rarity: 'very_rare', incompatible: [] },
  { id: 'curse_of_vanishing',    name: 'Curse of Vanishing',    nameEs: 'Maldición de desaparición',         maxLevel: 1, rarity: 'very_rare', incompatible: [] },
];

export const ENCHANT_MAP = new Map(ENCHANTMENTS.map(e => [e.id, e]));

export type Lang = 'en' | 'es';
export function enchName(id: string, lang: Lang): string {
  const e = ENCHANT_MAP.get(id);
  if (!e) return id;
  return lang === 'es' ? e.nameEs : e.name;
}

export interface ItemType {
  id: string;
  name: string; // Spanish (fixed)
  emoji: string;
  enchants: string[];
}

export const ITEM_TYPES: ItemType[] = [
  { id: 'sword',       name: 'Espada',         emoji: '⚔️', enchants: ['sharpness', 'smite', 'bane_of_arthropods', 'knockback', 'fire_aspect', 'looting', 'sweeping_edge', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'pickaxe',     name: 'Pico',           emoji: '⛏️', enchants: ['efficiency', 'silk_touch', 'fortune', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'axe',         name: 'Hacha',          emoji: '🪓', enchants: ['efficiency', 'silk_touch', 'fortune', 'sharpness', 'smite', 'bane_of_arthropods', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'shovel',      name: 'Pala',           emoji: '🪏', enchants: ['efficiency', 'silk_touch', 'fortune', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'hoe',         name: 'Azada',          emoji: '🌾', enchants: ['efficiency', 'silk_touch', 'fortune', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'helmet',      name: 'Casco',          emoji: '🪖', enchants: ['protection', 'fire_protection', 'blast_protection', 'projectile_protection', 'thorns', 'respiration', 'aqua_affinity', 'unbreaking', 'mending', 'curse_of_binding', 'curse_of_vanishing'] },
  { id: 'chestplate',  name: 'Peto',           emoji: '🛡️', enchants: ['protection', 'fire_protection', 'blast_protection', 'projectile_protection', 'thorns', 'unbreaking', 'mending', 'curse_of_binding', 'curse_of_vanishing'] },
  { id: 'leggings',    name: 'Grebas',         emoji: '👖', enchants: ['protection', 'fire_protection', 'blast_protection', 'projectile_protection', 'thorns', 'swift_sneak', 'unbreaking', 'mending', 'curse_of_binding', 'curse_of_vanishing'] },
  { id: 'boots',       name: 'Botas',          emoji: '👟', enchants: ['protection', 'fire_protection', 'blast_protection', 'projectile_protection', 'thorns', 'feather_falling', 'depth_strider', 'frost_walker', 'soul_speed', 'unbreaking', 'mending', 'curse_of_binding', 'curse_of_vanishing'] },
  { id: 'bow',         name: 'Arco',           emoji: '🏹', enchants: ['power', 'punch', 'flame', 'infinity', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'crossbow',    name: 'Ballesta',       emoji: '🎯', enchants: ['multishot', 'piercing', 'quick_charge', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'trident',     name: 'Tridente',       emoji: '🔱', enchants: ['loyalty', 'riptide', 'channeling', 'impaling', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'fishing_rod', name: 'Caña de pescar', emoji: '🎣', enchants: ['luck_of_the_sea', 'lure', 'unbreaking', 'mending', 'curse_of_vanishing'] },
  { id: 'shears',      name: 'Tijeras',        emoji: '✂️', enchants: ['efficiency', 'unbreaking', 'mending', 'curse_of_vanishing'] },
];
