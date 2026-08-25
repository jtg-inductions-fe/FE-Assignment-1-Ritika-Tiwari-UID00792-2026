const DEALS_API_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';
const MAX_WHEEL_SLICES = 4;
let dealTimerId = null;

/**
 * Drawer to show spin wheel and its functionality
 */
export const drawer = () => {
    const colors = getComputedStyle(document.documentElement);
    const wheelBaseColor = colors.getPropertyValue('--wheel-base-color');
    const primaryWheelColor = colors.getPropertyValue('--wheel-color-primary');
    const successColor = colors.getPropertyValue('--copy-code-success');
    const textHeroColor = colors.getPropertyValue('--text-hero');
    const textPrimaryVariant = colors.getPropertyValue('--text-primary-50');

    const overlay = document.body.querySelector('.special-offer');
    const specialDealsNav = document.getElementById('deals');
    const specialOfferContainer = document.querySelector(
        '.special-offer__container',
    );
    const header = document.querySelector('.header__container');
    const footer = document.querySelector('.footer__container');
    const closeBtn = document.querySelector('.special-offer__close-btn');
    const winPin = document.querySelector('.icon-triangle-down');
    const main = document.querySelector('main');
    const wheel = document.querySelector('.special-offer__spinner');
    const loader = document.querySelector('.special-offer__loader');

    /**
     * Top level unlocked deals data-structure
     */
    let unlockedDeals = JSON.parse(
        localStorage.getItem('unlockedDeals') || '[]',
    );

    /**
     * Drawer open state handler function
     */
    const openDrawer = () => {
        header.classList.remove('navigation-open');
        overlay.style.display = 'flex';
        document.body.classList.add('no-scroll');
        main.setAttribute('inert', '');
        header.setAttribute('inert', '');
        footer.setAttribute('inert', '');
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
        main.removeAttribute('inert');
        header.removeAttribute('inert');
        header.removeAttribute('inert');
    };

    specialDealsNav.addEventListener('click', openDrawer);
    overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeDrawer();
        }
    });

    closeBtn.addEventListener('click', (e) => {
        closeDrawer();
        e.stopPropagation();
    });

    /**
     * Async function to fetch special offer deals from api and initialize the deals
     */
    const fetchDeals = async () => {
        if (!winPin) {
            winPin.style.color = wheelBaseColor;
        }
        if (wheel) wheel.style.display = 'none';
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
                        (unlocked) => unlocked.promoCode === item.promoCode,
                    ),
            );

            spinWheel(dealsOnWheel);
        } catch (e) {
            if (e) {
                if (wheel) wheel.style.display = 'none';
                wheel.innerHTML =
                    '<span>Something went wrong, Try again later.</span>';
            }
        } finally {
            if (wheel) wheel.style.display = 'flex';
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
    displayCountOfUnlockedDeals(unlockedDeals.length);

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

    let winningStatusTemplate = document.getElementById(
        'wining-status-template',
    );
    let clone = winningStatusTemplate.content.cloneNode(true);
    let unlockedDealsCard = clone.firstElementChild;
    /**
     * Spin wheel logic in js and dynamically render the items in wheel
     */
    const spinWheel = (dealsOnWheel) => {
        let isSpinning = false;
        let currentRotation = 0;

        if (!dealsOnWheel?.length) return;
        const spinBtn = document.querySelector('.special-offer__spin-btn');
        const spinBtnText = document.querySelector(
            '.special-offer__spin-btn-text',
        );

        if (!wheel || !spinBtn) return;

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
                        return unlocked.promoCode === deal.promoCode;
                    });
                })
                .sort((a, b) => Number(a.validFor) - Number(b.validFor));
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
            spinBtn.classList.add('special-offer__spin-btn--disabled');
            spinBtnText.classList.add('special-offer__spin-btn-text--disabled');

            setTimeout(() => {
                spinBtn.classList.remove('special-offer__spin-btn--disabled');
                spinBtnText.classList.remove(
                    'special-offer__spin-btn-text--disabled',
                );
                //render fresh data on the wheel after spin
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
                if (
                    !unlockedDeals.some(
                        (deal) => deal.promoCode === winningDeal.promoCode,
                    )
                ) {
                    unlockedDeals.push(winningDeal);
                    saveUnlockedDeals(winningDeal);
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

    // Handle Navigation to Unlocked Deals view
    let isUnlockedView = false;
    let navBtn = document.querySelector(
        '.special-offer__view-unlock-deals-btn',
    );
    let unlockedDealsContainer = document.querySelector(
        '.special-offer__unlocked-deals-card-container',
    );
    let spinnerContainer = document.querySelector(
        '.special-offer__spin-container',
    );
    let headingOnDrawer = document.querySelector('.special-offer__heading');
    let instructionOnDrawer = document.querySelector(
        '.special-offer__instruction',
    );
    const template = document.querySelector('template');

    /**
     * Function for rendering deals cards in the View
     */
    function renderUnlockedDeals(deals) {
        if (!unlockedDealsContainer || !template) return;
        const sortedDeals = [...deals].sort(
            (a, b) => Number(a.validFor) - Number(b.validFor),
        );

        const noDealsText = document.querySelector(
            '.special-offer__no-deals-unlock-state',
        );

        if (sortedDeals.length === 0) {
            noDealsText.style.display = 'block';
            return;
        } else {
            noDealsText.style.display = 'none';
        }
        sortedDeals.forEach((deal) => {
            const alreadyExist = unlockedDealsContainer.querySelector(
                `[data-promo-code="${deal.promoCode}"]`,
            );
            if (alreadyExist) return;
            const timeLeft =
                deal.expiresAt != null ? deal.expiresAt - Date.now() : null;
            const isExpired = deal.expiresAt != null && timeLeft <= 0;
            const card =
                template.content.cloneNode(true).firstElementChild.children[1];
            const cardContent = card.querySelector(
                '.special-offer__card-content',
            );
            card.setAttribute('data-promo-code', deal.promoCode);
            const dealName = card.querySelector('.special-offer__deal-name');
            const dealValidity = card.querySelector(
                '.special-offer__deal-validity',
            );
            const dealCode = card.querySelector('.special-offer__deal-code');
            const copyBtn = card.querySelector('.icon-copy');
            if (dealName) dealName.textContent = deal.label;
            if (dealValidity)
                dealValidity.textContent = isExpired
                    ? 'Deal Expired'
                    : `Expires in ${deal.validFor}d`;
            if (dealCode) dealCode.textContent = deal.promoCode;
            if (copyBtn && !isExpired) {
                copyBtn.addEventListener('click', () => {
                    copyCodeToClipboard(deal.promoCode, copyBtn);
                });
            }
            if (isExpired) {
                cardContent.classList.add('card--expired');
                dealValidity.classList.add('card__validity--expired');
                copyBtn.style.color = textPrimaryVariant;
            }
            unlockedDealsContainer.appendChild(card);
        });
    }

    /**
     * Function for showing Unlocked Deals on the Unlocked deals container
     */
    function displayUnlockedDeals() {
        if (!unlockedDealsContainer || !template) return;
        isUnlockedView = !isUnlockedView;
        unlockedDealsContainer.style.display = isUnlockedView ? 'flex' : 'none';
        spinnerContainer.style.display = isUnlockedView ? 'none' : 'flex';

        if (unlockedDealsCard) {
            unlockedDealsCard.style.display = isUnlockedView ? 'none' : 'block';
        }
        navBtn.classList.toggle('special-offer__back-btn', isUnlockedView);
        const textSpan = navBtn.querySelector('.special-offer__btn-label');
        const heading = isUnlockedView ? 'Unlocked Deals' : 'Spin & Win!';
        const instruction = isUnlockedView
            ? 'All the deals you’ve unlocked yet!'
            : 'Tap the center of the wheel to spin';
        if (headingOnDrawer) headingOnDrawer.textContent = heading;
        if (instructionOnDrawer) instructionOnDrawer.textContent = instruction;
        const targetLabel = isUnlockedView
            ? 'Go Back'
            : 'View All Unlocked Deals';

        if (textSpan) {
            textSpan.textContent = targetLabel;
        } else {
            navBtn.childNodes[0].nodeValue = targetLabel;
        }

        const countBubble = navBtn.querySelector(
            '.special-offer__bubble-counter',
        );
        if (countBubble) {
            countBubble.style.display = isUnlockedView ? 'none' : 'flex';
        }

        if (isUnlockedView) {
            const storedDeals = JSON.parse(
                localStorage.getItem('unlockedDeals') || '[]',
            );
            renderUnlockedDeals(storedDeals);
        }
    }

    /**
     * Function to store the unlocked deals in the local storage with expiresAt timestamp
     */
    const saveUnlockedDeals = (deal) => {
        const storedDeals = JSON.parse(
            localStorage.getItem('unlockedDeals') || '[]',
        );
        const unlockedAt = Date.now();
        storedDeals.push({
            ...deal,
            unlocked: unlockedAt,
            expiresAt: unlockedAt + Number(deal.validFor) * 60 * 60 * 1000,
        });
        localStorage.setItem('unlockedDeals', JSON.stringify(storedDeals));
    };

    const startDealValidityTimer = () => {
        if (dealTimerId) {
            clearInterval(dealTimerId);
        }
        dealTimerId = setInterval(() => {
            const storedDeals = JSON.parse(
                localStorage.getItem('unlockedDeals') || '[]',
            );
            const now = Date.now();
            const updateDeals = storedDeals.map((deal) => {
                if (deal.expiresAt === null) return deal;
                const timeLeft = deal.expiresAt - now;
                return {
                    ...deal,
                    timeLeft: Math.max(timeLeft, 0),
                };
            });
            localStorage.setItem('unlockedDeals', JSON.stringify(updateDeals));
        }, 1000);
    };

    navBtn.addEventListener('click', () => {
        displayUnlockedDeals();
    });
    startDealValidityTimer();
};
