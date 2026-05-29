'use strict';

/* ═══════════════════════════════════════════════════════════
   PETE PICS — THE GALLERY  ·  gallery.js v3
   
   How it works:
   - On load, fetches each postimg gallery via their JSON API
     (/json?action=list&page=N&album=HEX) through a CORS proxy.
   - Paginates through all pages until has_page_next is false.
   - Builds the gallery data entirely from live source —
     nothing is hardcoded, so new images appear automatically.
═══════════════════════════════════════════════════════════ */

/* ── GALLERY SOURCES ─────────────────────────────────────── */
const GALLERY_DEFS = [
  {
    id:        'pobots',
    name:      'Pobots',
    tagline:   'Robots. Petes. The intersection thereof.',
    wallClass: 'room-wall-1',
    albumHex:  'VML2tRn',
  },
  {
    id:        'prestlers',
    name:      'Prestlers',
    tagline:   'Pete meets the squared circle and beyond.',
    wallClass: 'room-wall-2',
    albumHex:  'RFbFrht',
  },
  {
    id:        'cultural',
    name:      'Cultural Pics',
    tagline:   'Art, culture, and things that are Pete.',
    wallClass: 'room-wall-3',
    albumHex:  'HVYDkG8',
  },
  {
    id:        'pisc',
    name:      'Pisc',
    tagline:   'A miscellany. A cornucopia. A Pisc.',
    wallClass: 'room-wall-4',
    albumHex:  'Yt9J3Xt',
  },
];

/* CORS proxies — tried in order until one succeeds */
const PROXIES = [
  url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
];

async function fetchWithProxies(url) {
  for (const proxyFn of PROXIES) {
    try {
      const res = await fetch(proxyFn(url));
      if (!res.ok) continue;
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.contents) return json.contents;
        if (json.images) return text;
      } catch {}
      return text;
    } catch (e) {
      console.warn(`Proxy failed:`, e.message);
      continue;
    }
  }
  throw new Error('All CORS proxies failed');
}

/* ── STATE ───────────────────────────────────────────────── */
const GALLERIES   = {};
const allWorks    = [];
let   currentRoom = 'all';
let   lightboxItems  = [];
let   lightboxIndex  = 0;
let   searchQuery    = '';

/* ── INTERSECTION OBSERVER (lazy load) ───────────────────── */
const imgObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    if (!img.dataset.src) return;
    img.src = img.dataset.src;
    delete img.dataset.src;
    imgObserver.unobserve(img);
  });
}, { rootMargin: '400px' });

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showLoadingState();
  fetchAllGalleries();
});

function showLoadingState() {
  const countEl = document.getElementById('total-count');
  if (countEl) {
    countEl.innerHTML = '<span style="opacity:0.5;animation:pulse 1.5s infinite">Fetching collection…</span>';
  }
}

/* ── FETCH ALL GALLERIES ────────────────────────────────── */
async function fetchAllGalleries() {
  const statusEl = document.getElementById('loader-status');

  // Fetch all galleries sequentially so we can show live progress
  for (const def of GALLERY_DEFS) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await fetchGalleryPage(def, page);
      hasMore = result.hasMore;
      page++;

      if (statusEl) {
        const galleryWorks = GALLERIES[def.id]?.works.length || 0;
        statusEl.textContent = `${def.name} — page ${page - 1} (${galleryWorks} images)`;
      }
    }
  }

  // All done — hide loader and render
  if (statusEl) statusEl.textContent = `${allWorks.length} works loaded — opening gallery…`;

  setTimeout(() => {
    const loader = document.getElementById('gallery-loader');
    if (loader) loader.remove();

    const countEl = document.getElementById('total-count');
    if (countEl) countEl.textContent = `${allWorks.length} works in the permanent collection`;

    if (document.getElementById('gallery-shell').classList.contains('open')) {
      renderRoom(currentRoom);
    }
  }, 500);
}

