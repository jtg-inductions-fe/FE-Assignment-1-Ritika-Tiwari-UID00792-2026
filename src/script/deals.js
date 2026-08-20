export function Drawer() {
    const overlay = document.body.querySelector('.special-offer');
    const specialDeals = document.getElementById('deals');
    const header = document.querySelector('.header__container');
    const closeBtn = document.querySelector('.special-offer__close-btn');

    function closeDrawer() {
        overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    specialDeals.addEventListener('click', () => {
        header.classList.remove('navigation-open');
        overlay.style.display = 'flex';
        document.body.classList.add('no-scroll');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
            closeDrawer();
        }
    });

    closeBtn.addEventListener('click', () => {
        closeDrawer();
    });
}
