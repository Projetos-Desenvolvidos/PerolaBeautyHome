// MENU
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const toggleIcon = toggle?.querySelector('i');

if (toggle && toggleIcon) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggleIcon.classList.toggle('fa-times');
    toggleIcon.classList.toggle('fa-bars');
  });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ===== SLIDERS GENÉRICOS =====
function initSlider(containerSelector, cardSelector, dotsSelector, activeClass) {
  const sliderContainer = document.querySelector(containerSelector);
  if (!sliderContainer) return;

  const cards = sliderContainer.querySelector(cardSelector);
  const dots = sliderContainer.querySelectorAll(dotsSelector);
  if (!cards || dots.length === 0) return;

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function setPosition() {
    cards.style.transition = 'transform 0.3s ease';
    cards.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle(activeClass, i === index);
    });
  }

  function moveSlider(diff) {
    cards.style.transition = 'none';
    cards.style.transform = `translateX(calc(-${index * 100}% - ${diff}px))`;
  }

  // Toque (mobile) - melhorado para não interferir com menu
  cards.addEventListener('touchstart', (e) => {
    // Só inicia se o menu não estiver aberto
    if (navLinks?.classList.contains('active')) return;
    
    e.stopPropagation();
    startX = e.touches[0].clientX;
    isDragging = true;
    cards.style.transition = 'none';
  }, { passive: true });

  cards.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (navLinks?.classList.contains('active')) {
      isDragging = false;
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    moveSlider(diff);
  }, { passive: false });

  cards.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    const diff = startX - currentX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > threshold && index < dots.length - 1) {
        index++;
      } else if (diff < -threshold && index > 0) {
        index--;
      }
    }
    setPosition();
    isDragging = false;
  }, { passive: true });

  // Clique nos dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      setPosition();
    });
  });

  setPosition();
}

// ===== ANIMAÇÕES NO SCROLL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observa elementos com classes de animação
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
  animatedElements.forEach(el => observer.observe(el));
}

// Adiciona classes de animação aos elementos principais
function addAnimationClasses() {
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    if (index % 2 === 0) {
      section.classList.add('fade-in-up');
    } else {
      section.classList.add('fade-in-left');
    }
  });

  const cards = document.querySelectorAll('.card, .card-resultado, .card-depoimento, .card-equipe');
  cards.forEach((card, index) => {
    if (index % 2 === 0) {
      card.classList.add('fade-in-up');
    } else {
      card.classList.add('fade-in-right');
    }
  });
}

// ===== SMOOTH SCROLL PARA LINKS DE ÂNCORA =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Fecha menu mobile se estiver aberto
        if (navLinks?.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (toggleIcon) {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
          }
        }
      }
    }
  });
});

// Inicializa todos os sliders e animações
document.addEventListener("DOMContentLoaded", () => {
  // Sliders (apenas mobile)
  if (window.innerWidth <= 768) {
    initSlider(".slider-container", ".cards-especialidades", ".dots span", "active");
    initSlider(".slider-container-resultados", ".cards-resultados", ".dots-resultados span", "active-resultado");
    initSlider(".slider-container-depoimentos", ".cards-depoimentos", ".dots-depoimentos span", "active-depoimento");
    initSlider(".slider-container-equipe", ".cards-equipe", ".dots-equipe span", "active-equipe");
  }
  
  // Animações de scroll
  addAnimationClasses();
  initScrollAnimations();
  
  // Adiciona animação inicial aos elementos do hero
  const heroElements = document.querySelectorAll('.hero .text > *');
  heroElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;
  });
});
