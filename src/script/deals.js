/**
 * Drawer to show spin wheel and its functionality
 */
export const drawer = () => {
    const DEALS_API_URL =
        'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

    // colors variables import from colors.scss
    const colors = getComputedStyle(document.documentElement);
    const wheelBaseColor = colors.getPropertyValue('--wheel-base-color');
    const primaryWheelColor = colors.getPropertyValue('--wheel-color-primary');
    const successColor = colors.getPropertyValue('--copy-code-success');
    const textHeroColor = colors.getPropertyValue('--text-hero');

    const overlay = document.body.querySelector('.special-offer');
    const specialDeals = document.getElementById('deals');
    const specialOfferContainer = document.querySelector(
        '.special-offer__container',
    );
    const header = document.querySelector('.header__container');
    const closeBtn = document.querySelector('.special-offer__close-btn');
    const winPin = document.querySelector('.icon-triangle-down');

    /**
     * Top level unlocked deals data-structure
     */
    const unlockedDeals = [];

    /**
     * Drawer open state handler function
     */
    const openDrawer = () => {
        header.classList.remove('navigation-open');
        overlay.style.display = 'flex';
        document.body.classList.add('no-scroll');
    };

    /**
     * Drawer close state handler function
     */
    const closeDrawer = () => {
        overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    };

    specialDeals.addEventListener('click', openDrawer);
    overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeDrawer();
        }
    });
    closeBtn.addEventListener('click', closeDrawer);

    /**
     * Async function to fetch special offer deals from api and initialize the deals
     */
    const fetchDeals = async () => {
        const spinner = document.querySelector('.special-offer__spinner');
        const loader = document.querySelector('.special-offer__loader');

        if (typeof winPin !== 'undefined') {
            winPin.style.color = wheelBaseColor;
        }
        if (spinner) spinner.style.display = 'none';
        if (loader) loader.style.display = 'flex';
        try {
            const response = await fetch(DEALS_API_URL);
            const data = await response.json();
            const defaultValidityDuration = 7;

            // filter null values
            for (let i in data) {
                let validity = data[i]['validFor'];
                validity = validity ?? defaultValidityDuration;
            }

            // filter unlocked deals from the deals coming from api to show locked deals on wheel
            let dealsOnWheel = data.filter(
                (item) =>
                    !unlockedDeals.some(
                        (unlocked) => unlocked.label === item.label,
                    ),
            );

            spinWheel(dealsOnWheel);
        } catch (e) {
            void e;
        } finally {
            if (spinner) spinner.style.display = 'flex';
            if (loader) loader.style.display = 'none';
        }
    };
    fetchDeals();

    /**
     * Async function to copy code for deals on clipboard
     */
    const copyCodeToClipboard = async (code, copyIcon) => {
        try {
            await navigator.clipboard.writeText(code);
            copyIcon.classList.remove('icon-copy');
            copyIcon.classList.add('icon-check-square');

            copyIcon.style.color = successColor;

            // reset icon state after 1 second
            setTimeout(() => {
                copyIcon.classList.remove('icon-check-sqaure');
                copyIcon.classList.add('icon-copy');
                copyIcon.style.color = primaryWheelColor;
            }, 1000);
        } catch (e) {
            void e;
        }
    };

    /**
     * function to update unlocked deals count on bubble on the button
     */
    const displayCountOfUnlockedDeals = (count) => {
        const bubble = document.querySelector('.special-offer__bubble-counter');
        bubble.textContent = count;
    };

    const slicePosition = [0, -90, 90, 180];
    let rotateDegreeOfLabel = 0;
    /**
     * function to render fresh deals on slide on every spin
     */
    const renderSlice = (items) => {
        const slices = document.querySelectorAll(
            '.special-offer__spinner-items',
        );

        slices.forEach((slice) => {
            slice.replaceChildren();
        });

        winPin.style.color = primaryWheelColor;

        const sliceAngle = 360 / items.length;
        rotateDegreeOfLabel = sliceAngle / 2;
        items.forEach((item, index) => {
            const sliceText = document.createElement('span');
            sliceText.setAttribute(
                'class',
                'special-offer__spinner-items-label',
            );
            sliceText.textContent = item.label;
            sliceText.style.transform = `rotate(${slicePosition[index] - rotateDegreeOfLabel}deg)`;
            slices[index].appendChild(sliceText);
        });
    };

    /**
     * Spin wheel logic in js and dynamically render the items in wheel
     */
    const spinWheel = (dealsOnWheel) => {
        const MAX_WHEEL_SLICES = 4;
        let isSpinning = false;
        let currentRotation = 0;

        if (!dealsOnWheel?.length) return;
        const wheel = document.querySelector('.special-offer__spinner');
        const spinBtn = document.querySelector('.special-offer__spin-btn');

        if (!wheel || !spinBtn) return;
        let winningStatusTemplate = document.getElementById(
            'special-offer__wining-status-template',
        );
        let clone = winningStatusTemplate.content.cloneNode(true);
        let unloackedDealsCard = clone.firstElementChild;
        renderSlice(
            dealsOnWheel.slice(
                0,
                Math.min(MAX_WHEEL_SLICES, dealsOnWheel.length),
            ),
        );
        spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            const availableDeals = dealsOnWheel
                .filter((deal) => {
                    return !unlockedDeals.some((unlocked) => {
                        return unlocked.label === deal.label;
                    });
                })
                .sort((a, b) => a.validFor - b.validFor);
            if (!availableDeals.length) return;
            isSpinning = true;

            const items = availableDeals.slice(
                0,
                Math.min(MAX_WHEEL_SLICES, availableDeals.length),
            );

            renderSlice(items);

            if (specialOfferContainer.contains(unloackedDealsCard)) {
                unloackedDealsCard.style.display = 'none';
            }
            const randomIndex = Math.floor(Math.random() * items.length);

            // calcualtion of the target angle of the winner slice from its initial angle
            const targetAngle = slicePosition[randomIndex];

            // Add extra rotation to the wheel
            const extraRotation = 360 * 6;

            /* Calculate the exact degrees needed to move from the current position,
            we subtract the target angle to rotate the wheel backwards so the slice lands at the top pointer */
            const rotation =
                extraRotation + (360 - (currentRotation % 360)) - targetAngle;

            currentRotation += rotation;
            wheel.style.transform = `rotate(${currentRotation + rotateDegreeOfLabel}deg)`;

            setTimeout(() => {
                const sliceTextList = document.querySelectorAll(
                    '.special-offer__spinner-items-label',
                );
                sliceTextList[randomIndex].style.color = textHeroColor;
                const winningDeal = items[randomIndex];
                specialOfferContainer.insertBefore(
                    clone,
                    document.querySelector(
                        '.special-offer__view-unlock-deals-btn',
                    ),
                );
                unloackedDealsCard.style.display = 'block';

                // Check to ensure unlock data structure do not contain duplicate deals
                if (!unlockedDeals.includes(winningDeal)) {
                    unlockedDeals.push(winningDeal);
                }

                // Calling unlock deals function to show the number of deals into bubble
                displayCountOfUnlockedDeals(unlockedDeals.length);
                unloackedDealsCard.children[1].children[0].children[0].children[0].textContent =
                    winningDeal.label;
                unloackedDealsCard.children[1].children[0].children[0].children[1].textContent = `Expires in ${winningDeal.validFor}d`;
                unloackedDealsCard.children[1].children[0].children[1].children[0].textContent =
                    winningDeal.promoCode;

                const copyIcon = document.querySelector('.copy-icon');
                copyIcon.addEventListener('click', () => {
                    copyCodeToClipboard(winningDeal.promoCode, copyIcon);
                });
                isSpinning = false;
            }, 4000);
        });
    };
};
