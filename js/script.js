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

// CARDS
const slider = document.querySelector('.cards-especialidades');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let dragging = false;

function setPositionByIndex() {
  currentTranslate = currentIndex * -slider.clientWidth;
  slider.style.transform = `translateX(${currentTranslate}px)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

slider.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  dragging = true;
});

slider.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  const currentX = e.touches[0].clientX;
  const diff = currentX - startX;
  slider.style.transform = `translateX(${prevTranslate + diff}px)`;
});

slider.addEventListener('touchend', (e) => {
  dragging = false;
  const movedBy = e.changedTouches[0].clientX - startX;

  if (movedBy < -50 && currentIndex < dots.length - 1) currentIndex++;
  if (movedBy > 50 && currentIndex > 0) currentIndex--;

  setPositionByIndex();
  prevTranslate = currentTranslate;
});

window.addEventListener('resize', setPositionByIndex);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    setPositionByIndex();
    prevTranslate = currentTranslate;
  });
});

// === SLIDER RESULTADOS ===
const resultadosContainer = document.querySelector('.cards-resultados');
const resultadoCards = document.querySelectorAll('.card-resultado');
const dotsResultados = document.querySelectorAll('.dots-resultados .dot');

let currentSlideResultados = 0;
let endX = 0;

function updateSlideResultados() {
  resultadosContainer.style.transform = `translateX(-${currentSlideResultados * 100}%)`;
  dotsResultados.forEach(dot => dot.classList.remove('active'));
  dotsResultados[currentSlideResultados].classList.add('active');
}

dotsResultados.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlideResultados = index;
    updateSlideResultados();
  });
});

resultadosContainer.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

resultadosContainer.addEventListener('touchend', e => {
  endX = e.changedTouches[0].clientX;
  handleSwipeResultados();
});

function handleSwipeResultados() {
  if (startX - endX > 50 && currentSlideResultados < resultadoCards.length - 1) {
    currentSlideResultados++;
  } else if (endX - startX > 50 && currentSlideResultados > 0) {
    currentSlideResultados--;
  }
  updateSlideResultados();
}