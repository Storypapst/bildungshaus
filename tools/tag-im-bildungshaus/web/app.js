/* app.js: page logic for Bildungshaus weWeit (Kita page v5). Content lives in story.js; build.py
   concatenates story.js + app.js into site/app.js inside one IIFE. No inline script, no eval:
   the page runs under script-src 'self'. Every render, KI image and anchor is optional:
   a missing image becomes a placeholder, a missing anchor skips its dot or bubble. */

const SD = (() => { try { return JSON.parse(document.getElementById('scenedata').textContent); } catch (e) { return {}; } })();
SD.rooms = SD.rooms || {}; SD.shots = SD.shots || {}; SD.ki = SD.ki || {};
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => innerWidth <= 860;
const arr = v => v == null ? [] : (Array.isArray(v) ? v : [v]);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rect = n => n.getBoundingClientRect();
function inflate(r, k){ return {left:r.left - k, right:r.right + k, top:r.top - k, bottom:r.bottom + k}; }
function hit(a, b){ return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
function shift(r, dx, dy){ return {left:r.left + dx, right:r.right + dx, top:r.top + dy, bottom:r.bottom + dy}; }
function el(tag, cls, html){ const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function svg(tag, attrs, parent){ const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function safe(name, fn){ try { return fn(); } catch (e) { console.warn('bildungshaus: ' + name + ' skipped', e); return null; } }
/* first anchor of a list that exists in the render; returns [x, y] in 0..1 or null */
function anchorHit(data, names){
  if (!data || !data.anchors) return null;
  for (const n of arr(names)){ const p = data.anchors[n]; if (Array.isArray(p) && isFinite(p[0]) && isFinite(p[1])) return {p, name:n}; }
  return null;
}
function anchor(data, names){ const h = anchorHit(data, names); return h ? h.p : null; }
function onImage(p, m){ m = m == null ? .015 : m; return !!p && p[0] > m && p[0] < 1 - m && p[1] > m && p[1] < 1 - m; }
/* One image record: a render (room or close-up), a KI image ('ki:name') or a placeholder. */
function imgRec(n){
  if (n.indexOf('ki:') === 0){
    const k = n.slice(3), d = SD.ki[k], a = KI_ANCHORS[k] || {};
    return d ? {name:n, data:Object.assign({anchors:a}, d), ki:true} : {name:n, data:{w:1536, h:1024, anchors:{}}, ph:true, ki:true, text:KI_PH[k] || 'Bild folgt'};
  }
  const room = !!SD.rooms[n], d = SD.shots[n] || SD.rooms[n];
  if (!d) return null;
  if (d.ph) return {name:n, data:{w:d.w, h:d.h, anchors:{}}, ph:true, room, text:'Rendering folgt'};
  return {name:n, data:d, room};
}
/* first real image of the list (with need: the first that shows that anchor), else a placeholder */
function imgData(names, need){
  const all = arr(names).map(imgRec).filter(Boolean); const real = all.filter(I => !I.ph);
  if (need){ const w = real.find(I => onImage(anchor(I.data, need), .02)); if (w) return w; }
  return real[0] || all[0] || null;
}

const ICON = {
 gear:'<svg viewBox="0 0 100 100" aria-hidden="true"><g class="g"><path fill="currentColor" d="m43.203 2.5234h13.598c0.67969 0 1.2422 0.51953 1.3047 1.1836l1.7305 11.613c2.7031 0.76563 5.2773 1.832 7.7344 3.2031l9.4922-7.0273c0.52734-0.39062 1.2539-0.32422 1.7031 0.125l9.6172 9.6133c0.48828 0.48828 0.50781 1.2773 0.058594 1.7891l-6.9648 9.4062c1.3633 2.4414 2.4453 5.0391 3.207 7.7305l11.676 1.7422c0.65234 0.09375 1.1211 0.65625 1.1211 1.293v13.598c0 0.67969-0.51953 1.2383-1.1836 1.3047l-11.613 1.7305c-0.76562 2.7031-1.832 5.2773-3.2031 7.7344l7.0273 9.4922c0.39063 0.52734 0.32422 1.2539-0.125 1.7031l-9.6133 9.6172c-0.48828 0.48828-1.2773 0.50781-1.7891 0.058594l-9.4062-6.9648c-2.4414 1.3633-5.0391 2.4453-7.7305 3.207l-1.7422 11.676c-0.09375 0.65234-0.65625 1.1211-1.293 1.1211h-13.598c-0.67969 0-1.2383-0.51953-1.3047-1.1836l-1.7305-11.613c-2.7031-0.76562-5.2773-1.832-7.7344-3.2031l-9.4922 7.0273c-0.52734 0.39062-1.2539 0.32422-1.7031-0.125l-9.6172-9.6133c-0.48828-0.48828-0.50781-1.2773-0.058594-1.7891l6.9648-9.4062c-1.3633-2.4414-2.4453-5.0391-3.207-7.7305l-11.676-1.7422c-0.65234-0.09375-1.1211-0.65625-1.1211-1.293v-13.598c0-0.67969 0.51953-1.2383 1.1836-1.3047l11.613-1.7305c0.76562-2.7031 1.8359-5.2773 3.207-7.7344l-7.0273-9.4922c-0.39062-0.52734-0.32422-1.2539 0.125-1.7031l9.6133-9.6172c0.48828-0.48828 1.2773-0.50781 1.7891-0.058594l9.4062 6.9648c2.4453-1.3672 5.0391-2.4453 7.7305-3.207l1.7422-11.676c0.09375-0.65234 0.65625-1.1211 1.293-1.1211zm6.7969 28.977c-10.223 0-18.504 8.2812-18.504 18.504s8.2812 18.504 18.504 18.504 18.504-8.2812 18.504-18.504-8.2812-18.504-18.504-18.504z"/></g></svg>',
 cloud:'<svg viewBox="0 0 30 30" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M8 22h15a5 5 0 0 0 .6-10 7 7 0 0 0-13.3-1.6A5.5 5.5 0 0 0 8 22z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M11 16h8M11 19h5"/></svg>',
 phone:'<svg viewBox="0 0 30 30" aria-hidden="true"><rect x="9" y="4" width="12" height="22" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 22h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 house:'<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M5 26V12l10-7 10 7v14M3 26h24M12 26v-7h6v7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
 sun:'<svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 3v4M15 23v4M3 15h4M23 15h4M6.5 6.5l2.8 2.8M20.7 20.7l2.8 2.8M6.5 23.5l2.8-2.8M20.7 9.3l2.8-2.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 bulb:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
 kind:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.5 20c.8-4.2 3.3-6.5 6.5-6.5s5.7 2.3 6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 lern:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 20c.6-3.8 2.8-6 6-6s5.4 2.2 6 6M15 3.5h6.5v6H15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 eltern:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="7.5" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 20c.6-3.6 2.7-5.6 5.5-5.6s4.9 2 5.5 5.6M13.5 15c.9-.6 1.9-.9 3-.9 2.4 0 4.1 1.7 4.6 4.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 traeger:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V9l6-4 6 4v12M15 12h6v9M2 21h20M7 13h4M7 17h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 left:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 right:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 close:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 cube:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 41 14.5v19L24 43 7 33.5v-19z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M7 14.5 24 24l17-9.5M24 24v19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>',
 train:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="6" width="26" height="28" rx="7" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M11 21h26M18 34l-5 8M30 34l5 8M16 39h16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="18" cy="28" r="1.8" fill="currentColor"/><circle cx="30" cy="28" r="1.8" fill="currentColor"/></svg>',
 image:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13" r="2.4" fill="currentColor"/><path d="M5 23l7-6 5 4 4-3 6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
};

/* ================================================================ image tags (hero) */
function addTags(parent, data, list){
  const out = [];
  list.forEach(L => {
    const p = anchor(data, L.a); if (!onImage(p, .01)) return;
    const t = el('span', 'tag' + (L.wood ? ' wood' : ''), L.t);
    t.style.left = (p[0]*100) + '%'; t.style.top = (p[1]*100) + '%';
    parent.appendChild(t); out.push(t);
  });
  return out;
}
/* keep tags inside the figure and apart from each other; hide a tag rather than overlap */
function fitTags(fig, tags, obstacles){
  if (!tags.length || !fig.offsetParent) return;
  const fb = rect(fig); const placed = (obstacles || []).slice();
  tags.forEach(t => { t.hidden = false; t.classList.remove('under'); t.style.transform = ''; t.style.removeProperty('--lx'); t.style.removeProperty('--lh'); });
  // top-most anchors first, so a tag never sits on the leader of the tag above it
  const order = tags.map(t => ({t, r:rect(t)})).sort((a, b) => a.r.bottom - b.r.bottom);
  order.forEach(({t, r:r0}) => {
    t.classList.add('under'); const ru = rect(t); t.classList.remove('under');
    const w = r0.right - r0.left, sx = Math.max(0, w/2 - 16);
    const tries = [];
    [[0, false], [-28, false], [0, true], [-56, false], [28, true], [-84, false]].forEach(([dy, under]) => [0, sx, -sx].forEach(dx => tries.push([dx, dy, under])));
    let ok = null;
    for (const [dx0, dy, under] of tries){
      const base = under ? ru : r0;
      let dx = dx0; let r = shift(base, dx, dy);
      if (r.left < fb.left + 4) dx += fb.left + 4 - r.left; else if (r.right > fb.right - 4) dx -= r.right - fb.right + 4;
      r = shift(base, dx, dy);
      if (r.left < fb.left + 2 || r.right > fb.right - 2 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      // the leader line from the tag to its anchor counts as part of the tag
      const ax = (base.left + base.right)/2, len = 14 + Math.abs(dy);
      if (ax < r.left + 8 || ax > r.right - 8) continue;
      const lead = under ? {left:ax - 2, right:ax + 2, top:r.top - len, bottom:r.top} : {left:ax - 2, right:ax + 2, top:r.bottom, bottom:r.bottom + len};
      if (placed.some(q => hit(inflate(q, 4), r) || hit(q, lead))) continue;
      ok = {dx, dy, r, under, lead}; break;
    }
    if (!ok){ t.hidden = true; return; }
    t.classList.toggle('under', ok.under);
    if (ok.dx || ok.dy){
      t.style.transform = `translate(calc(-50% + ${ok.dx}px), calc(${ok.under ? '0%' : '-100%'} + ${ok.dy}px))`;
      t.style.setProperty('--lx', `calc(50% - ${ok.dx}px)`); t.style.setProperty('--lh', (14 + Math.abs(ok.dy)) + 'px');
    }
    placed.push(ok.r, ok.lead);
  });
}

/* placeholder figure: "Rendering folgt" for renders, "Bild folgt" for KI images */
function phFig(text, sub, ki){
  const f = el('div', 'ph-fig' + (ki ? ' ki' : ''));
  f.innerHTML = (ki ? ICON.train : ICON.cube) + `<b>${text}</b>` + (sub ? `<small>${sub}</small>` : '');
  f.setAttribute('role', 'img'); f.setAttribute('aria-label', text + (sub ? ': ' + sub : ''));
  return f;
}

/* ================================================================ hero, teasers */
const HERO = {tags:[]};
function buildHero(){
  const fig = $('#hero-fig'); const d = SD.rooms.aussen; if (!fig) return;
  if (!d || d.ph){ fig.classList.add('is-ph'); fig.appendChild(phFig('Rendering folgt', 'Startbild: Kita, Lab und Schule nebenan')); return; }
  const img = el('img'); img.src = d.img; img.width = d.w; img.height = d.h; img.decoding = 'async';
  img.alt = 'Ein Tag im Bildungshaus weWeit: ' + HERO_LABELS.filter(L => anchor(d, L.a)).map(L => L.t).join(', ');
  fig.appendChild(img);
  HERO.fig = fig; HERO.tags = addTags(fig, d, HERO_LABELS);
}
/* teaser pictures: a crop of the hero around the Lab or the school */
function buildTeasers(){
  const d = SD.rooms.aussen;
  $$('.t-img[data-anchor]').forEach(box => {
    const p = d && !d.ph ? anchor(d, box.dataset.anchor) : null;
    if (!p){ box.classList.add('ph'); box.innerHTML = ICON.image; return; }
    const S = 2.4, r = d.h / d.w, c = 9/16;
    const tx = clamp(.5 - S*p[0], 1 - S, 0), ty = clamp(c/2 - S*p[1]*r, c - S*r, 0);
    const img = el('img'); img.src = d.img; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    img.style.transform = `translate(${(tx*100).toFixed(2)}%, ${(ty/r*100).toFixed(2)}%) scale(${S})`;
    box.appendChild(img);
  });
}

/* ================================================================ stations */
const ST = [];
function buildStation(s, i){
  const sec = el('section', 'st-sec'); sec.id = s.id; sec.setAttribute('aria-labelledby', s.id + '-h');
  const wrap = el('div', 'wrap railpad'); const inner = el('div', 'station');
  const head = el('div', 'st-head');
  head.innerHTML = `<p class="kopf"><span class="time">${s.time}</span><span class="ort">${s.ort}</span></p><h2 id="${s.id}-h">${s.title}</h2>`
    + (s.moment ? `<div class="mila"><span class="k">Moment</span><p>${s.moment}</p></div>` : '');
  const side = el('div', 'st-side');
  if (s.idee) side.appendChild(el('div', 'idee', `<h3 class="k">${ICON.bulb}Die Idee dahinter</h3><p>${s.idee}</p>`));
  if (s.bisher) side.appendChild(el('div', 'compare', `<div class="was"><b>Bisher oft</b><p>${s.bisher}</p></div><div class="neu"><b>Unsere Idee</b><p>${s.unsere}</p></div>`));
  const media = el('div', 'st-media');
  const st = {s, i, sec, inner, head, side, media, stages:[], cur:0, chips:[]};
  inner.append(head);
  safe('figure ' + s.id, () => buildFigure(st));
  inner.append(media, side);
  const tools = el('div', 'st-tools');
  // tap points as chips: same targets as the dots, reachable by keyboard, also when a dot has no anchor yet
  if ((s.hots || []).length){
    const chips = el('div', 'chips', '<span>Tipp-Punkte</span>');
    s.hots.forEach((h, hi) => {
      const c = el('button', 'chip', `<i></i>${h.l}`); c.type = 'button';
      if (h.note) c.setAttribute('aria-expanded', 'false'); else c.setAttribute('aria-haspopup', 'dialog');
      c.addEventListener('click', () => { stopAuto(st); openHot(st, hi, c); });
      chips.appendChild(c); st.chips[hi] = c;
    });
    tools.appendChild(chips);
  }
  if (s.xray){
    const xb = el('button', 'xbtn', ICON.gear + '<span>Was steckt dahinter?</span>'); xb.type = 'button'; xb.setAttribute('aria-haspopup', 'dialog');
    xb.addEventListener('click', () => { stopAuto(st); openXray(st, xb); });
    tools.appendChild(xb); st.xbtn = xb;
  }
  if (tools.children.length) media.appendChild(tools);
  const more = el('div', 'st-more');
  if (s.nutzen) more.appendChild(el('div', 'nutzen hy', `<h3 class="blk">Nutzen</h3><ul>${s.nutzen.map((t, j) => `<li><b>${ICON[NUTZEN_ICONS[j]]}${NUTZEN_ROLES[j]}</b><span>${t}</span></li>`).join('')}</ul>`));
  if (s.varianten && s.varianten.length) more.appendChild(buildVariants(s.varianten));
  if (s.daten || s.annahme){
    more.appendChild(el('details', 'more', `<summary><span>Mehr zur Idee</span><small>Daten und Einstellungen · Annahme und Test</small></summary>`
      + `<div class="more-body"><div><h4>Daten und Einstellungen</h4><p>${s.daten}</p></div><div><h4>Annahme und Test</h4><p>${s.annahme}</p></div></div>`));
  }
  inner.appendChild(more);
  wrap.appendChild(inner); sec.appendChild(wrap);
  ST.push(st);
  return sec;
}

/* the station picture: one or more stages (crossfade, switch below), each a render, a KI image or a placeholder */
function stageRec(spec){
  if (spec.ki){
    const d = SD.ki[spec.ki], a = KI_ANCHORS[spec.ki] || {};
    if (d) return {kind:'ki', d:Object.assign({anchors:a}, d)};
    return {kind:'ph', ki:true, d:{w:1536, h:1024, anchors:{in:a.in, out:a.out}}, text:KI_PH[spec.ki] || 'Bild folgt'};
  }
  const d = SD.rooms[spec.room];
  if (d && !d.ph) return {kind:'room', d};
  return {kind:'ph', d:{w:(d && d.w) || 1420, h:(d && d.h) || 1214, anchors:{}}, text:'Rendering folgt', sub:spec.ph};
}
function buildFigure(st){
  const {s, i} = st;
  const fig = el('figure', 'room'); const frame = el('div', 'frame'); const box = el('div', 'box');
  const recs = (s.stages || []).map(stageRec); if (!recs.length) return;
  const R = Math.max(...recs.map(r => r.d.h / r.d.w));
  box.style.aspectRatio = `1 / ${R.toFixed(4)}`;
  const first = (s.moment || '').replace(/<[^>]+>/g, '').split(/(?<=[.!?])\s/)[0];
  recs.forEach((r, k) => {
    const sp = s.stages[k]; const sg = {k, r, d:r.d, kind:r.kind, hots:[]};
    const layerEl = el('div', 'stage' + (k === 0 ? ' on' : '')); if (k) { layerEl.inert = true; layerEl.setAttribute('aria-hidden', 'true'); }
    // stages fill the width; a flatter one is centred vertically in the box
    const hf = (r.d.h / r.d.w) / R;
    const zoomer = el('div', 'zoomer'); zoomer.style.height = (hf*100).toFixed(3) + '%'; zoomer.style.top = ((1 - hf)/2*100).toFixed(3) + '%';
    const layer = el('div', 'layer');
    if (r.kind === 'ph'){
      zoomer.appendChild(phFig(r.text, r.sub, r.ki));
    } else {
      const img = el('img'); img.src = r.d.img; img.width = r.d.w; img.height = r.d.h; img.decoding = 'async'; img.loading = i < 2 ? 'eager' : 'lazy';
      img.alt = s.title + (sp.l ? ' (' + sp.l + ')' : '') + (first ? ': ' + first : '');
      zoomer.appendChild(img); sg.img = img;
      if (r.d.mask){ const cv = el('canvas'); cv.width = r.d.mw || 10; cv.height = r.d.mh || 10; zoomer.appendChild(cv); sg.cv = cv; sg.ctx = cv.getContext('2d'); }
    }
    zoomer.appendChild(layer);
    if (r.kind !== 'ph'){
      (s.hots || []).forEach((h, hi) => {
        if (h.st && !h.st.includes(k)) return;
        const ah = anchorHit(r.d, h.a); if (!ah || !onImage(ah.p, .02)) return;
        const p = ah.p;
        const b = el('button', 'hot', `<i></i><span>${h.l}</span>`); b.type = 'button';
        b.dataset.side = (h.side === 'left' || p[0] > .72) ? 'left' : 'right';
        b.style.left = (p[0]*100) + '%'; b.style.top = (p[1]*100) + '%';
        b.setAttribute('aria-label', h.l + (h.note ? ': Notiz' : ': Nahaufnahme'));
        if (h.note) b.setAttribute('aria-expanded', 'false'); else b.setAttribute('aria-haspopup', 'dialog');
        b.addEventListener('click', e => { e.stopPropagation(); stopAuto(st); openHot(st, hi, b); });
        layer.appendChild(b); sg.hots.push({h, hi, b, p});
      });
      (s.bubbles || []).forEach((bu, bi) => {
        if (bu.st && !bu.st.includes(k)) return;
        const p = anchor(r.d, bu.a); if (!onImage(p, .02)) return;
        const e = el('div', 'bubble' + (bi ? ' second' : ''), bu.t); e.setAttribute('aria-hidden', 'true');
        e.style.left = (p[0]*100) + '%'; e.style.top = (p[1]*100) + '%';
        layer.appendChild(e);
      });
      zoomer.addEventListener('pointermove', e => { if (e.pointerType === 'touch' || MODAL.open || st.cur !== k) return; hover(st, sg, e); });
      zoomer.addEventListener('pointerleave', () => setHover(st, null));
      zoomer.addEventListener('click', e => { if (st.cur !== k) return; const j = hitAt(sg, e); if (j != null){ stopAuto(st); openHot(st, sg.hots[j].hi, sg.hots[j].b); } });
    }
    layerEl.appendChild(zoomer); box.appendChild(layerEl);
    Object.assign(sg, {el:layerEl, zoomer, layer}); st.stages.push(sg);
  });
  frame.appendChild(box); fig.appendChild(frame);
  // 16:15: the phone mock is the main element, beside Maren rather than on top of her
  if (s.phone && PHONES[s.phone] != null){
    const mh = anchor(recs[0].d, ['maren_head', 'sanne_head']);
    const ph = el('div', 'phone main' + (mh && mh[0] > .55 ? ' l' : ''), `<div class="scr">${PHONES[s.phone]}</div>`);
    frame.appendChild(ph); st.phoneEl = ph;
  }
  const tip = el('div', 'tip'); tip.hidden = true; fig.appendChild(tip);
  Object.assign(st, {fig, frame, box, tip});
  st.media.appendChild(fig);
  if (st.stages.length > 1) st.media.appendChild(buildSwitch(st));
}

/* ================================================================ stage switch (radio group) and auto-advance */
function buildSwitch(st){
  const n = st.stages.length; const labels = st.s.stages.map(sp => sp.l || '');
  const sw = el('div', 'stage-switch'); sw.setAttribute('role', 'radiogroup'); sw.setAttribute('aria-label', 'Bild: ' + labels.join(', '));
  const btns = labels.map((l, k) => {
    const b = el('button', '', `<span>${l}</span>`); b.type = 'button'; b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(k === 0)); b.tabIndex = k === 0 ? 0 : -1;
    b.addEventListener('click', () => { stopAuto(st); setStage(st, k); });
    sw.appendChild(b); return b;
  });
  sw.addEventListener('keydown', e => {
    const m = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key]; let k = null;
    if (m) k = (st.cur + m + n) % n; else if (e.key === 'Home') k = 0; else if (e.key === 'End') k = n - 1;
    if (k == null) return;
    e.preventDefault(); stopAuto(st); setStage(st, k); btns[k].focus();
  });
  st.switchBtns = btns; st.switchEl = sw;
  return sw;
}
function setStage(st, k){
  k = clamp(k, 0, st.stages.length - 1); if (k === st.cur) return;
  if (NOTE && NOTE.st === st) closeNote(true);
  setHover(st, null);
  st.stages.forEach((g, j) => { const on = j === k; g.el.classList.toggle('on', on); g.el.inert = !on; if (on) g.el.removeAttribute('aria-hidden'); else g.el.setAttribute('aria-hidden', 'true'); });
  st.cur = k;
  (st.switchBtns || []).forEach((b, j) => { b.setAttribute('aria-checked', String(j === k)); b.tabIndex = j === k ? 0 : -1; });
}
function startAuto(st){
  if (reduce || st.autoDone || st.stages.length < 2) return;
  st.autoDone = true; st.switchEl.classList.add('auto');
  st.autoT = setInterval(() => {
    if (MODAL.open || (NOTE && NOTE.st === st) || st.cur >= st.stages.length - 1){ stopAuto(st); return; }
    setStage(st, st.cur + 1);
  }, 2600);
}
function stopAuto(st){ if (!st) return; clearInterval(st.autoT); st.autoT = null; st.autoDone = true; if (st.switchEl) st.switchEl.classList.remove('auto'); }

/* ================================================================ swipe variants with a picture slot */
const VARS = [];
function buildVariants(list){
  const box = el('div', 'var hy'); const id = 'v' + (VARS.length + 1);
  box.innerHTML = `<div class="var-head"><h3 class="blk" id="${id}">Varianten zum Wischen</h3><span class="var-count" aria-hidden="true">1 / ${list.length}</span>`
    + `<button type="button" class="var-btn prev" aria-label="Vorherige Variante">${ICON.left}</button><button type="button" class="var-btn next" aria-label="Nächste Variante">${ICON.right}</button></div>`;
  const track = el('div', 'var-track'); track.tabIndex = 0; track.setAttribute('role', 'region'); track.setAttribute('aria-labelledby', id);
  const ul = el('ul');
  list.forEach(([t, x, img], j) => {
    const k = img && SD.ki[img];
    const pic = k ? `<span class="vimg"><img src="${k.img}" width="${k.w}" height="${k.h}" alt="" loading="lazy" decoding="async"></span>`
                  : `<span class="vimg ph p${j % 5 + 1}">${ICON.image}<small>Bild folgt</small></span>`;
    ul.appendChild(el('li', 'vcard' + (t === 'Inklusion' ? ' inkl' : ''), `${pic}<b>${t}</b><p>${x}</p>`));
  });
  track.appendChild(ul); box.appendChild(track);
  const cards = Array.from(ul.children); const prev = $('.prev', box), next = $('.next', box), cnt = $('.var-count', box);
  const base = () => cards[0].offsetLeft;
  const cur = () => { const sl = track.scrollLeft; let k = 0; cards.forEach((c, j) => { if (c.offsetLeft - base() <= sl + 8) k = j; }); return k; };
  const max = () => track.scrollWidth - track.clientWidth;
  const go = k => { k = clamp(k, 0, cards.length - 1); track.scrollTo({left:Math.min(cards[k].offsetLeft - base(), max()), behavior:reduce ? 'auto' : 'smooth'}); };
  const upd = () => {
    const end = track.scrollLeft >= max() - 4;
    cnt.textContent = (end ? cards.length : cur() + 1) + ' / ' + cards.length;
    prev.disabled = track.scrollLeft <= 2; next.disabled = end;
    track.classList.toggle('fade-r', !end); track.classList.toggle('fade-l', track.scrollLeft > 2);
  };
  prev.addEventListener('click', () => go(cur() - 1));
  next.addEventListener('click', () => go(cur() + 1));
  track.addEventListener('keydown', e => {
    const m = {ArrowRight:1, ArrowLeft:-1}[e.key];
    if (m){ e.preventDefault(); go(cur() + m); }
    else if (e.key === 'Home'){ e.preventDefault(); go(0); }
    else if (e.key === 'End'){ e.preventDefault(); go(cards.length - 1); }
  });
  let tk = false; track.addEventListener('scroll', () => { if (tk) return; tk = true; requestAnimationFrame(() => { tk = false; upd(); }); }, {passive:true});
  VARS.push(upd);
  return box;
}

/* Two gears that really mesh: same module m, pitch radii m*N/2, centre distance r1 + r2 plus a
   little backlash. Gear 2 starts half a tooth off along the centre line, so teeth sit in the gaps,
   and turns N1/N2 times as fast in the other direction (durations T and T*N2/N1). Checked offline:
   no overlap over a full mesh cycle. */
function gearPath(cx, cy, N, m, phase){
  const rp = m*N/2, ro = rp + .8*m, rr = rp - .95*m, hole = rp*.4, step = 2*Math.PI/N;
  const pt = (r, a) => (cx + r*Math.cos(a)).toFixed(2) + ' ' + (cy + r*Math.sin(a)).toFixed(2);
  const arc = (r, a0, a1, n) => { const o = []; for (let i = 1; i <= n; i++) o.push(pt(r, a0 + (a1 - a0)*i/n)); return o; };
  let d = 'M' + pt(rr, phase - step/2);
  for (let k = 0; k < N; k++){
    const c = phase + k*step;
    d += ' L' + arc(rr, c - step/2, c - .30*step, 3).join(' L');
    d += ' L' + pt(ro, c - .17*step) + ' L' + arc(ro, c - .17*step, c + .17*step, 4).join(' L');
    d += ' L' + pt(rr, c + .30*step) + ' L' + arc(rr, c + .30*step, c + step/2, 3).join(' L');
  }
  d += ' Z M' + pt(hole, 0) + ' A' + hole + ' ' + hole + ' 0 1 0 ' + pt(hole, Math.PI) + ' A' + hole + ' ' + hole + ' 0 1 0 ' + pt(hole, 0) + ' Z';
  return d;
}
function gearsSVG(){
  const N1 = 12, N2 = 8, m = 3.4, T = 10, th = -38*Math.PI/180;
  const c1 = [40, 57], dist = m*(N1 + N2)/2 + .8, c2 = [c1[0] + dist*Math.cos(th), c1[1] + dist*Math.sin(th)];
  const g = (c, N, ph, cls, t) => `<g class="${cls}" style="transform-origin:${c[0].toFixed(2)}px ${c[1].toFixed(2)}px;animation-duration:${t.toFixed(3)}s"><path fill="currentColor" fill-rule="evenodd" d="${gearPath(c[0], c[1], N, m, ph)}"/></g>`;
  return '<svg class="gears" viewBox="0 0 100 100" aria-hidden="true">' + g(c1, N1, th, 'gw1', T) + g(c2, N2, th + Math.PI + Math.PI/N2, 'gw2', T*N2/N1) + '</svg>';
}
ICON.gears = gearsSVG();

/* ================================================================ dots, labels and bubbles never overlap */
function fitStation(st){
  if (!st.fig || !st.fig.offsetParent) return;
  st.sec.classList.add('measuring');
  const live = st.sec.classList.contains('live'); if (!live) st.sec.classList.add('live');
  void st.sec.offsetWidth;
  // the 16:15 phone covers part of the picture on wide screens: keep labels and bubbles off it
  const phoneObs = st.phoneEl && getComputedStyle(st.phoneEl).position === 'absolute' ? [inflate(rect(st.phoneEl), 6)] : [];
  st.stages.forEach(sg => { if (sg.kind !== 'ph') fitStage(sg, phoneObs); });
  if (!live) st.sec.classList.remove('live');
  void st.sec.offsetWidth; st.sec.classList.remove('measuring');
}
function fitStage(sg, extraObs){
  const fb = rect(sg.zoomer);
  // 1. dots apart from each other (44px tap targets)
  const dots = [];
  sg.hots.forEach(o => {
    const b = o.b; b.style.marginLeft = ''; b.style.marginTop = '';
    const r0 = rect(b.querySelector('i'));
    const C = [[0,0],[0,34],[34,0],[-34,0],[0,-34],[30,30],[-30,30],[30,-30],[-30,-30],[0,60]];
    for (const [dx, dy] of C){
      const r = shift(r0, dx, dy); const cx = (r.left + r.right)/2, cy = (r.top + r.bottom)/2;
      if (cx < fb.left + 12 || cx > fb.right - 12 || cy < fb.top + 12 || cy > fb.bottom - 12) continue;
      if (dots.some(q => Math.hypot(q[0] - cx, q[1] - cy) < 40)) continue;
      if (dx || dy){ b.style.marginLeft = (dx - 22) + 'px'; b.style.marginTop = (dy - 22) + 'px'; }
      dots.push([cx, cy]); return;
    }
    dots.push([(r0.left + r0.right)/2, (r0.top + r0.bottom)/2]);
  });
  const dotRects = sg.hots.map(o => inflate(rect(o.b.querySelector('i')), 7));
  // 2. labels: right or left of the dot, inside the image, clear of dots and other labels; else hidden
  const labels = [];
  sg.hots.forEach((o, k) => {
    const b = o.b; const sp = b.querySelector('span'); b.classList.remove('nolabel');
    if (!sp || getComputedStyle(sp).display === 'none'){ return; }
    const order = b.dataset.side === 'left' ? [true, false] : [false, true];
    let ok = false;
    for (const left of order){
      b.classList.toggle('left', left);
      const r = rect(sp);
      if (r.left < fb.left + 4 || r.right > fb.right - 4 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      if (dotRects.some((q, j) => j !== k && hit(q, r))) continue;
      if (labels.some(q => hit(inflate(q, 3), r)) || extraObs.some(q => hit(q, r))) continue;
      labels.push(r); ok = true; break;
    }
    if (!ok) b.classList.add('nolabel');
  });
  const obs = dotRects.concat(labels, extraObs);
  // 3. speech bubbles: first free spot near the speaker, otherwise hidden
  sg.layer.querySelectorAll('.bubble').forEach(n => {
    n.classList.remove('nofit', 'below'); n.style.marginLeft = '0px'; n.style.marginTop = '0px'; n.style.removeProperty('--tail');
    if (getComputedStyle(n).display === 'none') return;
    let r0 = rect(n);
    if (r0.top < fb.top + 4){ n.classList.add('below'); r0 = rect(n); }
    const C = [[0,0],[0,-24],[-80,-12],[80,-12],[-120,6],[120,6],[0,-50],[-60,-44],[60,-44],[0,-80],[-150,-30],[150,-30],[-100,-70],[100,-70],[-190,0],[190,0],[0,-110],[-70,-110],[70,-110],[0,-140],[-90,-140],[90,-140]];
    let best = null;
    for (const [dx0, dy] of C){
      let r = shift(r0, dx0, dy); let dx = dx0;
      if (r.left < fb.left + 4) dx += fb.left + 4 - r.left; else if (r.right > fb.right - 4) dx -= r.right - fb.right + 4;
      r = shift(r0, dx, dy);
      if (r.left < fb.left + 2 || r.right > fb.right - 2 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      if (obs.some(o => hit(o, r))) continue;
      best = [dx, dy, r]; break;
    }
    if (!best){ n.classList.add('nofit'); return; }
    const [dx, dy, r] = best;
    n.style.marginLeft = dx + 'px'; n.style.marginTop = dy + 'px';
    const bw = r0.right - r0.left; n.style.setProperty('--tail', clamp(bw/2 - dx, 16, bw - 16) + 'px');
    obs.push(inflate(r, 4));
  });
}

/* ================================================================ hover masks (one per stage) */
function loadMask(sg){
  if (sg.mask || !sg.d.mask || !sg.d.colors || !sg.ctx) return; sg.mask = {ready:false};
  const im = new Image();
  im.onload = () => {
    const W = sg.d.mw, H = sg.d.mh; const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d', {willReadFrequently:true}); x.drawImage(im, 0, 0, W, H);
    const px = x.getImageData(0, 0, W, H).data; const k2h = {}; const hidIdx = {}; const hids = [null];
    Object.keys(sg.d.colors).forEach(h => { const [r, g, b] = sg.d.colors[h]; const i = hids.length; hids.push(h); hidIdx[h] = i; k2h[(r>>5) + 8*(g>>5) + 64*(b>>6)] = i; });
    const lab = new Uint8Array(W*H);
    for (let p = 0, q = 0; p < lab.length; p++, q += 4){ if (px[q+3] < 128) continue; const i = k2h[(px[q]>>5) + 8*(px[q+1]>>5) + 64*(px[q+2]>>6)]; if (i) lab[p] = i; }
    Object.assign(sg.mask, {ready:true, lab, W, H, hids, hidIdx, cache:{}});
  };
  im.src = sg.d.mask;
}
function hitAt(sg, e){
  const m = sg.mask; if (!m || !m.ready) return null;
  const r = sg.zoomer.getBoundingClientRect(); const u = (e.clientX - r.left)/r.width, v = (e.clientY - r.top)/r.height;
  if (u < 0 || v < 0 || u >= 1 || v >= 1) return null;
  const hid = m.hids[m.lab[Math.floor(v*m.H)*m.W + Math.floor(u*m.W)]];
  if (!hid) return null;
  const k = sg.hots.findIndex(o => arr(o.h.hid).includes(hid)); return k >= 0 ? k : null;
}
function outline(sg, hid){
  const m = sg.mask; if (m.cache[hid]) return m.cache[hid];
  const k = m.hidIdx[hid], W = m.W, H = m.H, L = m.lab;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const img = x.createImageData(W, H); const d = img.data;
  const t = document.createElement('canvas').getContext('2d'); t.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--spot').trim() || '#c3405d'; t.fillRect(0, 0, 1, 1); const [R, G, B] = t.getImageData(0, 0, 1, 1).data;
  const w = 2;
  for (let y = w; y < H - w; y++) for (let xx = w; xx < W - w; xx++){
    const p = y*W + xx; if (L[p] !== k) continue;
    const edge = L[p-w] !== k || L[p+w] !== k || L[p-w*W] !== k || L[p+w*W] !== k;
    const q = p*4; d[q] = R; d[q+1] = G; d[q+2] = B; d[q+3] = edge ? 255 : 46;
  }
  x.putImageData(img, 0, 0); m.cache[hid] = c; return c;
}
function hover(st, sg, e){ loadMask(sg); setHover(st, hitAt(sg, e), e, sg); }
function setHover(st, k, e, sg){
  if (!st.fig) return;
  sg = sg || st.stages[st.cur];
  const key = k == null ? null : sg.k + ':' + k;
  if (key !== st.hk){
    st.stages.forEach(g => { if (g.ctx) g.ctx.clearRect(0, 0, g.cv.width, g.cv.height); });
    st.hk = key;
    if (k != null && sg.mask && sg.mask.ready && sg.ctx){ const hid = arr(sg.hots[k].h.hid).find(h => h in sg.mask.hidIdx); if (hid) sg.ctx.drawImage(outline(sg, hid), 0, 0); }
    st.fig.classList.toggle('hovering', k != null);
  }
  if (k != null && e){
    const r = st.fig.getBoundingClientRect(); const h = sg.hots[k].h;
    st.tip.innerHTML = h.l + `<small>${h.note ? 'Notiz' : 'Nahaufnahme'}</small>`;
    st.tip.style.left = (e.clientX - r.left) + 'px'; st.tip.style.top = (e.clientY - r.top) + 'px'; st.tip.hidden = false;
  } else st.tip.hidden = true;
}

/* ================================================================ tap points: notes pop up on the picture, close-ups open the modal */
function openHot(st, hi, trigger){
  const h = st.s.hots[hi]; if (!h) return;
  if (h.note) openNote(st, hi, trigger); else if (h.d && DETAILS[h.d]) openCloseup(st, hi, trigger);
}
let NOTE = null;
function openNote(st, hi, trigger){
  const again = NOTE && NOTE.st === st && NOTE.hi === hi;
  closeNote(true); if (again) return;   // a second tap on the same point closes it
  const h = st.s.hots[hi];
  let sg = st.stages[st.cur], o = sg.hots.find(x => x.hi === hi);
  if (!o){ const k = st.stages.findIndex(g => g.hots.some(x => x.hi === hi)); if (k >= 0){ setStage(st, k); sg = st.stages[k]; o = sg.hots.find(x => x.hi === hi); } }
  setHover(st, null);
  const id = st.s.id + '-n' + hi;
  const pop = el('div', 'npop'); pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-labelledby', id);
  pop.innerHTML = `<div class="np-head"><span class="kicker">Notiz</span><b id="${id}">${h.l}</b></div><p>${h.note}</p>`;
  const x = el('button', 'np-close', ICON.close); x.type = 'button'; x.setAttribute('aria-label', 'Notiz schließen');
  x.addEventListener('click', () => closeNote());
  pop.querySelector('.np-head').appendChild(x);
  st.fig.appendChild(pop);
  NOTE = {st, hi, el:pop, trigger, dot:o ? o.b : null};
  if (o) o.b.classList.add('active');
  [st.chips[hi], o && o.b].forEach(b => { if (b){ b.classList.add('on'); b.setAttribute('aria-expanded', 'true'); } });
  placeNote();
  x.focus({preventScroll:true});
}
function placeNote(){
  if (!NOTE) return;
  const {st, el:pop, dot} = NOTE; const fr = rect(st.box || st.fig); const fw = fr.right - fr.left, fh = fr.bottom - fr.top;
  const w = Math.min(320, fw - 16); pop.style.width = w + 'px';
  const ph = pop.offsetHeight;
  let cx = fw/2, cy = fh*.75, top;
  if (dot){ const r = rect(dot); cx = (r.left + r.right)/2 - fr.left; cy = (r.top + r.bottom)/2 - fr.top; }
  const left = clamp(cx - w/2, 8, Math.max(8, fw - w - 8));
  if (!dot) top = fh - ph - 12;
  else if (cy < fh*.55) top = cy + 28; else top = cy - 28 - ph;
  top = clamp(top, 8, Math.max(8, fh - ph - 8));
  pop.style.left = left + 'px'; pop.style.top = top + 'px';
}
function closeNote(quiet){
  if (!NOTE) return;
  const {st, hi, el:pop, trigger, dot} = NOTE; NOTE = null;
  pop.remove(); if (dot) dot.classList.remove('active');
  [st.chips[hi], dot].forEach(b => { if (b){ b.classList.remove('on'); b.setAttribute('aria-expanded', 'false'); } });
  if (!quiet && trigger && document.contains(trigger)) trigger.focus({preventScroll:true});
}
document.addEventListener('pointerdown', e => { if (NOTE && !NOTE.el.contains(e.target) && !(NOTE.trigger && NOTE.trigger.contains(e.target))) closeNote(true); }, true);

/* ================================================================ modal: close-ups, x-ray, tiles */
const MODAL = {el:$('#modal'), dialog:$('#m-dialog'), kicker:$('#m-kicker'), title:$('#m-title'), body:$('#m-body'), close:$('#m-close'), open:false, token:0};
function lockScroll(){
  const de = document.documentElement, w0 = de.clientWidth;
  de.classList.add('modal-open');
  const dw = de.clientWidth - w0; if (dw > 0) document.body.style.paddingRight = dw + 'px';   // the scrollbar went away: keep the width
}
function unlockScroll(){ document.documentElement.classList.remove('modal-open'); document.body.style.paddingRight = ''; }
function openModal(o){
  const M = MODAL; if (!M.el) return;
  if (M.open) closeModal(true);
  closeNote(true);
  M.trigger = o.trigger || document.activeElement; M.y = scrollY; M.onClose = o.onClose; M.onKey = o.onKey; M.token++;
  lockScroll();
  ['#top', '#flow'].forEach(s => { const n = $(s); if (n) n.inert = true; });
  M.kicker.textContent = o.kicker || ''; M.title.innerHTML = o.title || '';
  M.dialog.className = 'm-dialog' + (o.cls ? ' ' + o.cls : '');
  M.body.innerHTML = ''; M.el.hidden = false; M.open = true;
  o.build(M.body); M.body.scrollTop = 0;
  void M.el.offsetWidth; M.el.classList.add('on');
  M.close.focus({preventScroll:true});
  if (o.after) requestAnimationFrame(() => { if (M.open) o.after(); });
}
function closeModal(quiet){
  const M = MODAL; if (!M.open) return;
  M.open = false; const tok = ++M.token;
  safe('modal close', () => { if (M.onClose) M.onClose(); });
  M.onClose = null; M.onKey = null;
  M.el.classList.remove('on');
  const done = () => { if (tok !== M.token || M.open) return; M.el.hidden = true; M.body.innerHTML = ''; };
  if (reduce || quiet) done(); else setTimeout(done, 200);
  ['#top', '#flow'].forEach(s => { const n = $(s); if (n) n.inert = false; });
  unlockScroll();
  if (Math.abs(scrollY - M.y) > 0.5) scrollTo(0, M.y);
  if (!quiet && M.trigger && document.contains(M.trigger)) M.trigger.focus({preventScroll:true});
}
if (MODAL.el){
  MODAL.close.addEventListener('click', () => closeModal());
  // a click on the milky veil (not a drag that ended there) closes
  let downOnVeil = false;
  MODAL.el.addEventListener('pointerdown', e => { downOnVeil = !MODAL.dialog.contains(e.target); });
  MODAL.el.addEventListener('click', e => { if (downOnVeil && !MODAL.dialog.contains(e.target)) closeModal(); downOnVeil = false; });
  MODAL.el.addEventListener('keydown', e => {
    if (e.key === 'Tab'){
      const f = $$('a[href],button:not([disabled]),summary,input,select,textarea,[tabindex]:not([tabindex="-1"])', MODAL.dialog).filter(n => n.offsetParent !== null && !n.closest('[inert]'));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1], a = document.activeElement;
      if (e.shiftKey && (a === first || !MODAL.dialog.contains(a) || a === MODAL.dialog)){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && a === last){ e.preventDefault(); first.focus(); }
      return;
    }
    if (MODAL.onKey) MODAL.onKey(e);
  });
}

/* ---------------------------------------------------------------- close-up ("Nahaufnahme"), five steps */
let CU = null;
function openCloseup(st, hi, trigger){
  const h = st.s.hots[hi]; const D = DETAILS[h.d]; if (!D) return;
  openModal({kicker:'Nahaufnahme', title:D.title, cls:'m-detail', trigger,
    build(body){
      const wrap = el('div', 'd-body');
      const stage = el('div', 'd-stage'); const i1 = el('img', 'off'), i2 = el('img', 'off'); i1.alt = ''; i2.alt = '';
      const ph = el('div', 'd-ph'); ph.hidden = true;
      const sv = svg('svg', {class:'ov', viewBox:'0 0 1400 1008', preserveAspectRatio:'none', 'aria-hidden':'true'}); const lay = el('div', 'layer');
      stage.append(i1, i2, ph, sv, lay);
      const steps = el('div', 'd-steps'); const dots = el('ol', 'd-dots'); const extra = el('div', 'd-extra'); const text = el('div', 'd-text'); text.setAttribute('aria-live', 'polite');
      const nav = el('div', 'd-nav', '<button type="button" class="prev">Zurück</button><button type="button" class="next">Weiter</button><button type="button" class="auto" aria-pressed="false">Abspielen</button>');
      D.steps.forEach((s, j) => { const li = el('li'); const b = el('button', '', String(j + 1)); b.type = 'button'; b.setAttribute('aria-label', 'Schritt ' + (j + 1)); b.addEventListener('click', () => showStep(CU, j)); li.appendChild(b); dots.appendChild(li); });
      steps.append(dots, extra, text, nav); wrap.append(stage, steps); body.appendChild(wrap);
      CU = {st, d:h.d, D, step:h.step || 0, stage, imgs:[i1, i2], cur:null, ph, sv, lay, dots, extra, text, nav, auto:null};
      nav.querySelector('.prev').addEventListener('click', () => showStep(CU, CU.step - 1));
      nav.querySelector('.next').addEventListener('click', () => { const n = D.steps.length; showStep(CU, CU.step + 1 < n ? CU.step + 1 : 0); });
      nav.querySelector('.auto').addEventListener('click', e => toggleAuto(CU, e.currentTarget));
      showStep(CU, CU.step, true);
    },
    onKey(e){
      if (!CU || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight'){ e.preventDefault(); showStep(CU, Math.min(CU.step + 1, CU.D.steps.length - 1)); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); showStep(CU, Math.max(CU.step - 1, 0)); }
    },
    after(){ if (CU) resolveStage(CU); },
    onClose(){ if (CU) clearInterval(CU.auto); CU = null; }});
}
function toggleAuto(O, btn){
  if (O.auto){ clearInterval(O.auto); O.auto = null; btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Abspielen'; return; }
  btn.setAttribute('aria-pressed', 'true'); btn.textContent = 'Pause';
  O.auto = setInterval(() => {
    if (CU !== O){ clearInterval(O.auto); return; }
    const n = O.D.steps.length;
    if (O.step >= n - 1){ clearInterval(O.auto); O.auto = null; btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Abspielen'; return; }
    showStep(O, O.step + 1);
  }, 5600);
}
function showStep(O, j, first){
  if (!O) return;
  const steps = O.D.steps; j = clamp(j, 0, steps.length - 1); O.step = j;
  const s = steps[j];
  const I = imgData(s.img, s.need) || {data:{w:1400, h:1008, anchors:{}}, ph:true, text:'Rendering folgt'};
  const data = I.data;
  let zoom = null;
  if (I.room && s.zoom){ const zp = anchor(data, s.zoom[0]); if (zp) zoom = [zp, s.zoom[1]]; }
  const [a, b] = O.imgs;
  const apply = im => {
    im.style.objectFit = I.room ? 'contain' : 'cover';
    if (zoom){ im.style.transformOrigin = `${zoom[0][0]*100}% ${zoom[0][1]*100}%`; im.style.transform = `scale(${zoom[1]})`; }
    else { im.style.transform = ''; im.style.transformOrigin = ''; }
  };
  if (I.ph){
    O.ph.innerHTML = ''; O.ph.appendChild(phFig(I.text, null, I.ki)); O.ph.hidden = false;
    [a, b].forEach(im => im.classList.replace('on', 'off')); O.cur = null;
  } else {
    O.ph.hidden = true;
    if (!O.cur){ const im = a; im.src = data.img; apply(im); im.classList.replace('off', 'on'); b.classList.replace('on', 'off'); O.cur = im; }
    else if (O.cur.getAttribute('src') !== data.img){ const nxt = O.cur === a ? b : a; nxt.src = data.img; apply(nxt); nxt.classList.replace('off', 'on'); O.cur.classList.replace('on', 'off'); O.cur = nxt; }
    else apply(O.cur);
  }
  O.sv.setAttribute('viewBox', `0 0 ${data.w} ${data.h}`);
  O.stage.style.aspectRatio = `${data.w}/${data.h}`;
  O.dots.querySelectorAll('button').forEach((bt, k) => { bt.setAttribute('aria-current', String(k === j)); if (k <= j) bt.classList.add('seen'); });
  O.text.innerHTML = (s.ev ? '<span class="ev">Woran wir merken würden, ob es wirkt</span>' : '') + `<p>${s.t}</p>`
    + (s.src ? `<p class="d-src"><a href="${s.src[1]}">Quelle: ${s.src[0]}</a></p>` : '');
  O.nav.querySelector('.prev').disabled = j === 0;
  O.nav.querySelector('.next').textContent = j === steps.length - 1 ? 'Von vorn' : 'Weiter';
  // overlays
  O.sv.innerHTML = ''; O.lay.innerHTML = ''; O.extra.innerHTML = '';
  const W = data.w, H = data.h;
  const P = names => { const p = anchor(data, names); if (!p) return null; const q = zoom ? [zoom[0][0] + (p[0] - zoom[0][0])*zoom[1], zoom[0][1] + (p[1] - zoom[0][1])*zoom[1]] : p; return onImage(q, 0) ? q : null; };
  const at = (e, p, dx, dy) => { e.style.left = `calc(${p[0]*100}% + ${dx || 0}px)`; e.style.top = `calc(${p[1]*100}% + ${dy || 0}px)`; };
  const inline = (O.stage.offsetWidth || 0) < 560;
  (s.ov || []).forEach(o => {
    if (o.pulse){ const p = P(o.pulse); if (p){ const e = el('div', 'pulse'); at(e, p); O.lay.appendChild(e); } }
    else if (o.chip){ const p = P(o.chip) || o.at; if (p){ const e = el('div', 'dchip' + (o.cls ? ' ' + o.cls : ''), o.t); e.dataset.side = o.side || ''; at(e, p, 0, o.dy); O.lay.appendChild(e); } }
    else if (o.bubble){ const p = P(o.bubble); if (p){ const e = el('div', 'bubble', o.t); at(e, p); if (o.d) e.style.animationDelay = o.d + 's'; O.lay.appendChild(e); } }
    else if (o.phone != null && PHONES[o.phone] != null){ const e = el('div', 'phone' + (o.phone === 'aus' ? ' off' : ''), `<div class="scr">${PHONES[o.phone]}</div>`); (inline ? O.extra : O.lay).appendChild(e); }
    else if (o.cube){ const p = P(o.cube); if (p){ const e = el('div', 'pw' + (o.to === 'frage' ? ' still' : ''), '<i class="a">?</i><i class="b"></i>'); at(e, p, 0, o.dy == null ? -58 : o.dy); O.lay.appendChild(e); } }
    else if (o.air){
      // draught: wavy lines from the window across the room, sized to the image
      const p = P(o.air); if (p){
        const dir = p[0] > .5 ? -1 : 1, wl = W*.07*dir, amp = H*.025, n = 6;
        for (let k = 0; k < 3; k++){
          const x0 = p[0]*W - dir*W*.02, y0 = p[1]*H + (k - .5)*H*.09;
          let d = `M${x0.toFixed(1)},${y0.toFixed(1)}`;
          for (let i = 0; i < n; i++) d += ` q${(wl/4).toFixed(1)},${(-amp).toFixed(1)} ${(wl/2).toFixed(1)},0 t${(wl/2).toFixed(1)},0`;
          const pa = svg('path', {d, class:'wire air'}, O.sv); pa.style.animationDuration = (1.2 + k*.25) + 's';
        }
      }
    }
    else if (o.cloud){
      const p = P(o.cloud); const c = el('div', 'xcloud', `${ICON.cloud}<span>${o.t}</span>`); c.style.left = '4%'; c.style.top = '5%'; O.lay.appendChild(c);
      if (p){ const x = p[0]*W, y = p[1]*H; const cx = .04*W + 90, cy = .05*H + 40; const dd = `M${cx},${cy} Q${(cx + x)/2},${Math.min(cy, y) - 40} ${x},${y}`; svg('path', {d:dd, class:'halo'}, O.sv); svg('path', {d:dd, class:'wire'}, O.sv); }
    }
    else if (o.ring){ const pts = data.paths && data.paths[o.ring]; if (pts && !zoom){ ringAnim(O.sv, pts.map(p => [p[0]*W, p[1]*H]), o.dur || 5, o.done); } }
  });
  if (!first) requestAnimationFrame(() => resolveStage(O));
}
/* chips, bubbles, the cloud and the Planwürfel stay inside the image and apart; never overlap */
function resolveStage(O, later){
  if (!O || !O.stage || !O.stage.offsetParent) return;
  // measure final sizes: right after a step change restart the pop-in, on later passes just finish it
  $$('.dchip,.bubble,.xcloud,.pw,.phone', O.lay).forEach(n => { if (later) n.getAnimations().forEach(a => { if (a.animationName !== 'flipA' && a.animationName !== 'flipB') a.finish(); }); else n.style.animation = 'none'; });
  void O.stage.offsetWidth;
  const box = rect(O.stage);
  const placed = $$('.phone', O.lay).map(n => inflate(rect(n), 4));
  $$('.pulse', O.lay).forEach(n => placed.push(inflate(rect(n), -14)));
  $$('.xcloud,.pw,.dchip,.bubble', O.lay).forEach(n => {
    n.hidden = false; n.style.marginLeft = ''; n.style.marginTop = ''; n.classList.remove('below'); n.style.removeProperty('--tail');
    let r0 = rect(n);
    if (n.classList.contains('bubble') && r0.top < box.top + 4){ n.classList.add('below'); r0 = rect(n); }
    const w = r0.right - r0.left;
    const side = n.dataset.side === 'left' ? -1 : (n.dataset.side === 'right' ? 1 : 0);
    const C = side ? [[side*(w/2 + 40), 0], [side*(w/2 + 40), -30], [side*(w/2 + 40), 30], [-side*(w/2 + 40), 0], [0, -40], [0, 40]]
                   : [[0,0],[0,-30],[0,30],[-60,0],[60,0],[0,-60],[0,60],[-90,-30],[90,-30],[-90,30],[90,30],[0,-90],[0,90],[-140,0],[140,0]];
    let best = null;
    for (const [dx0, dy0] of C){
      let dx = dx0, dy = dy0; let r = shift(r0, dx, dy);
      if (r.left < box.left + 6) dx += box.left + 6 - r.left; else if (r.right > box.right - 6) dx -= r.right - box.right + 6;
      if (r.top < box.top + 4) dy += box.top + 4 - r.top; else if (r.bottom > box.bottom - 4) dy -= r.bottom - box.bottom + 4;
      r = shift(r0, dx, dy);
      if (r.left < box.left + 2 || r.right > box.right - 2 || r.top < box.top + 2 || r.bottom > box.bottom - 2) continue;
      if (placed.some(q => hit(q, r))) continue;
      best = [dx, dy, r]; break;
    }
    if (!best){ n.hidden = true; return; }
    const [dx, dy, r] = best;
    n.style.marginLeft = dx + 'px'; n.style.marginTop = dy + 'px';
    if (n.classList.contains('bubble')) n.style.setProperty('--tail', clamp(w/2 - dx, 16, w - 16) + 'px');
    placed.push(inflate(r, 4));
  });
  if (!later) $$('.dchip,.bubble,.xcloud,.pw,.phone', O.lay).forEach(n => { n.style.animation = ''; });
}
function ringAnim(sv, pts, dur, done){
  const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  const id = 'r' + Math.random().toString(36).slice(2, 7);
  svg('path', {d, fill:'none', stroke:'rgba(40,30,20,.28)', 'stroke-width':20, 'stroke-linecap':'round'}, sv);
  const prog = svg('path', {d, id, fill:'none', stroke:done ? '#2fbf6b' : '#46d27f', 'stroke-width':13, 'stroke-linecap':'round'}, sv);
  const L = prog.getTotalLength(); prog.style.strokeDasharray = L; prog.style.strokeDashoffset = done ? 0 : L;
  if (!done && !reduce){ prog.animate([{strokeDashoffset:L}, {strokeDashoffset:0}], {duration:dur*1000, iterations:Infinity, easing:'linear'}); }
  else if (!done) prog.style.strokeDashoffset = 0;
  const bug = svg('g', {}, sv);
  svg('ellipse', {rx:24, ry:19, fill:'#d8342c', stroke:'#2a1a12', 'stroke-width':3}, bug);
  svg('line', {x1:-22, y1:0, x2:22, y2:0, stroke:'#2a1a12', 'stroke-width':3}, bug);
  svg('circle', {r:10, cx:24, cy:0, fill:'#2a1a12'}, bug);
  [[-9,-9],[-9,9],[7,-10],[7,10]].forEach(([x, y]) => svg('circle', {r:4.5, cx:x, cy:y, fill:'#2a1a12'}, bug));
  if (!reduce && !done){ const am = svg('animateMotion', {dur:dur + 's', repeatCount:'indefinite', rotate:'auto'}, bug); const mp = svg('mpath', {}, am); mp.setAttribute('href', '#' + id); }
  else bug.setAttribute('transform', `translate(${pts[pts.length - 1][0]},${pts[pts.length - 1][1]})`);
}

/* ---------------------------------------------------------------- x-ray ("Was steckt dahinter?"): numbers on the picture, texts beside it */
let XR = null;
function openXray(st, trigger){
  const X = st.s.xray; if (!X) return;
  const k = X.stage != null && st.stages[X.stage] ? X.stage : st.cur;
  const sg = st.stages[k] || st.stages[0];
  openModal({kicker:'Was steckt dahinter?', title:st.s.title, cls:'m-xray', trigger,
    build(body){
      const wrap = el('div', 'x-body');
      const fig = el('figure', 'room xray x-fig'); const zoomer = el('div', 'zoomer');
      const d = sg ? sg.d : {w:1420, h:1214, anchors:{}};
      zoomer.style.aspectRatio = `${d.w}/${d.h}`;
      if (!sg || sg.kind === 'ph') zoomer.appendChild(phFig(sg ? sg.r.text : 'Rendering folgt', sg && sg.r.sub, sg && sg.r.ki));
      else { const img = el('img'); img.src = d.img; img.alt = ''; img.width = d.w; img.height = d.h; zoomer.appendChild(img); }
      const ov = svg('svg', {class:'ov', viewBox:`0 0 ${d.w} ${d.h}`, preserveAspectRatio:'none', 'aria-hidden':'true'}); const layer = el('div', 'layer');
      zoomer.append(ov, layer); fig.appendChild(zoomer);
      const side = el('div', 'x-side');
      const list = el('ol', 'xlist');
      X.items.filter(it => it.n).sort((a, b) => a.n - b.n).forEach(it => {
        const body = it.calc ? `<b>Rechnung</b><dl class="calc">${it.calc.map(r => `<div><dt>${r}</dt><dd>Wert folgt</dd></div>`).join('')}</dl>` : it.t;
        const li = el('li', '', `<span>${it.n}</span><div>${body}</div>`); li.dataset.n = it.n;
        li.addEventListener('mouseenter', () => markX(it.n, true)); li.addEventListener('mouseleave', () => markX(it.n, false));
        list.appendChild(li);
      });
      side.appendChild(list); wrap.append(fig, side); body.appendChild(wrap);
      XR = {st, X, d, fig, zoomer, ov, layer, list};
    },
    after(){ if (XR) drawXray(XR); },
    onClose(){ XR = null; }});
}
function markX(n, on){
  if (!XR) return;
  XR.layer.querySelectorAll(`.xr[data-n="${n}"]`).forEach(e => e.classList.toggle('hl', on));
  XR.list.querySelectorAll(`li[data-n="${n}"]`).forEach(e => e.classList.toggle('hl', on));
}
function drawXray(R){
  if (!R || !R.zoomer.offsetWidth) return;
  R.ov.querySelectorAll('.xr').forEach(n => n.remove());
  R.layer.querySelectorAll('.xr').forEach(n => n.remove());
  const {d, X} = R; const W = d.w, H = d.h;
  const fw = R.zoomer.offsetWidth || 1, fh = R.zoomer.offsetHeight || 1;
  const toFrac = f => [clamp(f[0]*fw, 30, fw - 30)/fw, clamp(f[1]*fh, 30, fh - 30)/fh];
  const hub = toFrac(X.hub); const ext = X.ext ? toFrac(X.ext.at) : null;
  const g = svg('g', {class:'xr'}, R.ov);
  const wire = (a, b, out) => {
    const ax = a[0]*W, ay = a[1]*H, bx = b[0]*W, by = b[1]*H; const mx = (ax + bx)/2, my = Math.min(ay, by) - H*.08;
    const dd = `M${ax.toFixed(1)},${ay.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`;
    svg('path', {d:dd, class:'halo'}, g); svg('path', {d:dd, class:'wire' + (out ? ' out' : '')}, g);
  };
  const place = (n, f) => { n.style.left = (f[0]*100) + '%'; n.style.top = (f[1]*100) + '%'; R.layer.appendChild(n); return n; };
  const icons = [], nodes = [];
  let hubN = null, extN = null;
  X.items.forEach(it => {
    if (it.hub){ if (it.n) hubN = it.n; return; }
    if (it.ext){ if (ext) wire(ext, hub, it.dir === 'out'); if (it.n) extN = it.n; return; }
    if (it.calc) return;
    const p = anchor(d, it.a); if (!onImage(p, 0)) return;
    if (it.dir) wire(p, hub, it.dir === 'out');   // no direction: a property of the object, no data flow
    if (it.n){ const n = el('div', 'xnode xr', String(it.n)); n.dataset.n = it.n; nodes.push(place(n, p)); }
  });
  const hb = el('div', 'xicon xr xgears', ICON.gears + (hubN ? `<span class="xn">${hubN}</span>` : '')); if (hubN) hb.dataset.n = hubN; icons.push(place(hb, hub));
  if (ext){ const eb = el('div', 'xicon xr', (ICON[X.ext.icon] || ICON.cloud) + (extN ? `<span class="xn">${extN}</span>` : '')); if (extN) eb.dataset.n = extN; icons.push(place(eb, ext)); }
  // numbers never overlap each other or the icons
  const placed = icons.map(n => inflate(rect(n), 2)); const fb = rect(R.zoomer);
  nodes.forEach(n => {
    const r0 = rect(n);
    const C = [[0,0],[0,-30],[30,0],[-30,0],[0,30],[30,-30],[-30,-30],[30,30],[-30,30],[0,-60],[60,0],[-60,0]];
    for (const [dx, dy] of C){
      const r = shift(r0, dx, dy);
      if (r.left < fb.left + 2 || r.right > fb.right - 2 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      if (placed.some(q => hit(inflate(q, 3), r))) continue;
      if (dx || dy){ n.style.marginLeft = dx + 'px'; n.style.marginTop = dy + 'px'; }
      placed.push(r); return;
    }
    placed.push(r0);
  });
}

/* ---------------------------------------------------------------- tiles ("Hintergründe") */
function openTile(id, trigger){
  const node = document.getElementById('tile-' + id); if (!node) return;
  const store = node.parentNode;
  openModal({kicker:'Hintergrund', title:node.dataset.title || '', cls:'m-tile', trigger,
    build(body){ body.appendChild(node); node.hidden = false; },
    onClose(){ node.hidden = true; store.appendChild(node); }});
}
function setupTiles(){ $$('[data-tile]').forEach(b => b.addEventListener('click', () => openTile(b.dataset.tile, b))); }
/* card sets: the whole card opens "Mehr" */
function setupCards(){
  $$('.kcard').forEach(c => {
    const det = $('details.mehr', c); if (!det) return;
    c.classList.add('has-more');
    c.addEventListener('click', e => { if (e.target.closest('a, summary, button, details > div')) return; det.open = !det.open; });
  });
  $$('#flow details').forEach(d => d.addEventListener('toggle', () => requestLayout()));
}
/* Weg einer Idee: stepper */
function setupWeg(){
  const weg = $('#weg'); if (!weg) return;
  const track = $('.weg-track', weg), nav = $('.weg-nav', weg); const nodes = $$('.weg-node', weg), steps = $$('.weg-steps li', weg);
  if (!nodes.length || nodes.length !== steps.length) return;
  weg.classList.add('js'); track.hidden = false; nav.hidden = false;
  const prev = $('.prev', nav), next = $('.next', nav), auto = $('.auto', nav); let cur = 0, timer = null;
  const roleCards = $$('#roles .kcard[data-role]');
  nodes.forEach((n, j) => n.setAttribute('aria-label', 'Schritt ' + (j + 1) + ': ' + n.textContent.trim()));
  const show = i => {
    cur = clamp(i, 0, steps.length - 1);
    nodes.forEach((n, j) => { n.setAttribute('aria-current', j === cur ? 'step' : 'false'); n.classList.toggle('done', j < cur); });
    steps.forEach((s, j) => s.classList.toggle('on', j === cur));
    track.style.setProperty('--k', cur / (steps.length - 1));
    prev.disabled = cur === 0; next.textContent = cur === steps.length - 1 ? 'Von vorn' : 'Weiter';
    const roles = (steps[cur].dataset.roles || '').split(' ');
    roleCards.forEach(c => c.classList.toggle('lit', c.dataset.role.split(' ').some(r => roles.includes(r))));
  };
  const stopW = () => { clearInterval(timer); timer = null; auto.setAttribute('aria-pressed', 'false'); auto.textContent = 'Abspielen'; };
  nodes.forEach((n, j) => n.addEventListener('click', () => { stopW(); show(j); }));
  prev.addEventListener('click', () => { stopW(); show(cur - 1); });
  next.addEventListener('click', () => { stopW(); show(cur + 1 < steps.length ? cur + 1 : 0); });
  auto.addEventListener('click', () => {
    if (timer){ stopW(); return; }
    auto.setAttribute('aria-pressed', 'true'); auto.textContent = 'Pause';
    if (cur === steps.length - 1) show(0);
    timer = setInterval(() => { if (cur >= steps.length - 1 || !weg.offsetParent){ stopW(); return; } show(cur + 1); }, 5200);
  });
  weg.addEventListener('keydown', e => {
    if (e.target.closest('.weg-track') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')){
      e.preventDefault(); e.stopPropagation(); stopW(); show(cur + (e.key === 'ArrowRight' ? 1 : -1)); nodes[cur].focus();
    }
  });
  show(0);
}

/* ================================================================ thread */
const flow = $('#flow'), thread = $('#thread'), nowT = $('#now-t'), nowL = $('#now-l'), prog = $('#prog');
let TH = null, lastProg = '';
// The dashed route and the knots live in #thread and are not touched while scrolling. Two more layers carry what moves:
//  - .thread-clip: the coloured line, drawn once in full; scrolling only changes the height of its clip.
//  - .thread-rail: a box as long as the route, with Mila in it. She is position:sticky at 58% of the viewport, so the browser keeps her
//    there while it scrolls, on the compositor, whatever the main thread is doing. JS only slides her sideways (the detours into the rooms).
const clip = el('div', 'thread-clip'), doneSvg = svg('svg', {class:'thread'}, clip);
const rail = el('div', 'thread-rail'), headBox = el('div', 'thread-head'), headEl = svg('svg', {viewBox:'-16 -16 32 32'}, headBox);
rail.appendChild(headBox); thread.after(clip); clip.after(rail); [clip, rail].forEach(e => e.setAttribute('aria-hidden', 'true'));
{
  const head = svg('g', {}, headEl);
  svg('circle', {r:13, style:'fill:var(--card);stroke:var(--thread);stroke-width:2.5'}, head);
  svg('circle', {r:4.2, cx:-11, cy:-3, fill:'#b98a52'}, head); svg('circle', {r:4.2, cx:11, cy:-3, fill:'#b98a52'}, head);
  svg('circle', {r:8.5, fill:'#f3cfac'}, head); svg('path', {d:'M-8.5,-1 a8.5,8.5 0 0 1 17,0 q-8.5,-5 -17,0z', fill:'#b98a52'}, head);
  svg('circle', {r:1.3, cx:-3, cy:1.5, fill:'#2a1d12'}, head); svg('circle', {r:1.3, cx:3, cy:1.5, fill:'#2a1d12'}, head);
  svg('path', {d:'M-2.5,4.5 q2.5,2.2 5,0', fill:'none', stroke:'#8a3b2f', 'stroke-width':1.1, 'stroke-linecap':'round'}, head);
}
function railX(){ return mobile() ? 26 : Math.max(0, (flow.clientWidth - 1180)/2) + 16 + 30; }
function offsetIn(node, anc){ let x = 0, y = 0, n = node; while (n && n !== anc){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return [x, y]; }
function layoutThread(){
  const W = flow.clientWidth, H = flow.scrollHeight; thread.setAttribute('viewBox', `0 0 ${W} ${H}`); thread.style.height = H + 'px';
  const rx = railX(); const pts = []; const knots = [];
  const [, hy] = offsetIn($('#start'), flow); pts.push([rx, hy + 40, 'r']);
  ST.forEach(st => {
    const [, ty] = offsetIn(st.head.querySelector('.time') || st.head, flow);
    let ky = ty + 12;
    if (!st.box){ knots.push([rx, ky, st]); pts.push([rx, ky, 'r']); return; }
    const [, by] = offsetIn(st.box, flow);
    if (!mobile()) ky = Math.min(ky, by + 10);
    knots.push([rx, ky, st]); pts.push([rx, ky, 'r']);
    // with several stages the thread enters the first picture that has 'in' and leaves the last one that has 'out'
    const gin = st.stages.find(g => anchor(g.d, 'in')), gout = st.stages.slice().reverse().find(g => anchor(g.d, ['corner_l', 'out']));
    if (gin && gout){
      const at = (g, p) => { const [zx, zy] = offsetIn(g.zoomer, flow); return [zx + p[0]*g.zoomer.offsetWidth, zy + p[1]*g.zoomer.offsetHeight]; };
      const a = at(gin, anchor(gin.d, 'in')), b = at(gout, anchor(gout.d, ['corner_l', 'out']));
      // an exit at the bottom edge (U-Bahn: "Mitte unten") returns along the edge, not across the tap points below
      const pout = anchor(gout.d, ['corner_l', 'out']), [, gy] = offsetIn(gout.zoomer, flow);
      const back = pout[1] > .9 ? gy + gout.zoomer.offsetHeight + 8 : b[1] + (mobile() ? 46 : 80);
      pts.push([a[0], a[1], 'i']); pts.push([b[0], b[1], 'o']); pts.push([rx, back, 'r']);
    }
  });
  const end = $('#weiter'); const [, ey] = offsetIn(end, flow); pts.push([rx, ey + 30, 'r']);
  const {d, S} = threadPath(pts);
  thread.innerHTML = ''; doneSvg.innerHTML = '';
  svg('path', {d, class:'route'}, thread); svg('path', {d, class:'done'}, doneSvg);
  knots.forEach(([x, y, st]) => { st.knot = svg('circle', {cx:x, cy:y, r:7, class:'knot'}, thread); st.knotY = y; st.lit = false; });
  const w = Math.ceil(Math.max(...S.map(s => s[1]))) + 8;   // the coloured line only needs the width of the route
  doneSvg.setAttribute('viewBox', `0 0 ${w} ${H}`); doneSvg.style.width = w + 'px'; doneSvg.style.height = H + 'px';
  const y0 = S[0][2], y1 = S[S.length - 1][2];
  rail.style.top = (y0 - 16) + 'px'; rail.style.height = (y1 - y0 + 32) + 'px'; headBox.style.marginLeft = (S[0][1] - 16) + 'px'; TH = {S, H, knots, x0:S[0][1]};
  rail.classList.toggle('still', reduce);
  onScroll();
}
// The route as an SVG path plus samples of the same route for the head: [running max of y, x, y], curves cut into 24 chords.
// Computed here, not by asking the SVG (getPointAtLength x 2600 took 0.65 s per layout).
function threadPath(p){
  if (p.length < 2) return {d:'', S:[]};
  const f = v => v.toFixed(1), q = v => +f(v);
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  let px = q(p[0][0]), py = q(p[0][1]), maxY = py; const S = [[maxY, px, py]];
  const add = (x, y) => { px = x; py = y; maxY = Math.max(maxY, y); S.push([maxY, x, y]); };
  const curve = (c1x, c1y, c2x, c2y, x, y) => {
    d += ` C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(x)},${f(y)}`;
    const x0 = px, y0 = py; c1x = q(c1x); c1y = q(c1y); c2x = q(c2x); c2y = q(c2y); x = q(x); y = q(y);
    for (let k = 1; k <= 24; k++){ const t = k/24, u = 1 - t;
      add(u*u*u*x0 + 3*u*u*t*c1x + 3*u*t*t*c2x + t*t*t*x, u*u*u*y0 + 3*u*u*t*c1y + 3*u*t*t*c2y + t*t*t*y); }
  };
  for (let i = 0; i < p.length - 1; i++){
    const A = p[i], B = p[i + 1]; const dx = B[0] - A[0], dy = B[1] - A[1];
    if (A[2] === 'r' && B[2] === 'i') curve(A[0], A[1] + Math.max(30, dy*0.6), B[0] - Math.max(30, Math.abs(dx)*0.7), B[1], B[0], B[1]);
    else if (A[2] === 'o' && B[2] === 'r') curve(A[0] - Math.max(24, Math.abs(dx)*0.6), A[1] + dy*0.15, B[0], B[1] - Math.max(20, dy*0.6), B[0], B[1]);
    else { d += ` L${f(B[0])},${f(B[1])}`; add(q(B[0]), q(B[1])); }
  }
  return {d, S};
}
// [x, y] of the route where the scroll target (flow y) lies; between two samples it is interpolated.
function headAt(S, target){
  let lo = 0, hi = S.length - 1;
  while (lo < hi){ const m = (lo + hi + 1) >> 1; if (S[m][0] <= target) lo = m; else hi = m - 1; }
  const a = S[lo], b = S[Math.min(lo + 1, S.length - 1)], k = b[0] > a[0] ? clamp((target - a[0]) / (b[0] - a[0]), 0, 1) : 0;
  return [a[1] + (b[1] - a[1])*k, a[2] + (b[2] - a[2])*k];
}

/* ================================================================ scroll, layout */
let ticking = false, layoutPending = false;
function layoutAll(){
  if (HERO.fig) fitTags(HERO.fig, HERO.tags);
  ST.forEach(st => { safe('fit ' + st.s.id, () => fitStation(st)); });
  if (NOTE) safe('note', placeNote);
  if (CU) resolveStage(CU, true);
  if (XR) drawXray(XR);
  VARS.forEach(u => u());
  layoutThread();
}
function requestLayout(){ if (layoutPending) return; layoutPending = true; setTimeout(() => { layoutPending = false; layoutAll(); }, reduce ? 30 : 820); }
// One scroll frame: read everything first, then write, and write only what changed (reads after writes forced a layout per station).
function onScroll(){
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const vh = innerHeight, sy = scrollY, docH = document.documentElement.scrollHeight - vh;
    const fy = TH ? flow.getBoundingClientRect().top + sy : 0;
    const tops = reduce ? [] : ST.map(st => st.fig ? st.fig.getBoundingClientRect().top : 0);
    ST.forEach((st, i) => {
      if (!st.fig || reduce) return;
      const p = clamp((vh - (tops[i] - (st.off || 0))) / (vh*0.5), 0, 1);
      const off = (1 - p) * 70; st.off = off;
      const slide = `translateY(${off.toFixed(1)}px) scale(${(0.96 + 0.04*p).toFixed(3)})`, fade = (0.45 + 0.55*p).toFixed(3);
      if (slide !== st.slide){ st.slide = slide; st.frame.style.setProperty('--slide', slide); }
      if (fade !== st.fade){ st.fade = fade; st.frame.style.setProperty('--fade', fade); }
    });
    if (TH){
      const target = sy + vh*0.58 - fy;
      const hp = reduce ? TH.S[TH.S.length - 1].slice(1) : headAt(TH.S, target);
      const dpr = devicePixelRatio, r = v => Math.round(v*dpr)/dpr, h = reduce ? TH.H : hp[1] + 2, pos = `translate3d(${r(hp[0] - TH.x0)}px,0,0)`;
      if (h !== TH.h){ TH.h = h; clip.style.height = h.toFixed(1) + 'px'; }
      if (pos !== TH.pos){ TH.pos = pos; headEl.style.transform = pos; }
      let cur = -1; TH.knots.forEach(([x, y, st], k) => { const on = y <= target + 2; if (on !== st.lit){ st.lit = on; st.knot.classList.toggle('on', on); } if (on) cur = k; });
      if (cur !== TH.cur){ TH.cur = cur; const st = cur >= 0 ? ST[cur] : null;
        nowT.textContent = st ? st.s.time : ''; nowL.textContent = st ? st.s.label : 'Ein Dienstag im Februar'; }
    }
    const pg = docH > 0 ? (sy/docH).toFixed(4) : '0'; if (pg !== lastProg){ lastProg = pg; prog.style.transform = `scaleX(${pg})`; }
  });
}
addEventListener('scroll', onScroll, {passive:true});
let rw = innerWidth;
// A height-only resize (the browser toolbar folding in or out on phones) changes no layout, only where 58 % of the screen is:
// redraw the thread for the new height, but skip the full relayout.
addEventListener('resize', () => { if (Math.abs(innerWidth - rw) < 2){ onScroll(); return; } rw = innerWidth; requestLayout(); });

/* ================================================================ Weiter: jump to the next stop */
function scrollToY(y, dur){
  y = clamp(y, 0, document.documentElement.scrollHeight - innerHeight);
  if (reduce){ scrollTo(0, y); return; }
  cancelAnimationFrame(pAnim); const y0 = scrollY, dy = y - y0; const T = dur || clamp(Math.abs(dy)*0.9, 450, 1400); const t0 = performance.now();
  const stepF = t => { const k = clamp((t - t0)/T, 0, 1); const e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2; scrollTo(0, y0 + dy*e); if (k < 1) pAnim = requestAnimationFrame(stepF); };
  pAnim = requestAnimationFrame(stepF);
}
let pAnim = null;
function stationY(st){ if (mobile() && st.head) return docTop(st.head) - 72; const r = (st.fig || st.head).getBoundingClientRect(); return scrollY + r.top - Math.max(70, (innerHeight - r.height)/2); }
// All stops in document order: the stations of the day and the sections after the day.
function stops(){
  return [...document.querySelectorAll('#flow > section.sec, #journey > section')]
    .filter(e => e.offsetParent !== null)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
}
// offsetTop ignores the fade-in transforms, so the target does not move while a section animates in.
function docTop(e){ let y = 0; while (e){ y += e.offsetTop; e = e.offsetParent; } return y; }
function stopY(e){ const st = ST.find(x => x.sec === e); return st ? stationY(st) : docTop(e) - (mobile() ? 64 : 76); }
function stopLabel(e){
  const st = ST.find(x => x.sec === e);
  if (st) return [st.s.time, st.s.label].filter(Boolean).join(' ');
  const h = e.querySelector('h2, h3'); return h ? h.textContent.trim() : '';
}
function nextStop(){ const maxY = document.documentElement.scrollHeight - innerHeight; return stops().find(e => Math.min(stopY(e), maxY) > scrollY + 24) || null; }
const ARROW_DOWN = '<path d="M6 11.2 1.4 6.6h3.1V.8h3v5.8h3.1z"/>', ARROW_UP = '<path d="M6 .8l4.6 4.6H7.5v5.8h-3V5.4H1.4z"/>';
let nextKey = null;
function updateNextUI(){
  const n = nextStop(), lbl = n ? stopLabel(n) : '';
  if (nextKey === (n ? '1' : '0') + lbl) return; nextKey = (n ? '1' : '0') + lbl;
  $$('.play').forEach(b => {
    b.setAttribute('aria-label', n ? 'Weiter zu ' + lbl : 'Zurück nach oben');
    b.title = n ? 'Weiter: ' + lbl : 'Nach oben';
    b.querySelector('span').textContent = n ? 'Weiter' : 'Nach oben';
    b.querySelector('svg').innerHTML = n ? ARROW_DOWN : ARROW_UP;
  });
}
let settleT = 0;
function goNext(){
  const n = nextStop(); const y = n ? stopY(n) : 0; scrollToY(y);
  // Sections fade in while we scroll and the layout can still shift a little; correct once at the end.
  clearTimeout(settleT);
  if (n) settleT = setTimeout(() => { const y2 = Math.min(stopY(n), document.documentElement.scrollHeight - innerHeight); if (Math.abs(scrollY - y2) > 8) scrollToY(y2, 300); }, reduce ? 50 : 1550);
}
$$('.play').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); goNext(); }));
let nextRaf = 0;
addEventListener('scroll', () => { if (!nextRaf) nextRaf = requestAnimationFrame(() => { nextRaf = 0; updateNextUI(); }); }, {passive:true});
// Any own scrolling stops the Weiter animation and its late correction.
['wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => { clearTimeout(settleT); cancelAnimationFrame(pAnim); }, {passive:true}));
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (MODAL.open){ e.preventDefault(); closeModal(); }
  else if (NOTE){ e.preventDefault(); closeNote(); }
});

/* ================================================================ init */
safe('hero', buildHero);
STATIONS.forEach((s, i) => { const sec = safe('station ' + s.id, () => buildStation(s, i)); if (sec) $('#journey').appendChild(sec); });
safe('teasers', buildTeasers);
safe('tiles', setupTiles);
safe('cards', setupCards);
safe('weg', setupWeg);
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('live'); }), {rootMargin:'0px 0px -25% 0px'});
ST.forEach(st => io.observe(st.sec));
// stations with several pictures run through them once when they come into view (not with reduced motion)
const stageIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || e.intersectionRatio < .5) return;
  const st = ST.find(x => x.box === e.target); stageIO.unobserve(e.target); if (st) setTimeout(() => startAuto(st), 900);
}), {threshold:[.5]});
if (!reduce) ST.forEach(st => { if (st.box && st.stages.length > 1) stageIO.observe(st.box); });
if ('ResizeObserver' in window){ const ro = new ResizeObserver(() => requestLayout()); ro.observe(flow); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { requestLayout(); updateNextUI(); });
setTimeout(updateNextUI, 400);
addEventListener('load', () => requestLayout());
layoutThread(); requestLayout();
/* test hooks: lets the smoke test wait for the debounced layout and read the station state */
window.__bhLayout = () => { layoutAll(); return true; };
window.__bhState = () => ({stations:ST.map(st => ({id:st.s.id, stages:st.stages.map(g => g.kind), cur:st.cur, dots:st.stages.map(g => g.hots.length), auto:!!st.autoT})), modal:MODAL.open, note:!!NOTE});
