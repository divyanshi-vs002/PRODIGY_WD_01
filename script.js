const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];

let pointerX = 0;
let pointerY = 0;

/* =========================
   RESIZE CANVAS
========================= */

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const particleCount = Math.floor(Math.min(70, Math.max(35, width / 18)));

  particles = Array.from({ length: particleCount }, createParticle);
}

/* =========================
   CREATE PARTICLES
========================= */

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,

    z: Math.random() * 0.9 + 0.1,

    radius: Math.random() * 1.8 + 0.7,

    speed: Math.random() * 0.35 + 0.12,

    hue: [198, 207, 216, 226][Math.floor(Math.random() * 4)],
  };
}

/* =========================
   DRAW PARTICLE
========================= */

function drawParticle(particle) {
  const driftX = pointerX * particle.z * 28;
  const driftY = pointerY * particle.z * 22;

  const size = particle.radius * (1 + particle.z);

  ctx.beginPath();

  ctx.arc(particle.x + driftX, particle.y + driftY, size, 0, Math.PI * 2);

  ctx.fillStyle = `hsla(
    ${particle.hue},
    92%,
    68%,
    ${0.2 + particle.z * 0.42}
  )`;

  ctx.fill();
}

/* =========================
   ANIMATION LOOP
========================= */

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y -= particle.speed * particle.z;

    particle.x += Math.sin((particle.y + particle.z * 260) * 0.01) * 0.25;

    if (particle.y < -20) {
      particle.y = height + 20;

      particle.x = Math.random() * width;
    }

    drawParticle(particle);
  });

  requestAnimationFrame(animateParticles);
}

/* =========================
   MOUSE EFFECT
========================= */

function handlePointerMove(event) {
  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;

  pointerX = (event.clientX - halfWidth) / halfWidth;
  pointerY = (event.clientY - halfHeight) / halfHeight;
}

function resetPointer() {
  pointerX = 0;
  pointerY = 0;
}

/* =========================
   EVENTS
========================= */

window.addEventListener("resize", resizeCanvas);

window.addEventListener("pointermove", handlePointerMove);

window.addEventListener("pointerleave", resetPointer);

/* =========================
   START
========================= */

resizeCanvas();

animateParticles();
