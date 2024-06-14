'use strict';

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button =>
  button.addEventListener('click', openModalWindow)
);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

btnScrollto.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// добавляєм eventlistener для батька всіх потрібних елементів
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // визначити target елемент
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});

// вкладка
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clickButton = e.target.closest('.operations__tab');

  // guard clause - пункт охорони
  if (!clickButton) return;

  // active tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickButton.classList.add('operations__tab--active');

  //active content
  tabContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickButton.dataset.tab}`)
    .classList.add('operations__content--active');
});

// анімація потускання

const navLinksHoverAnimation = function (e) {
  // console.log(this)
  // console.log(e.currentTarget)
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(el => {
      if (el !== linkOver) el.style.opacity = this;
    });
    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
};

const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));

nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const getStickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// поява розділів(секцій) в сайті

const allSections = document.querySelectorAll('.section');

const appearanceSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.25,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading для світлин
const lazyImages = document.querySelectorAll('img[data-src]');

const loadImages = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  // міняємо на високе світлини з високими розширеннями
  entry.target.src = entry.target.dataset.src;

  // щоб світлини не показували з малою якістю
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.5,
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));

// Cтворення слайдера

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slidesNumber = slides.length;
let currenstSlide = 0;
const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

createDots();

const activateCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const moveToSlide = function (slide) {
  slides.forEach((s, index) => {
    s.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
};

activateCurrentDot(0);

moveToSlide(0);

const nextSlide = function () {
  if (currenstSlide === slidesNumber - 1) {
    currenstSlide = 0;
  } else {
    currenstSlide++;
  }
  moveToSlide(currenstSlide);
  activateCurrentDot(currenstSlide);
};

const previousSlide = function () {
  if (currenstSlide === 0) {
    currenstSlide = slidesNumber - 1;
  } else {
    currenstSlide--;
  }
  moveToSlide(currenstSlide);
  activateCurrentDot(currenstSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') previousSlide();
  activateCurrentDot(currenstSlide);
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});
