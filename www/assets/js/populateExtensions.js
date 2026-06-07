"use strict";

var BROWSER_LABELS = {
  chrome: 'Chrome',
  edge: 'Edge',
  firefox: 'Firefox',
  safari: 'Safari',
};

var activeBrowser = 'all';
var activeTag = 'all';

function resolveUrl(urls, browser) {
  if (browser !== 'all') return urls[browser] || '#';
  return urls.chrome || urls.edge || urls.firefox || urls.safari || '#';
}

function createCard(ext) {
  var card = document.createElement('div');
  card.className = 'ext-card';
  card.dataset.tags = (ext.tags || []).join(',');
  card.dataset.browsers = Object.keys(ext.urls).join(',');
  card.dataset.urls = JSON.stringify(ext.urls);

  var inner = document.createElement('a');
  inner.className = 'ext-card-inner';
  inner.href = resolveUrl(ext.urls, activeBrowser);
  inner.target = '_blank';
  inner.rel = 'noopener';

  var name = document.createElement('span');
  name.className = 'ext-name';
  name.textContent = ext.name;

  var meta = document.createElement('div');
  meta.className = 'ext-meta';

  var badges = document.createElement('div');
  badges.className = 'browser-badges';
  Object.keys(ext.urls).forEach(function(browser) {
    var badge = document.createElement('span');
    badge.className = 'browser-badge';
    badge.textContent = BROWSER_LABELS[browser] || browser;
    badges.appendChild(badge);
  });

  var tagRow = document.createElement('div');
  tagRow.className = 'ext-tag-pills';
  (ext.tags || []).forEach(function(tag) {
    var pill = document.createElement('span');
    pill.className = 'tag-pill';
    pill.textContent = tag;
    tagRow.appendChild(pill);
  });

  meta.appendChild(badges);
  if ((ext.tags || []).length > 0) meta.appendChild(tagRow);

  inner.appendChild(name);
  inner.appendChild(meta);
  card.appendChild(inner);
  return card;
}

function renderGrid(extensions) {
  var grid = document.getElementById('ext-grid');
  if (!grid) return;
  grid.innerHTML = '';

  var sorted = extensions.slice().sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  sorted.forEach(function(ext, index) {
    var card = createCard(ext);
    card.style.animationDelay = (index * 28) + 'ms';
    grid.appendChild(card);
  });
}

function collectTags(extensions) {
  var seen = {};
  extensions.forEach(function(ext) {
    (ext.tags || []).forEach(function(t) { seen[t] = true; });
  });
  return Object.keys(seen).sort();
}

function initTagFilters(extensions) {
  var row = document.getElementById('tag-filter-row');
  if (!row) return;

  var allBtn = document.createElement('button');
  allBtn.className = 'filter-pill active';
  allBtn.dataset.tag = 'all';
  allBtn.textContent = 'All tags';
  row.appendChild(allBtn);

  collectTags(extensions).forEach(function(tag) {
    var btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.dataset.tag = tag;
    btn.textContent = tag;
    row.appendChild(btn);
  });

  row.addEventListener('click', function(e) {
    var btn = e.target.closest('.filter-pill');
    if (!btn || !btn.dataset.tag) return;
    activeTag = btn.dataset.tag;
    row.querySelectorAll('.filter-pill').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    applyFilters();
  });
}

function applyFilters() {
  var grid = document.getElementById('ext-grid');
  if (!grid) return;

  var visible = 0;
  grid.querySelectorAll('.ext-card').forEach(function(card) {
    var browsers = card.dataset.browsers ? card.dataset.browsers.split(',') : [];
    var tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
    var urls = JSON.parse(card.dataset.urls || '{}');

    var browserMatch = activeBrowser === 'all' || browsers.indexOf(activeBrowser) !== -1;
    var tagMatch = activeTag === 'all' || tags.indexOf(activeTag) !== -1;
    var show = browserMatch && tagMatch;

    card.classList.toggle('hidden', !show);
    if (show) {
      var inner = card.querySelector('.ext-card-inner');
      if (inner) inner.href = resolveUrl(urls, activeBrowser);
      visible++;
    }
  });

  var empty = grid.querySelector('.empty-state');
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

var browserFilterRow = document.getElementById('browser-filter-row');
if (browserFilterRow) {
  browserFilterRow.addEventListener('click', function(e) {
    var btn = e.target.closest('.filter-pill');
    if (!btn || !btn.dataset.browser) return;
    activeBrowser = btn.dataset.browser;
    browserFilterRow.querySelectorAll('.filter-pill').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    applyFilters();
  });
}

fetch('assets/data/extensions.json')
  .then(function(response) { return response.json(); })
  .then(function(data) {
    renderGrid(data.extensions);
    initTagFilters(data.extensions);
  })
  .catch(function(error) { return console.error('Error loading extensions:', error); });
