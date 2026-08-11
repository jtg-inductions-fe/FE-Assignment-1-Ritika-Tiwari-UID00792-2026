const hamburger = document.querySelector('.header__hamburger');
const header = document.querySelector('.header');
const closingButton = document.querySelector('.navigation__close-btn');

header.classList.remove('navigation-open');

hamburger.addEventListener('click', () => {
    header.classList.toggle('navigation-open');
});

closingButton.addEventListener('click', () => {
    header.classList.remove('navigation-open');
});
