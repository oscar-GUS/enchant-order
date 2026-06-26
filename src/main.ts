import './style.css';
import { ITEM_TYPES, ENCHANT_MAP, enchName, itemIconHtml, type ItemType, type Lang } from './data';
import { solve, type SolveResult } from './solver';

// ── State ──────────────────────────────────────────────────────────────────
let selectedItem: ItemType = ITEM_TYPES[0];
let lang: Lang = 'en';
const selectedEnchants = new Map<string, number>(); // id → level

// ── Enchanted book icon ─────────────────────────────────────────────────────
const BOOK_SVG = `
<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9b6bff"/>
      <stop offset="1" stop-color="#6d28d9"/>
    </linearGradient>
  </defs>
  <ellipse cx="20" cy="21" rx="15" ry="15" fill="#7c3aed" opacity="0.16"/>
  <rect x="11" y="8" width="20" height="25" rx="2" fill="#efe6cf"/>
  <line x1="27" y1="12" x2="27" y2="29" stroke="#cdbf9e" stroke-width="1"/>
  <path d="M11 8h17a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V8Z" fill="url(#bk)"/>
  <rect x="11" y="8" width="4.5" height="26" rx="1.5" fill="#5b21b6"/>
  <rect x="19" y="16" width="7" height="10" rx="1.5" fill="none" stroke="#F2AF0D" stroke-width="1.3" opacity="0.9"/>
  <path d="M24 8v9l-2-1.6L20 17V8Z" fill="#F4811F"/>
  <path d="M32 11c.4 1.4.8 1.8 2.2 2.2-1.4.4-1.8.8-2.2 2.2-.4-1.4-.8-1.8-2.2-2.2 1.4-.4 1.8-.8 2.2-2.2Z" fill="#F2AF0D"/>
  <path d="M9 24c.3 1 .6 1.3 1.6 1.6-1 .3-1.3.6-1.6 1.6-.3-1-.6-1.3-1.6-1.6 1-.3 1.3-.6 1.6-1.6Z" fill="#fff" opacity="0.85"/>
</svg>`;

// ── DOM refs ───────────────────────────────────────────────────────────────
const itemGrid = document.getElementById('item-grid')!;
const enchantList = document.getElementById('enchant-list')!;
const clearBtn = document.getElementById('clear-btn')!;
const langToggle = document.getElementById('lang-toggle')!;
const stage = document.getElementById('stage')!;

const BOOK_LABEL = () => (lang === 'es' ? 'Libro' : 'Book');

// ── Item grid ──────────────────────────────────────────────────────────────
function renderItemGrid() {
  itemGrid.innerHTML = '';
  for (const item of ITEM_TYPES) {
    const btn = document.createElement('button');
    btn.className = 'item-btn' + (item.id === selectedItem.id ? ' active' : '');
    btn.innerHTML = `${itemIconHtml(item)}<span>${item.name}</span>`;
    btn.addEventListener('click', () => {
      selectedItem = item;
      selectedEnchants.clear();
      renderItemGrid();
      renderEnchants();
      update();
    });
    itemGrid.appendChild(btn);
  }
}

// ── Enchant list ───────────────────────────────────────────────────────────
function renderEnchants() {
  enchantList.innerHTML = '';
  const selected = new Set(selectedEnchants.keys());

  const blocked = new Set<string>();
  for (const selId of selected) {
    ENCHANT_MAP.get(selId)?.incompatible.forEach(id => blocked.add(id));
  }

  for (const id of selectedItem.enchants) {
    const ench = ENCHANT_MAP.get(id);
    if (!ench) continue;

    const isSelected = selected.has(id);
    const isBlocked = blocked.has(id) && !isSelected;

    const row = document.createElement('div');
    row.className = 'enchant-row' + (isSelected ? ' selected' : '') + (isBlocked ? ' disabled' : '');

    const levelOptions = Array.from({ length: ench.maxLevel }, (_, i) => i + 1)
      .map(l => `<option value="${l}" ${(selectedEnchants.get(id) ?? ench.maxLevel) === l ? 'selected' : ''}>${toRoman(l)}</option>`)
      .join('');

    row.innerHTML = `
      <span class="enchant-name">${enchName(id, lang)}</span>
      ${ench.maxLevel > 1 ? `<select class="level-select" data-id="${id}">${levelOptions}</select>` : ''}
    `;

    const select = row.querySelector('select');

    row.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'SELECT') return;
      if (selectedEnchants.has(id)) {
        selectedEnchants.delete(id);
      } else {
        selectedEnchants.set(id, select ? parseInt(select.value) : 1);
      }
      renderEnchants();
      update();
    });

    select?.addEventListener('change', () => {
      if (selectedEnchants.has(id)) {
        selectedEnchants.set(id, parseInt(select.value));
        update();
      }
    });

    enchantList.appendChild(row);
  }
}

