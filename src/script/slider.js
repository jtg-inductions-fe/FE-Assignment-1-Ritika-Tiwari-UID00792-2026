import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

export const slider = () => {
    const testimonials = document.querySelector('.testimonials__list');

    /**
     * Function for render data in slides from slides.json file
     */
    const renderData = (name, role, image, rating, text) => {
        return `
<article class="testimonials__slides swiper-slide">
<img src="${image}" alt="${name}" class="testimonials__image"/>
<div class="testimonials__data-container">
<h3 class="testimonials__author">
    <span class="testimonials__name">${name}</span>
    <span class="testimonials__role">/${role}</span>
</h3>
<div class="testimonials__rating">${'<i class="icon-yellow-star icon--medium"></i>'.repeat(rating)}</div>

</div>
<p class="testimonials__description">${text}</p>
</article>
`;
    };

    /**
     * Async Function for fetch and render data in slides from slides.json file and initialization of swiper instance
     */
    const loadData = async () => {
        let response = await fetch('/data/slides.json');
        let testimonialsData = await response.json();
        testimonials.innerHTML = testimonialsData
            .map(({ name, role, image, rating, text }) =>
                renderData(name, role, image, rating, text),
            )
            .join('');

        const previousBtn = document.querySelector(
            '.testimonials__button--previous',
        );
        const nextBtn = document.querySelector('.testimonials__button--next');
        const pagination = document.querySelector('.testimonials__pagination');

        new Swiper('.testimonials__slider', {
            modules: [Navigation, Pagination],
            slidesPreView: 1,
            spaceBetween: 24,
            navigation: {
                prevEl: previousBtn,
                nextEl: nextBtn,
            },
            pagination: {
                el: pagination,
                clickable: true,
            },
        });
    };
    loadData();
};
