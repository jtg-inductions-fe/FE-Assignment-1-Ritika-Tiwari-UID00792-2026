import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

const testimonials = document.querySelector('.testimonials__list');
let response = await fetch('./src/script/slides.json');
let testimonialsData = await response.json();

testimonials.innerHTML = testimonialsData
    .map(
        ({ name, role, image, rating, text }) => `
<article class="testimonials__slides swiper-slide">
<img src="${image}" alt="${name}" class="testimonials__image"/>
<h3 class="testimonials__author">
    <span class="testimonials__name">${name}</span>
    <span class="testimonials__role">/${role}</span>
</h3>
<div class="testimonials__rating">${'<i class="icon-yellow-star icon--small"></i>'.repeat(rating)}</div>
<p class="testimonials__description">${text}</p>
</article>
`,
    )
    .join('');
const previousBtn = document.querySelector('.testimonials__button--previous');
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
