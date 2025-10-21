// MENU
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const toggleIcon = toggle.querySelector('i');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  if (toggleIcon.classList.contains('fa-bars')) {
    toggleIcon.classList.replace('fa-bars', 'fa-times');
  } else {
    toggleIcon.classList.replace('fa-times', 'fa-bars');
  }
});

// Função genérica para criar sliders independentes
function initSlider(containerSelector, cardSelector, dotsSelector, activeClass) {
  const sliderContainer = document.querySelector(containerSelector);
  const cards = sliderContainer.querySelector(cardSelector);
  const dots = sliderContainer.querySelectorAll(dotsSelector);

  let index = 0;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  // Atualiza posição do slider
  function setPosition() {
    cards.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle(activeClass, i === index);
    });
  }

  // Evento de clique nos dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      setPosition();
    });
  });

  // Eventos de toque (mobile)
  cards.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  cards.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    if (diff > 50 && index < dots.length - 1) {
      index++;
      setPosition();
      isDragging = false;
    } else if (diff < -50 && index > 0) {
      index--;
      setPosition();
      isDragging = false;
    }
  });

  cards.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Inicia na posição inicial
  setPosition();
}

// Inicializar ambos os sliders
document.addEventListener("DOMContentLoaded", () => {
  initSlider(".slider-container", ".cards-especialidades", ".dots span", "active");
  initSlider(".slider-container-resultados", ".cards-resultados", ".dots-resultados span", "active-resultado");
});