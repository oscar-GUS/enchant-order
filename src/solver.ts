import { BOOK_MULT, ENCHANT_MAP } from './data';

export interface ANode {
  label: string;
  enchants: { id: string; level: number }[];
  priorWork: number;
  isTargetItem: boolean;
}

export interface Step {
  left: ANode;
  right: ANode;
  result: ANode;
  levelCost: number;
  tooExpensive: boolean;
}

export interface SolveResult {
  steps: Step[];
  totalCost: number;
  tooExpensive: boolean;
}

function penalty(priorWork: number): number {
  return Math.pow(2, priorWork) - 1;
}

function combine(left: ANode, right: ANode): { result: ANode; cost: number } {
  const enchantCost = right.enchants.reduce((sum, e) => {
    const def = ENCHANT_MAP.get(e.id);
    const mult = def ? BOOK_MULT[def.rarity] : 1;
    return sum + e.level * mult;
  }, 0);

  const cost = penalty(left.priorWork) + penalty(right.priorWork) + enchantCost;

  const result: ANode = {
    label: left.label,
    enchants: [...left.enchants, ...right.enchants],
    priorWork: Math.max(left.priorWork, right.priorWork) + 1,
    isTargetItem: left.isTargetItem,
  };

  return { result, cost };
}

function stateKey(nodes: ANode[]): string {
  return nodes
    .map(n =>
      `${n.isTargetItem ? 'T' : 'B'}${n.priorWork}:${n.enchants
        .map(e => `${e.id}${e.level}`)
        .sort()
        .join(',')}`
    )
    .sort()
    .join('|');
}

const memo = new Map<string, { cost: number; steps: Step[] }>();

function search(nodes: ANode[]): { cost: number; steps: Step[] } {
  if (nodes.length === 1) return { cost: 0, steps: [] };

  const key = stateKey(nodes);
  const cached = memo.get(key);
  if (cached) return cached;

  let best: { cost: number; steps: Step[] } = { cost: Infinity, steps: [] };

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      // Target item can only be on left; never on right
      if (nodes[j].isTargetItem) continue;

      const { result, cost } = combine(nodes[i], nodes[j]);
      const remaining = nodes.filter((_, k) => k !== i && k !== j);
      remaining.push(result);

      const sub = search(remaining);
      const total = cost + sub.cost;

      if (total < best.cost) {
        const step: Step = {
          left: nodes[i],
          right: nodes[j],
          result,
          levelCost: cost,
          tooExpensive: cost > 39,
        };
        best = { cost: total, steps: [step, ...sub.steps] };
      }
    }
  }

  memo.set(key, best);
  return best;
}

export function solve(
  itemName: string,
  enchants: { id: string; level: number }[]
): SolveResult {
  memo.clear();

  // Target item (starts empty)
  const target: ANode = {
    label: itemName,
    enchants: [],
    priorWork: 0,
    isTargetItem: true,
  };

  // One book per enchantment
  const books: ANode[] = enchants.map(e => ({
    label: ENCHANT_MAP.get(e.id)?.name ?? e.id,
    enchants: [e],
    priorWork: 0,
    isTargetItem: false,
  }));

  const nodes = [target, ...books];
  const { cost, steps } = search(nodes);

  const tooExpensive = steps.some(s => s.tooExpensive);

  return { steps, totalCost: cost, tooExpensive };
}