async function fetchGalleryPage(def, page) {
  try {
    const apiUrl = `https://postimg.cc/json?action=list&page=${page}&album=${def.albumHex}`;
    const jsonStr = await fetchWithProxies(apiUrl);
    const data = JSON.parse(jsonStr);

    const images = data.images || [];
    const hasMore = data.has_page_next === true || data.has_page_next === 'true';

    for (const img of images) {
      const [id, , name, ext] = img;
      const file = `${name.replace(/ /g, '-')}.${ext}`;
      const work = { id, file, title: deriveTitle(name), gallery: def.id, galleryName: def.name };
      allWorks.push(work);

      if (!GALLERIES[def.id]) GALLERIES[def.id] = { ...def, works: [] };
      GALLERIES[def.id].works.push(work);
    }

    return { hasMore };
  } catch (err) {
    console.warn(`Failed to fetch ${def.name} page ${page}:`, err);
    if (!GALLERIES[def.id]) GALLERIES[def.id] = { ...def, works: [] };
    return { hasMore: false };
  }
}

/* ── DERIVE READABLE TITLE FROM FILENAME ────────────────── */
function deriveTitle(name) {
  try { name = decodeURIComponent(name); } catch(e) {}
  name = name.replace(/-/g, ' ');
  return name.trim() || name;
}

/* ── OPEN GALLERY ────────────────────────────────────────── */
function openGallery() {
  document.getElementById('entrance').style.display = 'none';
  document.getElementById('gallery-shell').classList.add('open');

  if (allWorks.length === 0) {
    document.getElementById('gallery-content').innerHTML = `
      <div style="padding:6rem 2rem;text-align:center;">
        <p style="font-family:'Josefin Sans',sans-serif;font-size:0.7rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem;">Loading collection…</p>
        <div style="width:40px;height:40px;border:3px solid rgba(184,148,42,0.15);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;"></div>
      </div>`;
  } else {
    renderRoom('all');
  }
}

/* ── NAVIGATION ──────────────────────────────────────────── */
function showRoom(room) {
  currentRoom = room;
  searchQuery = '';
  document.getElementById('search-input').value = '';
  document.querySelectorAll('.nav-tab').forEach((tab, i) => {
    tab.classList.toggle('active',
      ['all','pobots','prestlers','cultural','pisc'][i] === room);
  });
  renderRoom(room);
  window.scrollTo({ top: 56, behavior: 'smooth' });
}

function handleSearch(q) {
  searchQuery = q.trim().toLowerCase();
  renderRoom(currentRoom);
}

/* ── RENDER ──────────────────────────────────────────────── */
function renderRoom(room) {
  const container = document.getElementById('gallery-content');
  if (searchQuery)          { renderSearch(container);                    return; }
  if (room === 'all')       { renderAll(container);                       return; }
  if (GALLERIES[room])      { renderSingle(container, GALLERIES[room]);   return; }
  container.innerHTML = `<div style="padding:4rem;text-align:center;color:#888;font-style:italic">
    Loading gallery…</div>`;
}

function renderSingle(container, gallery) {
  container.innerHTML = '';

  const header = el('div', `room-header ${gallery.wallClass}`);
  header.innerHTML = `
    <div class="room-header-left">
      <div class="room-eyebrow">Pete Pics — Permanent Collection</div>
      <h2 class="room-title"><em>${gallery.name}</em></h2>
      <p class="room-desc">${gallery.tagline}</p>
    </div>
    <div class="room-count">
      <strong>${gallery.works.length}</strong>Works on Display
    </div>`;
  container.appendChild(header);
  container.appendChild(el('div', 'wainscot'));

  lightboxItems = gallery.works;

  const wall = el('div', 'gallery-wall');
  wall.appendChild(buildGrid(gallery.works));
  container.appendChild(wall);
}

