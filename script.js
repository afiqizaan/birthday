/* ===== Personalise here ===== */
const CONFIG = {
  from: 'Zaan',
  // Birthday date (YYYY-MM-DD). Set to null to hide the date and countdown.
  date: '2026-10-06',
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);

document.getElementById('from').textContent = CONFIG.from;

/* date line + countdown */
if (CONFIG.date) {
  const d = new Date(CONFIG.date + 'T00:00:00');
  const days = Math.ceil((d - new Date().setHours(0, 0, 0, 0)) / 864e5);
  const pretty = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const el = $('#dateLine');
  el.textContent = days > 0 ? `${pretty} · ${days} day${days === 1 ? '' : 's'} to go` : pretty;
  el.hidden = false;
}

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
