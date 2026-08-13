/*
Implementation of opening and closing logic of hamburger using toggle class.
 */
const hamburger = document.querySelector('.header__hamburger');
const header = document.querySelector('.header');
const closingButton = document.querySelector('.navigation__close-btn');

/**
 * Function for toggle navigation open and close state
 */
function toggleNav() {
    header.classList.toggle('navigation-open');
}

/**
 * Function for closing navigation menu
 */
function closeNav() {
    header.classList.remove('navigation-open');
}

hamburger.addEventListener('click', toggleNav);
closingButton.addEventListener('click', closeNav);

document.addEventListener('keypress', (e) => {
    if (e.key == 'Escape') {
        closeNav();
    }
});

document.addEventListener('click', (e) => {
    if (
        header.classList.contains('navigation-open') &&
        !header.contains(e.target)
    ) {
        closeNav();
    }
});

closeNav();
