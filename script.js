// ========== 1. CARRUSEL AUTOMÁTICO ==========
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;
let autoInterval;

function updateCarousel(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  currentIndex = index;
}

function nextSlide() {
  let newIndex = (currentIndex + 1) % slides.length;
  updateCarousel(newIndex);
}

function prevSlide() {
  let newIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel(newIndex);
}

function startAutoCarousel() {
  autoInterval = setInterval(nextSlide, 6000);
}

function resetAutoCarousel() {
  clearInterval(autoInterval);
  startAutoCarousel();
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoCarousel();
  });
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoCarousel();
  });
}

dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    updateCarousel(idx);
    resetAutoCarousel();
  });
});

startAutoCarousel();

// ========== 2. SCROLL REVEAL ==========
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -30px 0px" });

fadeElements.forEach(el => observer.observe(el));

setTimeout(() => {
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('revealed');
    }
  });
}, 200);

// ========== 3. MENÚ HAMBURGUESA ==========
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const icon = hamburger?.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
});

// ========== 4. SCROLL SUAVE ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === "#" || targetId === "") return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = hamburger?.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    }
  });
});

// ========== 5. FORMULARIO CON ENVÍO A WHATSAPP ==========
const contactForm = document.getElementById('contactForm');
const whatsappNumber = '525544705244'; // Número en formato internacional sin +

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    const mensaje = document.getElementById('mensaje')?.value.trim();

    if (!nombre || !email || !telefono || !mensaje) {
      alert('Por favor completa todos los campos.');
      return;
    }

    // Construir mensaje organizado para WhatsApp
    const whatsappMessage = `*NUEVA CONSULTA JURÍDICA*%0A%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Email:* ${encodeURIComponent(email)}%0A*Teléfono:* ${encodeURIComponent(telefono)}%0A*Mensaje:* ${encodeURIComponent(mensaje)}%0A%0A📅 *Solicita consulta gratuita*`;
    
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappURL, '_blank');
    
    // Opcional: mostrar mensaje de confirmación
    alert(`✅ ¡Gracias ${nombre}! Serás redirigido a WhatsApp para completar tu solicitud.`);
    
    // Resetear formulario (opcional)
    contactForm.reset();
  });
}

// ========== 6. BOTÓN SUBIR (SCROLL TOP) ==========
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== 7. NAVBAR SCROLL EFFECT ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
    navbar.style.background = 'rgba(255,255,255,0.98)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
    navbar.style.background = 'rgba(255,255,255,0.96)';
  }
});

// Ajuste móvil
window.addEventListener('resize', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});