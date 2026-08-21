const DEALS_API_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';
const MAX_WHEEL_SLICES = 4;

/**
 * Drawer to show spin wheel and its functionality
 */
export const drawer = () => {
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
        specialOfferContainer.classList.add('special-offer__container--close');
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.classList.remove('no-scroll');
            specialOfferContainer.classList.remove(
                'special-offer__container--close',
            );
        }, 1000);
    };

    specialDeals.addEventListener('click', openDrawer);
    overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeDrawer();
        }
    });

    closeBtn.addEventListener('click', (e) => {
        closeDrawer();
        e.stopPropagation();
    });

    //fetch api
    let dealsOnWheel = [];
    const unloackedDeals = [
        { label: '20% Off Flights', promoCode: 'FLY20-X8J2', validFor: 13 },
        { label: 'VIP Lounge', promoCode: 'VIP-LMN9', validFor: 29 },
    ];
    async function fetchDeals() {
        const response = await fetch(
            'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/ ',
        );
        const data = await response.json();
        //filter null values
        for (let i in data) {
            if (data[i]['validFor'] == null) {
                data[i]['validFor'] = 7;
            }
        }
        dealsOnWheel = data.filter(
            (Item) =>
                !unloackedDeals.some(
                    (excludeItem) => excludeItem.label === Item.label,
                ),
        );
        spinWheel(dealsOnWheel);
    }
    fetchDeals();

    /**
     * Async function to fetch special offer deals from api and initialize the deals
     */
    const fetchDeals = async () => {
        const spinner = document.querySelector('.special-offer__spinner');
        const loader = document.querySelector('.special-offer__loader');

        if (!winPin) {
            winPin.style.color = wheelBaseColor;
        }
        if (spinner) spinner.style.display = 'none';
        if (loader) loader.style.display = 'flex';
        try {
            const response = await fetch(DEALS_API_URL);
            const data = await response.json();
            const defaultValidityDuration = 7;
            // filter null values
            for (const item in data) {
                data[item].validFor ??= defaultValidityDuration;
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
            if (e) {
                if (spinner) spinner.style.display = 'none';
                spinner.innerHTML =
                    '<span>Something went wrong, Try again later.</span>';
            }
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
            if (e) window.alert('Something went wrong, Try again later.');
        }
    };

    /**
     * function to update unlocked deals count on bubble on the button
     */
    const displayCountOfUnlockedDeals = (count) => {
        const bubble = document.querySelector('.special-offer__bubble-counter');
        bubble.textContent = count;
    };

    let rotateDegreeOfLabel = 0;
    let sliceAngle = 0;
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

        sliceAngle = 360 / items.length;
        rotateDegreeOfLabel = sliceAngle / 2;
        items.forEach((item, index) => {
            const angle = index * sliceAngle;
            const sliceText = document.createElement('span');
            sliceText.setAttribute(
                'class',
                'special-offer__spinner-items-label',
            );
            sliceText.textContent = item.label;
            sliceText.style.transform = `rotate(${angle - rotateDegreeOfLabel}deg)`;
            slices[index].appendChild(sliceText);
        });
    };
    /**
     * Spin wheel logic in js and dynamically render the items in wheel
     */
    const spinWheel = (dealsOnWheel) => {
        let isSpinning = false;
        let currentRotation = 0;

        if (!dealsOnWheel?.length) return;
        const wheel = document.querySelector('.special-offer__spinner');
        const spinBtn = document.querySelector('.special-offer__spin-btn');

        if (!wheel || !spinBtn) return;
        let winningStatusTemplate = document.getElementById(
            'wining-status-template',
        );
        let clone = winningStatusTemplate.content.cloneNode(true);
        let unlockedDealsCard = clone.firstElementChild;
        renderSlice(
            dealsOnWheel.slice(
                0,
                Math.min(MAX_WHEEL_SLICES, dealsOnWheel.length),
            ),
        );
        spinBtn.addEventListener('click', (e) => {
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
            sliceAngle = 360 / items.length;
            if (specialOfferContainer.contains(unlockedDealsCard)) {
                unlockedDealsCard.style.display = 'none';
            }
            const randomIndex = Math.floor(Math.random() * items.length);

            // calcualtion of the target angle of the winner slice from its initial angle
            const targetAngle = randomIndex * sliceAngle;

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
                unlockedDealsCard.style.display = 'block';

                // Check to ensure unlock data structure do not contain duplicate deals
                if (!unlockedDeals.includes(winningDeal)) {
                    unlockedDeals.push(winningDeal);
                }

                // Calling unlock deals function to show the number of deals into bubble
                displayCountOfUnlockedDeals(unlockedDeals.length);
                const dealName = document.querySelector(
                    '.special-offer__deal-name',
                );
                const dealValidity = document.querySelector(
                    '.special-offer__deal-validity',
                );
                const dealCode = document.querySelector(
                    '.special-offer__deal-code',
                );
                if (dealName) dealName.textContent = winningDeal.label;
                if (dealValidity)
                    dealValidity.textContent = `Expires in ${winningDeal.validFor}d`;
                if (dealCode) dealCode.textContent = winningDeal.promoCode;

                const copyIcon = document.querySelector('.copy-icon');
                copyIcon.addEventListener('click', (e) => {
                    copyCodeToClipboard(winningDeal.promoCode, copyIcon);
                    e.stopPropagation();
                });
                isSpinning = false;
            }, 4000);
            e.stopPropagation();
        });
    };
};
