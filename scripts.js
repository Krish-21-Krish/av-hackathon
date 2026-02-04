/* =====================================================
   CONFIG & INITIALIZATION
===================================================== */
gsap.registerPlugin(ScrollTrigger);

// Set your target date here (IST Format)
const eventDate = new Date("2026-02-14T09:00:00+05:30").getTime();
let confettiPlayed = false;

/* =====================================================
   COUNTDOWN ENGINE
===================================================== */
function updateCountdown() {
  const d = document.getElementById("days");
  const h = document.getElementById("hours");
  const m = document.getElementById("minutes");
  const s = document.getElementById("seconds");
  const countdownBox = document.getElementById("countdown");

  if (!d || !h || !m || !s) return;

  const now = Date.now();
  const diff = eventDate - now;

  // FORCE VISIBILITY: In case any other script tries to hide it
  if (countdownBox) {
    countdownBox.style.opacity = "1";
    countdownBox.style.visibility = "visible";
  }

  // LOGIC: If the time has passed, lock at 00
  if (diff <= 0) {
    d.textContent = "00";
    h.textContent = "00";
    m.textContent = "00";
    s.textContent = "00";

    if (!confettiPlayed) {
      confettiPlayed = true;
      triggerConfetti();
    }
    return;
  }

  // CALCULATION
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  d.textContent = String(days).padStart(2, "0");
  h.textContent = String(hours).padStart(2, "0");
  m.textContent = String(mins).padStart(2, "0");
  s.textContent = String(secs).padStart(2, "0");
}

/* =====================================================
   ANIMATIONS
===================================================== */
function initAnimations() {
  // Hero entry
  gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1.2, ease: "power4.out" });
  gsap.from(".hero-sub", { y: 30, opacity: 0, delay: 0.3, duration: 1 });
  
  // Note: We skip animating the #countdown container to prevent it from getting stuck at opacity 0
  gsap.from(".countdown-item", {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    delay: 0.6,
    duration: 0.8
  });

  // Scroll Reveals
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

/* =====================================================
   CONFETTI (ASYNC LOAD)
===================================================== */
async function triggerConfetti() {
  if (typeof confetti === 'undefined') {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    document.head.appendChild(script);
    script.onload = () => {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 999 });
    };
  } else {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 999 });
  }
}

/* =====================================================
   START
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initAnimations();
});