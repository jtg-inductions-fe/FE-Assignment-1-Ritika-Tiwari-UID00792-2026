export function accodion() {
    const footerSection = Array.from(
        document.querySelectorAll('.footer__section'),
    );

    // Toggle footer section on button click
    footerSection.forEach((section) => {
        const button = section.querySelector('.footer__section-header');
        button.addEventListener('click', () => {
            section.classList.toggle('footer__section--open');
        });
    });
}
