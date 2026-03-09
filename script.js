const weddingDate = new Date("2026-03-14T17:00:00-06:00");

const INVITE_TEXT =
`You all are invited 💍
Prashanth Weds Bhavya Sri
Date: March 14, 2026
Time: 5:00 PM
Venue: Add your venue here`;

let autoPlayMusicAfterOpen = true;

const pad2 = (n) => String(n).padStart(2, "0");

// countdown
function tick(){
  const now = new Date();
  const diff = weddingDate - now;

  const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const h = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const m = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const s = Math.max(0, Math.floor((diff / 1000) % 60));

  const dEl = document.getElementById("d");
  const hEl = document.getElementById("h");
  const mEl = document.getElementById("m");
  const sEl = document.getElementById("s");

  if (dEl) dEl.textContent = pad2(d);
  if (hEl) hEl.textContent = pad2(h);
  if (mEl) mEl.textContent = pad2(m);
  if (sEl) sEl.textContent = pad2(s);
}
tick();
setInterval(tick, 1000);

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// music
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const toggleMusic2 = document.getElementById("toggleMusic2");
let musicOn = false;

async function tryToggleMusic(forceOn = null){
  try {
    const shouldTurnOn = forceOn === null ? !musicOn : forceOn;

    if (shouldTurnOn) {
      await music.play();
      musicOn = true;
      if (musicBtn) {
        musicBtn.textContent = "❚❚";
        musicBtn.title = "Pause Music";
      }
      if (toggleMusic2) toggleMusic2.textContent = "Pause Music";
    } else {
      music.pause();
      musicOn = false;
      if (musicBtn) {
        musicBtn.textContent = "♪";
        musicBtn.title = "Play Music";
      }
      if (toggleMusic2) toggleMusic2.textContent = "Play Music";
    }
  } catch {
    alert("Tap again to allow music on your phone.");
  }
}

if (musicBtn) musicBtn.addEventListener("click", () => tryToggleMusic(null));
if (toggleMusic2) toggleMusic2.addEventListener("click", () => tryToggleMusic(null));

// open animation
const openBtn = document.getElementById("openBtn");
const door = document.getElementById("door");
const pbIntro = document.getElementById("pbIntro");
const main = document.getElementById("main");

if (openBtn) {
  openBtn.addEventListener("click", async () => {
    door.style.transform = "translateY(-6px) scale(0.98)";
    door.style.opacity = "0";

    setTimeout(() => {
      pbIntro.classList.remove("hidden");
      pbIntro.classList.add("pb-show");
    }, 250);

    if (autoPlayMusicAfterOpen) {
      await tryToggleMusic(true);
    }

    setTimeout(() => {
      pbIntro.classList.add("hidden");
      main.classList.remove("hidden");
      const invite = document.getElementById("invite");
      if (invite) invite.scrollIntoView({ behavior: "smooth" });
    }, 5200);
  });
}

// copy invite
const copyInvite = document.getElementById("copyInvite");
if (copyInvite) {
  copyInvite.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(INVITE_TEXT);
      alert("Invite text copied ✅");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  });
}

// reveal on scroll
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add("show");
  }
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// image zoom
const modal = document.getElementById("imgModal");
const imgBig = document.getElementById("imgBig");
const close = document.getElementById("imgClose");

function openImg(src, alt){
  imgBig.src = src;
  imgBig.alt = alt || "Image";
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeImg(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  imgBig.src = "";
}

if (close) close.addEventListener("click", closeImg);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeImg();
  });
}

document.querySelectorAll(".zoomable, .polaroid").forEach(el => {
  el.addEventListener("click", () => {
    const img = el.tagName.toLowerCase() === "img" ? el : el.querySelector("img");
    if (!img) return;
    openImg(img.src, img.alt);
  });
});

// sparkle background
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let W, H, particles;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  particles = Array.from({ length: 110 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 0.8 + Math.random() * 2.2,
    a: 0.18 + Math.random() * 0.55,
    vx: (-0.20 + Math.random() * 0.40),
    vy: (0.20 + Math.random() * 0.65),
    wob: Math.random() * Math.PI * 2
  }));
}

window.addEventListener("resize", resize);
resize();

function draw(){
  ctx.clearRect(0, 0, W, H);

  for (const p of particles) {
    p.wob += 0.02;
    p.x += p.vx + Math.sin(p.wob) * 0.15;
    p.y += p.vy;

    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y > H + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();
