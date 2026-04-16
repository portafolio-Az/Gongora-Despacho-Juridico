/* ============================================================
   LEXCIVIS — JAVASCRIPT OPTIMIZADO
   ============================================================ */

'use strict';

/* ===== UTILIDADES ===== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ===================================================
   1. PAGE LOADER — desaparece tras 1s
=================================================== */
(function initLoader() {
  const loader = $('#page-loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };

  // Mínimo 1s + espera DOMContentLoaded
  const t0 = performance.now();
  const MIN = 1000;

  const go = () => {
    const elapsed = performance.now() - t0;
    const wait = Math.max(0, MIN - elapsed);
    setTimeout(hide, wait);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go, { once: true });
  } else {
    go();
  }
})();

/* ===================================================
   2. CAROUSEL HERO
=================================================== */
(function initCarousel() {
  const slides  = $$('.carousel-slide');
  const dots    = $$('.dot');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  if (!slides.length) return;

  let current  = 0;
  let timer    = null;
  const DELAY  = 6000;

  const goTo = (idx) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAuto = () => { timer = setInterval(next, DELAY); };
  const resetAuto = () => { clearInterval(timer); startAuto(); };

  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Touch/swipe
  let touchX = 0;
  const carousel = $('#carousel');
  carousel?.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive:true });
  carousel?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); resetAuto(); }
  }, { passive:true });

  startAuto();
})();

/* ===================================================
   3. NAVBAR — scroll effect + mobile menu
=================================================== */
(function initNavbar() {
  const navbar     = $('.navbar');
  const hamburger  = $('.hamburger');
  const mobileMenu = $('.nav-menu-mobile');
  const overlay    = $('.nav-overlay');
  if (!navbar) return;

  // Scroll effect
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Mobile menu
  const openMenu  = () => {
    mobileMenu?.classList.add('open');
    overlay?.classList.add('visible');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    overlay?.classList.remove('visible');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  };
  const toggleMenu = () => mobileMenu?.classList.contains('open') ? closeMenu() : openMenu();

  hamburger?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);

  $$('.nav-menu-mobile .nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

/* ===================================================
   4. SCROLL REVEAL
=================================================== */
(function initScrollReveal() {
  const targets = $$('.fade-up, .fade-left, .fade-right');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));

  // Immediate reveal for elements already visible
  requestAnimationFrame(() => {
    targets.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('revealed');
      }
    });
  });
})();

/* ===================================================
   5. SMOOTH SCROLL LINKS
=================================================== */
(function initSmoothScroll() {
  const OFFSET = 72; // navbar height
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ===================================================
   6. BOTÓN SUBIR
=================================================== */
(function initScrollTop() {
  const btn = $('#scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 420);
  }, { passive:true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
})();

/* ===================================================
   7. FORMULARIO → WhatsApp
=================================================== */
(function initContactForm() {
  const form   = $('#contactForm');
  const WA_NUM = '525544705244';
  if (!form) return;

  const showError = (input, msg) => {
    input.style.borderColor = '#e74c3c';
    let err = input.parentNode.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'color:#e74c3c;font-size:.78rem;margin-top:4px;display:block;';
      input.parentNode.appendChild(err);
    }
    err.textContent = msg;
  };
  const clearErrors = () => {
    $$('.field-error', form).forEach(el => el.remove());
    $$('input, textarea', form).forEach(el => el.style.borderColor = '');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const nombre   = $('#nombre');
    const email    = $('#email');
    const telefono = $('#telefono');
    const mensaje  = $('#mensaje');
    let valid = true;

    if (!nombre.value.trim()) { showError(nombre, 'Por favor ingresa tu nombre.'); valid=false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError(email, 'Ingresa un correo válido.'); valid=false; }
    if (!/^[\d\s\-\+\(\)]{7,}$/.test(telefono.value.trim())) { showError(telefono, 'Ingresa un teléfono válido.'); valid=false; }
    if (!mensaje.value.trim()) { showError(mensaje, 'Por favor describe tu caso.'); valid=false; }
    if (!valid) return;

    const enc = s => encodeURIComponent(s.trim());
    const text = [
      '*NUEVA CONSULTA JURÍDICA — LexCivis*',
      '',
      `*Nombre:* ${enc(nombre.value)}`,
      `*Email:* ${enc(email.value)}`,
      `*Teléfono:* ${enc(telefono.value)}`,
      `*Mensaje:* ${enc(mensaje.value)}`,
      '',
      '📅 _Solicitud de consulta gratuita_'
    ].join('%0A');

    window.open(`https://wa.me/${WA_NUM}?text=${text}`, '_blank', 'noopener,noreferrer');
    form.reset();

    // Toast de confirmación
    showToast(`¡Gracias, ${nombre.value.trim().split(' ')[0]}! Serás redirigido a WhatsApp.`);
  });
})();

/* ===================================================
   8. TOAST NOTIFICATION
=================================================== */
function showToast(msg, duration = 4000) {
  let toast = $('#toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%) translateY(20px);
      background:#0b1f2e; color:#fff; padding:14px 28px; border-radius:50px;
      font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:500;
      box-shadow:0 8px 28px rgba(0,0,0,.25); z-index:9000;
      border:1px solid rgba(201,152,74,.3);
      display:flex; align-items:center; gap:10px;
      opacity:0; transition:opacity .4s ease, transform .4s ease;
      pointer-events:none; white-space:nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:#c9984a"></i> ${msg}`;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(12px)';
  }, duration);
}

/* ===================================================
   9. ANIMATED COUNTERS (Stats bar)
=================================================== */
(function initCounters() {
  const nums = $$('[data-count]');
  if (!nums.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const end    = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur    = 1600;
      const step   = 16;
      const steps  = dur / step;
      const inc    = end / steps;
      let current  = 0;
      const tick   = () => {
        current = Math.min(current + inc, end);
        el.textContent = (Number.isInteger(end) ? Math.round(current) : current.toFixed(1)) + suffix;
        if (current < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => io.observe(el));
})();

/* ===================================================
   10. RESIZE HANDLER (vh fix iOS)
=================================================== */
(function initViewportFix() {
  const set = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * .01}px`);
  set();
  window.addEventListener('resize', set, { passive:true });
})();



// Asegurar scroll reveal en la página de privacidad
(function initPrivacyReveal() {
  const targets = document.querySelectorAll('.privacy-section .fade-up');
  if (!targets.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  targets.forEach(el => observer.observe(el));
  // Forzar revelado si ya son visibles
  requestAnimationFrame(() => {
    targets.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('revealed');
      }
    });
  });
})();