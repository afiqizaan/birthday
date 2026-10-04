/* ===== Personalise here ===== */
const CONFIG = {
  from: 'Zaan',
  // Birthday date (YYYY-MM-DD). Set to null to hide the date and countdown.
  date: '2026-10-06',
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);

document.getElementById('from').textContent = CONFIG.from;

/* calendar */
(function () {
  const root = $('#cal');
  if (!CONFIG.date) { $('#date').remove(); return; }
  const d = new Date(CONFIG.date + 'T00:00:00');
  const y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
  const monthName = d.toLocaleDateString('en-GB', { month: 'long' });
  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const now = new Date();
  const today = now.getFullYear() === y && now.getMonth() === m ? now.getDate() : (now < d ? 0 : 99);
  let html = `<div class="cal-head"><small>${y}</small><span class="script">${monthName}</span></div><div class="cal-grid">`;
  html += 'SMTWTFS'.split('').map((c) => `<span class="dow">${c}</span>`).join('');
  for (let i = 0; i < first; i++) html += '<span></span>';
  for (let n = 1; n <= total; n++) {
    const sun = (first + n - 1) % 7 === 0;
    if (n === day) {
      html += `<span class="day hl"><svg viewBox="0 0 62 62"><path pathLength="1" d="M30 5C48 3 59 17 57 32C55 48 39 59 24 55C8 51 2 35 8 20C13 9 24 4 37 7"/></svg><svg class="mini" viewBox="0 0 24 24"><use href="#heart"/></svg><span>${n}</span></span>`;
    } else html += `<span class="day${sun ? ' sun' : ''}${n < today ? ' x' : ''}">${n}</span>`;
  }
  html += '</div>';
  const days = Math.round((d - new Date().setHours(0, 0, 0, 0)) / 864e5);
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
  const left = days > 1 ? `${days} days to go` : days === 1 ? 'tomorrow!' : days === 0 ? 'today!' : '';
  html += `<div class="cal-foot"><span class="hand">${weekday}, Una's day ♡</span>${left ? `<small>${left}</small>` : ''}</div>`;
  root.innerHTML = html;
})();

/* bunting */
(function () {
  const box = $('#bunting'), W = innerWidth, n = Math.max(7, Math.round(W / 46));
  const cols = ['#bfe0f8', '#fffaf1', '#8dc2ee', '#ffffff'];
  const P = [[-10, -2], [W / 2, 74], [W + 10, -2]];
  const q = (t) => [0, 1].map((k) => (1 - t) ** 2 * P[0][k] + 2 * (1 - t) * t * P[1][k] + t * t * P[2][k]);
  let flags = '';
  for (let i = 1; i <= n; i++) {
    const [x, y] = q(i / (n + 1));
    flags += `<polygon class="flag" style="animation-delay:${-i * .37}s" points="${x - 15},${y} ${x + 15},${y} ${x},${y + 38}" fill="${cols[i % 4]}" stroke="#5b93c4" stroke-opacity=".25"/>`;
  }
  box.innerHTML = `<svg viewBox="0 0 ${W} 90" preserveAspectRatio="none"><path d="M${P[0]} Q${P[1]} ${P[2]}" fill="none" stroke="#5b93c4" stroke-opacity=".5" stroke-width="1.5"/>${flags}</svg>`;
})();

/* her photos: sections appear only for photos that exist (photos/una-1.jpg ...) */
document.querySelectorAll('.pol').forEach((fig) => {
  const probe = new Image();
  probe.onload = () => { fig.hidden = false; $('#her').hidden = false; observeAll(); };
  probe.src = fig.querySelector('img').getAttribute('src');
});

