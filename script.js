const slider = document.querySelector('[data-slider]');
const track = slider?.querySelector('.slider-track');
const slides = track ? Array.from(track.children) : [];
const dotsContainer = document.querySelector('.slider-dots');

if (dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'slider-dot';
    if (index === 0) dot.classList.add('is-active');
    dotsContainer.appendChild(dot);
  });
}

const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
let currentIndex = 0;

const updateSlider = (index) => {
  if (!track) return;
  currentIndex = (index + slides.length) % slides.length;
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.scrollTo({
    left: currentIndex * (slideWidth + 16),
    behavior: 'smooth',
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === currentIndex);
  });
};

slider?.querySelector('.prev')?.addEventListener('click', () => {
  updateSlider(currentIndex - 1);
});

slider?.querySelector('.next')?.addEventListener('click', () => {
  updateSlider(currentIndex + 1);
});

if (track) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener('mousedown', (event) => {
    isDown = true;
    startX = event.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
  });

  track.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.2;
    track.scrollLeft = scrollLeft - walk;
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(document.querySelectorAll('main section'));

const setActiveNav = () => {
  const scrollPosition = window.scrollY + 160;
  let activeSection = sections[0];
  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeSection = section;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${activeSection.id}`);
  });
};

setActiveNav();
window.addEventListener('scroll', setActiveNav);
