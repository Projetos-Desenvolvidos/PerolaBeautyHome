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
  if (!cards) return;

  const dots = sliderContainer.querySelectorAll(dotsSelector);
  if (dots.length === 0) return;

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
    if (navLinks && navLinks.classList.contains('active')) {
      isDragging = false;
      return;
    }
    
    e.stopPropagation();
    startX = e.touches[0].clientX;
    isDragging = true;
    cards.style.transition = 'none';
  }, { passive: true });

  cards.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    // Se o menu estiver aberto, cancela o drag
    if (navLinks && navLinks.classList.contains('active')) {
      isDragging = false;
      setPosition();
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

// ===== ANIMAÇÕES NO SCROLL MELHORADAS =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Remove o observer após a animação para melhor performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observa elementos com classes de animação
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale, .fade-in-rotate');
  animatedElements.forEach((el, index) => {
    // Adiciona delay progressivo para efeito cascata
    el.style.transitionDelay = `${(index % 3) * 0.1}s`;
    observer.observe(el);
  });
}

// Adiciona classes de animação aos elementos principais
function addAnimationClasses() {
  // Seções principais
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.classList.add('fade-in-up');
  });

  // Títulos das seções
  const titles = document.querySelectorAll('h2, .titulo-especialidades, .titulo-resultados, .titulo-depoimentos, .titulo-equipe, .formulario-titulo');
  titles.forEach((title, index) => {
    if (index % 2 === 0) {
      title.classList.add('fade-in-left');
    } else {
      title.classList.add('fade-in-right');
    }
  });

  // Cards de especialidades
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.classList.add('fade-in-scale');
    card.style.transitionDelay = `${index * 0.15}s`;
  });

  // Cards de resultados
  const resultCards = document.querySelectorAll('.card-resultado');
  resultCards.forEach((card, index) => {
    card.classList.add('fade-in-up');
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Cards de depoimentos
  const depoimentoCards = document.querySelectorAll('.card-depoimento');
  depoimentoCards.forEach((card, index) => {
    if (index % 2 === 0) {
      card.classList.add('fade-in-left');
    } else {
      card.classList.add('fade-in-right');
    }
    card.style.transitionDelay = `${index * 0.12}s`;
  });

  // Cards de equipe
  const equipeCards = document.querySelectorAll('.card-equipe');
  equipeCards.forEach((card, index) => {
    card.classList.add('fade-in-scale');
    card.style.transitionDelay = `${index * 0.2}s`;
  });

  // Subtítulos
  const subtitles = document.querySelectorAll('.subtitulo-resultados, .subtitulo-equipe, .formulario-subtitulo, .avaliacao-texto');
  subtitles.forEach(subtitle => {
    subtitle.classList.add('fade-in-up');
  });

  // Formulário
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach((group, index) => {
    group.classList.add('fade-in-up');
    group.style.transitionDelay = `${index * 0.1}s`;
  });

  // Pérola decorativa
  const perola = document.querySelector('.perola-container');
  if (perola) {
    perola.classList.add('fade-in-scale');
  }

  // Footer
  const footer = document.querySelector('.footer');
  if (footer) {
    footer.classList.add('fade-in-up');
  }

  // Cards de benefícios
  const beneficioCards = document.querySelectorAll('.card-beneficio');
  beneficioCards.forEach((card, index) => {
    card.classList.add('fade-in-scale');
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Cards de promoções
  const promocaoCards = document.querySelectorAll('.card-promocao');
  promocaoCards.forEach((card, index) => {
    card.classList.add('fade-in-up');
    card.style.transitionDelay = `${index * 0.15}s`;
  });

  // Itens FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    item.classList.add('fade-in-up');
    item.style.transitionDelay = `${index * 0.08}s`;
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

// Função para inicializar sliders mobile
function initMobileSliders() {
  if (window.innerWidth <= 768) {
    initSlider(".slider-container", ".cards-especialidades", ".dots span", "active");
    initSlider(".slider-container-resultados", ".cards-resultados", ".dots-resultados span", "active-resultado");
    initSlider(".slider-container-depoimentos", ".cards-depoimentos", ".dots-depoimentos span", "active-depoimento");
    initSlider(".slider-container-equipe", ".cards-equipe", ".dots-equipe span", "active-equipe");
  }
}

// Inicializa todos os sliders e animações
document.addEventListener("DOMContentLoaded", () => {
  // Sliders (apenas mobile)
  initMobileSliders();
  
  // Animações de scroll
  addAnimationClasses();
  initScrollAnimations();
  
  // FAQ interativo
  initFAQ();
  
  // Adiciona animação inicial aos elementos do hero
  const heroElements = document.querySelectorAll('.hero .text > *');
  heroElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;
  });

  // Anima o hero imediatamente ao carregar
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('visible');
  }

  // Anima elementos do hero com delay
  setTimeout(() => {
    heroElements.forEach((el, index) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 100);
});

// ===== FAQ INTERATIVO =====
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha todos os outros itens
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Abre/fecha o item clicado
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

// Reinicializa sliders ao redimensionar (se necessário)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth <= 768) {
      initMobileSliders();
    }
  }, 250);
});
