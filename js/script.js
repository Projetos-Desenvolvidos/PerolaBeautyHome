// ===== FUNÇÕES GLOBAIS DE SCROLL (disponíveis imediatamente) =====
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    const navbar = document.querySelector('.navbar');
    const headerHeight = navbar ? navbar.offsetHeight : 100;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });
    
    // Fecha menu mobile se estiver aberto
    const navLinks = document.querySelector('.nav-links');
    const toggleIcon = document.querySelector('.menu-toggle i');
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
      }
    }
  }
}

function scrollToForm() {
  scrollToSection('contato');
}

// Torna as funções globais imediatamente
window.scrollToSection = scrollToSection;
window.scrollToForm = scrollToForm;

// MENU
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const toggleIcon = toggle?.querySelector('i');

// Função para fechar o menu mobile
function closeMobileMenu() {
  if (navLinks && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    if (toggleIcon) {
      toggleIcon.classList.remove('fa-times');
      toggleIcon.classList.add('fa-bars');
    }
  }
}

// Torna a função global
window.closeMobileMenu = closeMobileMenu;

// ===== MODAL DE IMAGEM =====
function openImageModal(imageSrc) {
  // Só abre no mobile
  if (window.innerWidth <= 768) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
      modalImg.src = imageSrc;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Previne scroll do body
    }
  }
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restaura scroll do body
  }
}

// Torna as funções globais
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;

// Fecha modal ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

if (toggle && toggleIcon) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggleIcon.classList.toggle('fa-times');
    toggleIcon.classList.toggle('fa-bars');
  });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Verifica o estado inicial ao carregar
  if (window.pageYOffset > 50) {
    navbar.classList.add('scrolled');
  }
}

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
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;
  let isHorizontal = false;

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

  // Toque (mobile) - melhorado para não interferir com scroll vertical
  cards.addEventListener('touchstart', (e) => {
    // Só inicia se o menu não estiver aberto
    if (navLinks && navLinks.classList.contains('active')) {
      isDragging = false;
      return;
    }
    
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    isHorizontal = false;
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
    
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
    
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);
    
    // Detecta a direção do gesto após um movimento mínimo
    if (!isHorizontal && (diffX > 10 || diffY > 10)) {
      isHorizontal = diffX > diffY;
    }
    
    // Só previne o scroll se o gesto for claramente horizontal
    if (isHorizontal && diffX > 5) {
      e.preventDefault();
      e.stopPropagation();
      const diff = startX - currentX;
      moveSlider(diff);
    } else if (!isHorizontal && diffY > 5) {
      // Se for vertical, cancela o drag e permite scroll
      isDragging = false;
      setPosition();
    }
  }, { passive: false });

  cards.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const diffY = Math.abs(startY - currentY);
    const threshold = 50;
    
    // Só muda o slide se o movimento foi horizontal e significativo
    if (isHorizontal && Math.abs(diff) > threshold && Math.abs(diff) > diffY) {
      if (diff > threshold && index < dots.length - 1) {
        index++;
      } else if (diff < -threshold && index > 0) {
        index--;
      }
    }
    
    setPosition();
    isDragging = false;
    isHorizontal = false;
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
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach(anchor => {
    // Só adiciona listener se não tiver onclick
    if (!anchor.getAttribute('onclick')) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignora links vazios
        if (!href || href === '#' || href === '') {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const sectionId = href.replace('#', '');
        scrollToSection(sectionId);
      });
    }
  });
}

// ===== CARROSSEL INFINITO DE RESULTADOS =====
function initInfiniteCarousel() {
  const container = document.querySelector('.slider-container-resultados');
  const cardsContainer = document.querySelector('.cards-resultados');
  if (!container || !cardsContainer) return;

  const originalCards = Array.from(cardsContainer.querySelectorAll('.card-resultado'));
  if (originalCards.length === 0) return;

  const cardCount = originalCards.length;

  // Duplica os cards para criar o efeito infinito (3 conjuntos: original + 2 cópias)
  for (let i = 0; i < 2; i++) {
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      cardsContainer.appendChild(clone);
    });
  }

  let currentIndex = 0;
  let isTransitioning = false;
  let carouselInterval = null;

  // Calcula a largura de um card (incluindo gap)
  function getCardWidth() {
    const firstCard = cardsContainer.querySelector('.card-resultado');
    if (!firstCard) return 0;
    
    const cardWidth = firstCard.offsetWidth;
    const gapValue = window.getComputedStyle(cardsContainer).gap;
    let gap = 0;
    
    if (gapValue && gapValue !== 'normal') {
      // Pega o primeiro valor do gap (gap pode ter row e column)
      gap = parseInt(gapValue.split(' ')[0]) || 0;
    } else {
      // Gap padrão baseado no tamanho da tela
      gap = window.innerWidth <= 768 ? 0 : 28;
    }
    
    return cardWidth + gap;
  }

  function moveCarousel() {
    if (isTransitioning) return;
    
    const cardWidth = getCardWidth();
    if (cardWidth === 0) return;

    currentIndex++;
    isTransitioning = true;
    
    cardsContainer.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    cardsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Quando chega ao final do primeiro conjunto, reseta sem transição
    setTimeout(() => {
      if (currentIndex >= cardCount) {
        cardsContainer.style.transition = 'none';
        currentIndex = 0;
        cardsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Força reflow para aplicar a mudança
        void cardsContainer.offsetWidth;
        
        // Restaura transição após um pequeno delay
        setTimeout(() => {
          isTransitioning = false;
        }, 50);
      } else {
        isTransitioning = false;
      }
    }, 600);
  }

  function startCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
    }
    carouselInterval = setInterval(moveCarousel, 2000); // Muda a cada 2 segundos
  }

  function stopCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  // Inicia o carrossel automático
  startCarousel();

  // O carrossel continua sempre, mesmo ao clicar ou passar o mouse

  // Inicializa a posição
  setTimeout(() => {
    const cardWidth = getCardWidth();
    if (cardWidth > 0) {
      cardsContainer.style.transform = `translateX(0px)`;
    }
  }, 100);

  // Recalcula ao redimensionar
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newCardWidth = getCardWidth();
      if (newCardWidth > 0) {
        cardsContainer.style.transition = 'none';
        currentIndex = 0;
        cardsContainer.style.transform = `translateX(0px)`;
        isTransitioning = false;
        
        // Carrossel continua sempre
      }
    }, 250);
  });
}

// Função para inicializar sliders mobile
function initMobileSliders() {
  if (window.innerWidth <= 768) {
    initSlider(".slider-container", ".cards-especialidades", ".dots span", "active");
    // Não inicializa o slider de resultados no mobile, usa o carrossel infinito
    initSlider(".slider-container-depoimentos", ".cards-depoimentos", ".dots-depoimentos span", "active-depoimento");
    initSlider(".slider-container-equipe", ".cards-equipe", ".dots-equipe span", "active-equipe");
  }
}

// Inicializa todos os sliders e animações
document.addEventListener("DOMContentLoaded", () => {
  // Carrossel infinito de resultados (desktop e mobile)
  initInfiniteCarousel();
  
  // Sliders (apenas mobile)
  initMobileSliders();
  
  // Scroll suave para links
  initSmoothScroll();
  
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