function renderAll(container) {
  container.innerHTML = '';

  const header = el('div', 'room-header');
  header.innerHTML = `
    <div class="room-header-left">
      <div class="room-eyebrow">Pete Pics — Full Collection</div>
      <h2 class="room-title">All <em>Works</em></h2>
      <p class="room-desc">The complete permanent collection across all four galleries.</p>
    </div>
    <div class="room-count"><strong>${allWorks.length}</strong>Works Total</div>`;
  container.appendChild(header);
  container.appendChild(el('div', 'wainscot'));

  lightboxItems = [...allWorks];

  GALLERY_DEFS.forEach(def => {
    const gallery = GALLERIES[def.id];
    if (!gallery || !gallery.works.length) return;

    const section = el('div', 'all-room');
    const label   = el('div', 'all-room-label');
    label.textContent = `${gallery.name} — ${gallery.works.length} works`;
    section.appendChild(label);

    const wall = el('div', 'gallery-wall');
    wall.style.paddingTop = '0.5rem';
    wall.appendChild(buildGrid(gallery.works));
    section.appendChild(wall);
    container.appendChild(section);
  });
}

function renderSearch(container) {
  const results = allWorks.filter(w =>
    w.title.toLowerCase().includes(searchQuery) ||
    w.galleryName.toLowerCase().includes(searchQuery)
  );

  container.innerHTML = '';

  const hdr = el('div', 'search-results-header');
  hdr.innerHTML = results.length
    ? `Showing <strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''} for "${searchQuery}"`
    : '';
  container.appendChild(hdr);

  if (!results.length) {
    const none = el('div', 'no-results');
    none.textContent = `No works found for "${searchQuery}"`;
    container.appendChild(none);
    return;
  }

  lightboxItems = results;
  const wall = el('div', 'gallery-wall');
  wall.appendChild(buildGrid(results));
  container.appendChild(wall);
}

/* ── BUILD MASONRY GRID ──────────────────────────────────── */
const FRAME_STYLES = ['', 'gold-frame', 'ebony-frame', 'silver-frame'];

function buildGrid(items) {
  const grid = el('div', 'gallery-grid');

  items.forEach((work, idx) => {
    const card       = el('div', 'artwork-card');
    card.style.animationDelay = Math.min(idx * 0.02, 0.5) + 's';

    const frame      = el('div', `frame ${FRAME_STYLES[idx % FRAME_STYLES.length]}`);
    const frameInner = el('div', 'frame-inner');

    const shimmer    = el('div', 'img-shimmer');
    frameInner.appendChild(shimmer);

    const img        = document.createElement('img');
    img.alt          = work.title;
    img.dataset.src  = `https://i.postimg.cc/${work.id}/${work.file}`;
    img.decoding     = 'async';

    img.addEventListener('load', () => {
      img.classList.add('loaded');
      shimmer.classList.add('done');
      setTimeout(() => shimmer.remove(), 400);
    });
    img.addEventListener('error', () => {
      shimmer.remove();
      frameInner.innerHTML = `<div class="img-error">Unavailable</div>`;
    });

    frameInner.appendChild(img);
    imgObserver.observe(img);

    const nameplate = el('div', 'nameplate');
    nameplate.innerHTML = `<div class="nameplate-title">${work.title}</div>`;

    frame.appendChild(frameInner);
    frame.appendChild(nameplate);
    card.appendChild(frame);

    const lbIdx = lightboxItems.findIndex(i => i.id === work.id);
    card.addEventListener('click', () => openLightbox(lbIdx !== -1 ? lbIdx : idx));

    grid.appendChild(card);
  });

  return grid;
}

/* ── LIGHTBOX ────────────────────────────────────────────── */
function openLightbox(idx) {
  lightboxIndex = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
  updateLightbox();
}

function updateLightbox() {
  const work = lightboxItems[lightboxIndex];
  if (!work) return;

  const url = `https://i.postimg.cc/${work.id}/${work.file}`;
  const img = document.getElementById('lb-img');
  img.classList.remove('loaded');
  img.src = url;
  img.alt = work.title;
  img.onload  = () => img.classList.add('loaded');
  img.onerror = () => img.classList.add('loaded');

  document.getElementById('lb-title').textContent    = work.title;
  document.getElementById('lb-gallery').textContent  = work.galleryName || work.gallery;
  document.getElementById('lb-position').textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
  document.getElementById('lb-link').href            = url;
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') lbNav(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   lbNav(-1);
  if (e.key === 'Escape') closeLightbox();
});

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

/* ── UTILITY ─────────────────────────────────────────────── */
function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}