clearBtn.addEventListener('click', () => {
  selectedEnchants.clear();
  renderEnchants();
  update();
});

// ── Language toggle ──────────────────────────────────────────────────────────
langToggle.querySelectorAll<HTMLButtonElement>('button').forEach(btn => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang as Lang;
    langToggle.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
    renderEnchants();
    update();
  });
});

// ── Live update (debounced to next frame) ───────────────────────────────────
let rafId = 0;
function update() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (selectedEnchants.size === 0) { renderEmpty(); return; }
    const enchants = Array.from(selectedEnchants.entries()).map(([id, level]) => ({ id, level }));
    const result = solve(selectedItem.name, enchants);
    render(result);
  });
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderEmpty() {
  stage.innerHTML = `
    <div class="hero">
      <div class="hero-icon">${itemIconHtml(selectedItem)}</div>
      <div class="hero-info">
        <div class="item-name">${selectedItem.name}</div>
        <div class="no-ench">Marca encantamientos para ver el coste óptimo</div>
      </div>
    </div>
    <div class="empty-state">
      <div class="icon">🔨</div>
      <p>Sin encantamientos seleccionados</p>
    </div>
  `;
}

function tagsHtml(enchants: { id: string; level: number }[]): string {
  return enchants.map(e => {
    const max = ENCHANT_MAP.get(e.id)?.maxLevel ?? 1;
    return `<span class="enchant-tag">${enchName(e.id, lang)}${max > 1 ? ' ' + toRoman(e.level) : ''}</span>`;
  }).join('');
}

function nodeHtml(node: { enchants: { id: string; level: number }[]; isTargetItem: boolean }, extraClass = ''): string {
  const label = node.isTargetItem ? selectedItem.name : BOOK_LABEL();
  const icon = node.isTargetItem
    ? `<div class="node-icon item">${itemIconHtml(selectedItem)}</div>`
    : `<div class="node-icon book">${BOOK_SVG}</div>`;
  return `<div class="node-box ${node.isTargetItem ? 'target' : ''} ${extraClass}">
    ${icon}
    <div class="node-text">
      <div class="node-label">${label}</div>
      <div class="node-enchants">${tagsHtml(node.enchants)}</div>
    </div>
  </div>`;
}

function render(result: SolveResult) {
  const chips = Array.from(selectedEnchants.entries())
    .map(([id, level]) => {
      const max = ENCHANT_MAP.get(id)?.maxLevel ?? 1;
      return `<span class="chip" data-id="${id}">${enchName(id, lang)}${max > 1 ? ' ' + toRoman(level) : ''}<span class="x">×</span></span>`;
    })
    .join('');

  stage.innerHTML = `
    <div class="hero">
      <div class="hero-icon">${itemIconHtml(selectedItem)}</div>
      <div class="hero-info">
        <div class="item-name">${selectedItem.name}</div>
        <div class="chips">${chips}</div>
      </div>
    </div>

    <div class="cost-panel">
      <div class="cost-block">
        <span class="num">${result.totalCost}</span>
        <span class="lbl">Niveles totales</span>
        <span class="sub">${result.steps.length} combinación${result.steps.length !== 1 ? 'es' : ''} · ${selectedEnchants.size} libro${selectedEnchants.size !== 1 ? 's' : ''}</span>
      </div>
    </div>

    <div class="steps-label">Orden de combinación</div>
    <div class="steps">
      ${result.steps.map((step, idx) => `
        <div class="step-card ${step.tooExpensive ? 'too-expensive' : ''}">
          <div class="step-num">${idx + 1}</div>
          ${nodeHtml(step.left)}
          <div class="op">+</div>
          ${nodeHtml(step.right)}
          <div class="op">=</div>
          ${nodeHtml(step.result, 'result')}
          <div class="step-cost ${step.tooExpensive ? 'danger' : ''}">
            <div class="lvl">${step.levelCost}</div>
            <div class="lvl-label">niveles</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  stage.querySelectorAll<HTMLElement>('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedEnchants.delete(chip.dataset.id!);
      renderEnchants();
      update();
    });
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toRoman(n: number): string {
  const map: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let r = '';
  for (const [v, s] of map) { while (n >= v) { r += s; n -= v; } }
  return r;
}

// ── Init ───────────────────────────────────────────────────────────────────
renderItemGrid();
renderEnchants();
renderEmpty();
