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
  let html = `<div class="cal-head"><small>${y}</small><span class="script">${monthName}</span></div><div class="cal-grid">`;
  html += 'SMTWTFS'.split('').map((c) => `<span class="dow">${c}</span>`).join('');
  for (let i = 0; i < first; i++) html += '<span></span>';
  for (let n = 1; n <= total; n++) {
    const sun = (first + n - 1) % 7 === 0;
    if (n === day) {
      html += `<span class="day hl"><svg viewBox="0 0 62 62"><path pathLength="1" d="M30 5C48 3 59 17 57 32C55 48 39 59 24 55C8 51 2 35 8 20C13 9 24 4 37 7"/></svg><svg class="mini" viewBox="0 0 24 24"><use href="#heart"/></svg><span>${n}</span></span>`;
    } else html += `<span class="day${sun ? ' sun' : ''}">${n}</span>`;
  }
  html += '</div>';
  const days = Math.round((d - new Date().setHours(0, 0, 0, 0)) / 864e5);
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
  const left = days > 1 ? `${days} days to go` : days === 1 ? 'tomorrow!' : days === 0 ? 'today!' : '';
  html += `<div class="cal-foot"><span class="script">${weekday}, Husna's day ♡</span>${left ? `<small>${left}</small>` : ''}</div>`;
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

/* her photo appears only if photos/husna.jpg exists */
(function () {
  const img = $('#girlImg'), sec = $('#girl');
  const show = () => { sec.hidden = false; };
  if (img.complete && img.naturalWidth) show(); else img.addEventListener('load', show);
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

/* envelope gate */
const gate = $('#gate'), env = $('#open');
let opened = false;
function openGate() {
  if (opened) return;
  opened = true;
  env.classList.add('open');
  burst(innerWidth / 2, innerHeight / 2, 22);
  setTimeout(() => {
    gate.classList.add('gone');
    document.body.classList.remove('locked');
    observeAll();
  }, reduceMotion ? 0 : 1300);
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
  answer.textContent = 'Yay! I can\'t wait ♡';
  requestAnimationFrame(() => answer.classList.add('show'));
  document.getElementById('rsvp').classList.add('done');
}));

/* make a wish */
$('#cake').addEventListener('click', (e) => {
  const c = e.currentTarget;
  if (c.classList.contains('out')) return;
  c.classList.add('out');
  const r = c.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + 20, 70);
  $('#wish').textContent = 'wish made ♡ happy birthday, Husna';
});