/* string-art heart */
(function () {
  const svg = $('#stringHeart'), N = 72, p = [];
  for (let i = 0; i < N; i++) {
    const t = Math.PI + (i / N) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    p.push([50 + x * 2.75, 47 - (y + 2.5) * 2.85]);
  }
  let out = '';
  const line = (i, j, cls, d) => {
    const a = p[(i + N) % N], b = p[(j + N) % N];
    out += `<line class="${cls}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" style="transition-delay:${d}ms"/>`;
  };
  for (let i = 0; i < N; i++) {
    const d = i * 28;
    line(i, N - i, 'c', d);
    line(i, N - i + 14, 'b', d); line(i, N - i - 14, 'b', d);
    line(i, N - i + 5, 'a', d); line(i, N - i - 5, 'a', d);
  }
  p.forEach((q) => { out += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r=".8"/>`; });
  svg.innerHTML = out;
})();

/* twinkling stars */
const starBox = $('#stars');
for (let i = 0; i < 26; i++) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const size = 6 + Math.random() * 10;
  s.setAttribute('class', 'star');
  s.setAttribute('width', size); s.setAttribute('height', size);
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 75 + '%';
  s.style.animationDelay = (-Math.random() * 4) + 's';
  s.style.animationDuration = 3 + Math.random() * 4 + 's';
  s.innerHTML = '<use href="#spark"/>';
  starBox.appendChild(s);
}

/* scroll reveal */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
const observeAll = () => document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* music */
const music = $('#music'), song = new Audio('audio/orbiter.mp3');
song.loop = true; song.volume = 0;
let fadeTimer;
function fadeTo(v, ms) {
  clearInterval(fadeTimer);
  const step = (v - song.volume) / (ms / 50);
  fadeTimer = setInterval(() => {
    const nv = song.volume + step;
    if ((step > 0 && nv >= v) || (step < 0 && nv <= v)) { song.volume = v; clearInterval(fadeTimer); if (v === 0) song.pause(); }
    else song.volume = Math.max(0, Math.min(1, nv));
  }, 50);
}
function startMusic() {
  music.hidden = false;
  song.play().then(() => {
    music.classList.remove('paused'); fadeTo(.55, 3000);
    music.classList.add('show-np'); setTimeout(() => music.classList.remove('show-np'), 5500);
  }).catch(() => music.classList.add('paused'));
}
music.addEventListener('click', (e) => {
  e.stopPropagation();
  if (song.paused) { song.play(); fadeTo(.55, 800); music.classList.remove('paused'); music.setAttribute('aria-label', 'Pause music'); }
  else { fadeTo(0, 600); music.classList.add('paused'); music.setAttribute('aria-label', 'Play music'); }
});

/* envelope gate */
const gate = $('#gate'), env = $('#open');
let opened = false;
function openGate() {
  if (opened) return;
  opened = true;
  env.classList.add('open');
  gate.classList.add('opening');
  startMusic();
  burst(innerWidth / 2, innerHeight / 2, 22);
  setTimeout(() => {
    gate.classList.add('gone');
    document.body.classList.remove('locked');
    observeAll();
  }, reduceMotion ? 0 : 2000);
}
env.addEventListener('click', openGate);

/* confetti-ish hearts & sparkles on a canvas */
const cv = $('#fx'), ctx = cv.getContext('2d');
let parts = [], raf = 0;
function size() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
size(); addEventListener('resize', size);
const COLORS = ['#8dc2ee', '#bfdff8', '#ffffff', '#5b93c4', '#fff4d8'];

function heartPath(c, s) {
  c.beginPath();
  c.moveTo(0, s * .35);
  c.bezierCurveTo(-s, -s * .3, -s * .35, -s, 0, -s * .4);
  c.bezierCurveTo(s * .35, -s, s, -s * .3, 0, s * .35);
  c.closePath();
}
function sparkPath(c, s) {
  c.beginPath();
  c.moveTo(0, -s);
  c.quadraticCurveTo(0, 0, s, 0); c.quadraticCurveTo(0, 0, 0, s);
  c.quadraticCurveTo(0, 0, -s, 0); c.quadraticCurveTo(0, 0, 0, -s);
  c.closePath();
}
function burst(x, y, n = 30) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 7;
    parts.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, g: .16, life: 1,
      decay: .008 + Math.random() * .01, s: 6 + Math.random() * 9, rot: Math.random() * 6,
      vr: (Math.random() - .5) * .2, c: COLORS[i % COLORS.length], heart: Math.random() < .55,
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  const dpr = devicePixelRatio;
  ctx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vy += p.g; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
    ctx.save();
    ctx.translate(p.x * dpr, p.y * dpr); ctx.rotate(p.rot); ctx.scale(dpr, dpr);
    ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.c;
    ctx.shadowColor = 'rgba(91,147,196,.4)'; ctx.shadowBlur = 6;
    (p.heart ? heartPath : sparkPath)(ctx, p.s);
    ctx.fill(); ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
  if (!raf) ctx.clearRect(0, 0, cv.width, cv.height);
}

/* tiny sparkle wherever she taps */
addEventListener('pointerdown', (e) => { if (opened) burst(e.clientX, e.clientY, 5); });

/* RSVP */
const answer = $('#answer');
document.querySelectorAll('[data-yes]').forEach((b, i) => b.addEventListener('click', (e) => {
  const r = b.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 60);
  setTimeout(() => burst(innerWidth / 2, innerHeight * .4, 40), 250);
  answer.textContent = 'Yay! See you at 10 ♡';
  requestAnimationFrame(() => answer.classList.add('show'));
  document.getElementById('rsvp').classList.add('done');
}));

