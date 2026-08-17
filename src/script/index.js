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
document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.navigation__link');

    navItems.forEach((item) => {
        item.addEventListener('click', function () {
            navItems.forEach((navItem) =>
                navItem.classList.remove('is-active'),
            );
            this.classList.add('is-active');
        });
    });
});

/**
 *  Function for create and render data in data points card from data.json file
 */
function renderData(value, title) {
    return `<div class="travel-point__data-point">
                                <span class="travel-point__data-item-value">${value}</span>
                                <span class="travel-point__data-item-title">${title}</span>
                            </div>`;
}

/**
 * Async Function for fetch and render data in data points card from data.json file
 */
async function loadData() {
    try {
        let response = await fetch('./src/script/data.json');
        let data = await response.json();
        const dataItemContainer = document.querySelector(
            '.travel-point__data-container',
        );
        for (let key in data[0]) {
            let title = key;
            let value = data[0][key];
            dataItemContainer.innerHTML += renderData(value, title);
        }
    } catch (e) {
        const dataPointContainer = document.querySelector(
            '.travel-point__data-container',
        );
        dataPointContainer.textContent = e;
    }
}

loadData();
