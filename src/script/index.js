/*
Implementation of opening and closing logic of hamburger using toggle class.
 */
const hamburger = document.querySelector('.header__container__hamburger');
const header = document.querySelector('.header__container');
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

document.addEventListener('keydown', (e) => {
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

// State updation for active links of navbar
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navigation__link');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5, // Trigger when 50% of the section is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
                link.classList.toggle(
                    'is-active',
                    link.getAttribute('href') === `#${id}`,
                );
            });
        }
    });
}, observerOptions);

sections.forEach((section) => observer.observe(section));
