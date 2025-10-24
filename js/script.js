// MENU
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const toggleIcon = toggle.querySelector('i');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  toggleIcon.classList.toggle('fa-times');
  toggleIcon.classList.toggle('fa-bars');
});

// ===== SLIDERS GENÉRICOS =====
function initSlider(containerSelector, cardSelector, dotsSelector, activeClass) {
  const sliderContainer = document.querySelector(containerSelector);
  if (!sliderContainer) return;

  const cards = sliderContainer.querySelector(cardSelector);
  const dots = sliderContainer.querySelectorAll(dotsSelector);

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

  // Toque (mobile)
  cards.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    cards.style.transition = 'none';
  });

  cards.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    moveSlider(diff);
  });

  cards.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - currentX;
    const threshold = 50;
    if (diff > threshold && index < dots.length - 1) {
      index++;
    } else if (diff < -threshold && index > 0) {
      index--;
    }
    setPosition();
    isDragging = false;
  });

  // Clique nos dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      setPosition();
    });
  });

  setPosition();
}

// Inicializa todos os sliders
document.addEventListener("DOMContentLoaded", () => {
  initSlider(".slider-container", ".cards-especialidades", ".dots span", "active");
  initSlider(".slider-container-resultados", ".cards-resultados", ".dots-resultados span", "active-resultado");
  initSlider(".slider-container-depoimentos", ".cards-depoimentos", ".dots-depoimentos span", "active-depoimento");
  initSlider(".slider-container-equipe", ".cards-equipe", ".dots-equipe span", "active-equipe");
});
