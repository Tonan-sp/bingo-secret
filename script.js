/* ====== Modifie ici la liste des défis ====== */
const DEFIS = [
  "Faire une photo avec Isabelle",
  "Lui faire porter un accessoire",
  "La faire rire",
  "Danser avec elle",
  "Partager au moins 3 photos pour le défi photo",
  "Avoir complété le mot fléché",
  "Lui faire parler de ses poissons",
  "Mettre un objet insolite sur sa table"
];
/* ============================================ */

const KEY = "bingo-secret-v1";
const grid = document.getElementById("grid");
const bar = document.getElementById("bar");
const count = document.getElementById("count");
const bingo = document.getElementById("bingo");
let done = load();
let celebrated = done.every(Boolean);

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved) && saved.length === DEFIS.length) return saved;
  } catch (e) {}
  return DEFIS.map(() => false);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
}

function render() {
  grid.innerHTML = "";
  DEFIS.forEach((txt, i) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.className = "tile";
    b.type = "button";
    b.id = "defi-" + i;
    b.setAttribute("aria-pressed", done[i]);
    b.innerHTML =
      '<span class="box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span>' +
      '<span class="label"></span><span class="done-stamp" aria-hidden="true">FAIT</span>';
    b.querySelector(".label").textContent = txt;
    b.addEventListener("click", () => toggle(i, b));
    li.appendChild(b);
    grid.appendChild(li);
  });
  update();
}

function toggle(i, btn) {
  done[i] = !done[i];
  btn.setAttribute("aria-pressed", done[i]);
  save();
  update();
}

function update() {
  const n = done.filter(Boolean).length;
  bar.style.width = (n / DEFIS.length * 100) + "%";
  count.textContent = n + " / " + DEFIS.length;
  if (n === DEFIS.length && !celebrated) { celebrated = true; showBingo(); }
  if (n < DEFIS.length) celebrated = false;
}

function showBingo() {
  bingo.hidden = false;
  document.getElementById("closeBingo").focus();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) confetti();
}
document.getElementById("closeBingo").addEventListener("click", () => { bingo.hidden = true; });

/* Recommencer, avec confirmation dans la page */
const zone = document.getElementById("resetZone");
function showResetButton() {
  zone.innerHTML = '<button class="reset" id="reset" type="button">Recommencer</button>';
  document.getElementById("reset").addEventListener("click", askReset);
}
function askReset() {
  zone.innerHTML = '<div class="confirm"><span>Tout décocher ?</span><button type="button" class="yes">Oui</button><button type="button" class="no">Non</button></div>';
  zone.querySelector(".yes").addEventListener("click", () => {
    done = DEFIS.map(() => false); celebrated = false; save(); render(); showResetButton();
  });
  zone.querySelector(".no").addEventListener("click", showResetButton);
  zone.querySelector(".no").focus();
}
document.getElementById("reset").addEventListener("click", askReset);

/* Confettis */
function confetti() {
  const c = document.getElementById("confetti");
  const ctx = c.getContext("2d");
  c.hidden = false;
  const dpr = window.devicePixelRatio || 1;
  c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const colors = ["#6f8a78", "#a9b9ad", "#c8323a", "#e9dcc3", "#1d211f"];
  const bits = Array.from({ length: 160 }, () => ({
    x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .6,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    vy: 2 + Math.random() * 3, vx: -1.5 + Math.random() * 3,
    r: Math.random() * 6, vr: -.15 + Math.random() * .3,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  const start = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    bits.forEach(b => {
      b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.color; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    });
    if (t - start < 4500) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, innerWidth, innerHeight); c.hidden = true; }
  })(start);
}

render();
