import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  initSpaceBackground();
  initHeroAnimation();
  initScrollReveal();
  initTestimonialCarousel();
  initFAQAccordion();
  initMobileNav();
});

/* ========================================
   SPACE BACKGROUND — Canvas
   ======================================== */
function initSpaceBackground() {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h;
  const stars = [];
  const shootingStars = [];
  const planets = [];
  const asteroids = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    // Stars
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        dAlpha: (Math.random() - 0.5) * 0.012,
      });
    }
    // Planets
    planets.push(
      { x: w * 0.12, y: h * 0.25, r: 14, color: '#ff6b9d', speed: 0.1, angle: 0 },
      { x: w * 0.88, y: h * 0.3, r: 9, color: '#a1c4fd', speed: 0.07, angle: Math.PI },
      { x: w * 0.55, y: h * 0.75, r: 6, color: '#fecfef', speed: 0.12, angle: Math.PI / 2 },
      { x: w * 0.25, y: h * 0.85, r: 11, color: '#84fab0', speed: 0.08, angle: Math.PI * 1.5 },
    );
    // Asteroids
    for (let i = 0; i < 4; i++) {
      asteroids.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: Math.random() * 0.2 + 0.05,
        color: `hsl(${Math.random() * 50 + 30}, 45%, 55%)`,
      });
    }
  }

  init();
  window.addEventListener('resize', resize);

  let shootTimer = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Stars
    for (const s of stars) {
      s.alpha += s.dAlpha;
      if (s.alpha > 1 || s.alpha < 0.15) s.dAlpha *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0.1, Math.min(1, s.alpha)) * 0.6})`;
      ctx.fill();
    }

    // Planets
    for (const p of planets) {
      p.angle += p.speed * 0.006;
      const dx = p.x + Math.sin(p.angle) * 12;
      const dy = p.y + Math.cos(p.angle) * 6;
      const grd = ctx.createRadialGradient(dx, dy, 0, dx, dy, p.r * 2.5);
      grd.addColorStop(0, p.color + '25');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(dx, dy, p.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dx, dy, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + 'bb';
      ctx.fill();
    }

    // Asteroids
    for (const a of asteroids) {
      a.x += a.speedX;
      a.y += a.speedY;
      if (a.x > w + 10) a.x = -10;
      if (a.x < -10) a.x = w + 10;
      if (a.y > h + 10) { a.y = -10; a.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = a.color;
      ctx.fill();
    }

    // Shooting stars
    shootTimer++;
    if (shootTimer > 180 + Math.random() * 200) {
      shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.4,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 7 + 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 1,
      });
      shootTimer = 0;
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= 0.01;
      if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len * ss.life, ss.y - Math.sin(ss.angle) * ss.len * ss.life);
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      grad.addColorStop(0, `rgba(255,255,255,${ss.life})`);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ========================================
   HERO — GSAP Timeline
   ======================================== */
function initHeroAnimation() {
  const logo = document.querySelector('.hero-logo');
  const heading = document.querySelector('.hero-heading');
  const sub = document.querySelector('.hero-subheading');
  const btns = document.querySelector('.hero-buttons');

  // Start children hidden
  gsap.set([logo, heading, sub, btns].filter(Boolean), { opacity: 0, y: 25 });

  // Animate in
  const tl = gsap.timeline({ delay: 0.4 });
  if (logo) tl.to(logo, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
  if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  if (btns) tl.to(btns, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

  // Parallax on video
  gsap.to('.hero-video', {
    scale: 1.12,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 },
  });
}

/* ========================================
   SCROLL REVEAL — Pure CSS + IntersectionObserver
   No GSAP. No disappearing. Elements fade in once and stay.
   ======================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.anim-reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Once revealed, stop observing
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  reveals.forEach(el => observer.observe(el));
}

/* ========================================
   TESTIMONIAL CAROUSEL — GSAP infinite
   ======================================== */
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
  const totalWidth = track.scrollWidth / 2;
  gsap.to(track, {
    x: -totalWidth,
    duration: 30,
    ease: 'none',
    repeat: -1,
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) },
  });
}

/* ========================================
   FAQ ACCORDION
   ======================================== */
function initFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
}

/* ========================================
   MOBILE NAV
   ======================================== */
function initMobileNav() {
  const btn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileNav');
  if (!btn || !overlay) return;
  btn.addEventListener('click', () => {
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}
