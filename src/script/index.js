const hamburger = document.querySelector('.header__hamburger');
const navigationContainer = document.querySelector('.navigation');
let hambugerIsOpen = false;

hamburger.addEventListener('click', () => {
    navigationContainer.style.display = 'flex';
    hamburger.style.display = 'none';
    hambugerIsOpen = true;
});

const closingButton = document.querySelector('.navigation__close-btn');
closingButton.addEventListener('click', () => {
    if (hambugerIsOpen) {
        navigationContainer.style.display = 'none';
        hamburger.style.display = 'block';
        hambugerIsOpen = false;
    }
});
