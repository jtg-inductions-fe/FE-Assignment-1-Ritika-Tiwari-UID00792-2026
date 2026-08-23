<<<<<<< HEAD
/**
 * Function for accordion in the footer
 */
=======
>>>>>>> aa70ba7 ([RT_A1_08]: Improve copy icon change state when code is copied to clip board.)
export const accodion = () => {
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
};
