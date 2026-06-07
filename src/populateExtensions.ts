interface Extension {
  name: string;
  urls: {
    [key: string]: string;
  };
  tags?: string[];
}

const BROWSER_LABELS: Record<string, string> = {
  chrome: 'Chrome',
  edge: 'Edge',
  firefox: 'Firefox',
  safari: 'Safari',
};

let activeBrowser = 'all';
let activeTag = 'all';

function resolveUrl(urls: Record<string, string>, browser: string): string {
  if (browser !== 'all') return urls[browser] ?? '#';
  return urls.chrome ?? urls.edge ?? urls.firefox ?? urls.safari ?? '#';
}

function createCard(ext: Extension): HTMLElement {
  const card = document.createElement('div');
  card.className = 'ext-card';
  card.dataset.tags = (ext.tags ?? []).join(',');
  card.dataset.browsers = Object.keys(ext.urls).join(',');
  card.dataset.urls = JSON.stringify(ext.urls);

  const inner = document.createElement('a');
  inner.className = 'ext-card-inner';
  inner.href = resolveUrl(ext.urls, activeBrowser);
  inner.target = '_blank';
  inner.rel = 'noopener';

  const name = document.createElement('span');
  name.className = 'ext-name';
  name.textContent = ext.name;

  const meta = document.createElement('div');
  meta.className = 'ext-meta';

  const badges = document.createElement('div');
  badges.className = 'browser-badges';
  Object.keys(ext.urls).forEach((browser) => {
    const badge = document.createElement('span');
    badge.className = 'browser-badge';
    badge.textContent = BROWSER_LABELS[browser] ?? browser;
    badges.appendChild(badge);
  });

  const tagRow = document.createElement('div');
  tagRow.className = 'ext-tag-pills';
  (ext.tags ?? []).forEach((tag) => {
    const pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.textContent = tag;
    tagRow.appendChild(pill);
  });

  meta.appendChild(badges);
  if ((ext.tags ?? []).length > 0) meta.appendChild(tagRow);

  inner.appendChild(name);
  inner.appendChild(meta);
  card.appendChild(inner);
  return card;
}

function renderGrid(extensions: Extension[]) {
  const grid = document.getElementById('ext-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const sorted = [...extensions].sort((a, b) => a.name.localeCompare(b.name));
  sorted.forEach((ext, index) => {
    const card = createCard(ext);
    card.style.animationDelay = `${index * 28}ms`;
    grid.appendChild(card);
  });
}

function collectTags(extensions: Extension[]): string[] {
  const set = new Set<string>();
  extensions.forEach((ext) => (ext.tags ?? []).forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

function initTagFilters(extensions: Extension[]) {
  const row = document.getElementById('tag-filter-row');
  if (!row) return;

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-pill active';
  allBtn.dataset.tag = 'all';
  allBtn.textContent = 'All tags';
  row.appendChild(allBtn);

  collectTags(extensions).forEach((tag) => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.dataset.tag = tag;
    btn.textContent = tag;
    row.appendChild(btn);
  });

  row.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>('.filter-pill');
    if (!btn?.dataset.tag) return;
    activeTag = btn.dataset.tag;
    row.querySelectorAll('.filter-pill').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
}

function applyFilters() {
  const grid = document.getElementById('ext-grid');
  if (!grid) return;

  let visible = 0;
  grid.querySelectorAll<HTMLElement>('.ext-card').forEach((card) => {
    const browsers = card.dataset.browsers?.split(',') ?? [];
    const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
    const urls = JSON.parse(card.dataset.urls ?? '{}') as Record<string, string>;

    const browserMatch = activeBrowser === 'all' || browsers.includes(activeBrowser);
    const tagMatch = activeTag === 'all' || tags.includes(activeTag);
    const show = browserMatch && tagMatch;

    card.classList.toggle('hidden', !show);
    if (show) {
      const inner = card.querySelector<HTMLAnchorElement>('.ext-card-inner');
      if (inner) inner.href = resolveUrl(urls, activeBrowser);
      visible++;
    }
  });

  let empty = grid.querySelector<HTMLElement>('.empty-state');
  if (visible === 0) {
    if (!empty) {
      empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No extensions match this filter combination.';
      grid.appendChild(empty);
    }
    empty.hidden = false;
  } else if (empty) {
    empty.hidden = true;
  }
}

document.getElementById('browser-filter-row')?.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('.filter-pill');
  if (!btn?.dataset.browser) return;
  activeBrowser = btn.dataset.browser;
  document.getElementById('browser-filter-row')
    ?.querySelectorAll('.filter-pill')
    .forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
});

fetch('assets/data/extensions.json')
  .then((response) => response.json())
  .then((data: { extensions: Extension[] }) => {
    renderGrid(data.extensions);
    initTagFilters(data.extensions);
  })
  .catch((error) => console.error('Error loading extensions:', error));
