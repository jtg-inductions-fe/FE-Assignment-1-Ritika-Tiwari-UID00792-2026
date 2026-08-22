export function Drawer() {
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
    function openDrawer() {
        header.classList.remove('navigation-open');
        overlay.style.display = 'flex';
        document.body.classList.add('no-scroll');
    }

    /**
     * Drawer close state handler function
     */
    function closeDrawer() {
        overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    specialDeals.addEventListener('click', openDrawer);
    overlay.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
            closeDrawer();
        }
    });
    closeBtn.addEventListener('click', closeDrawer);

    /**
     * Async function to fetch special offer deals from api and initialize the deals
     */
    async function fetchDeals() {
        const spinner = document.querySelector('.special-offer__spinner');
        const loader = document.querySelector('.special-offer__loader');

        if (typeof winPin !== 'undefined') {
            winPin.style.color = '#eeeeee';
        }
        if (spinner) spinner.style.display = 'none';
        if (loader) loader.style.display = 'flex';
        try {
            const response = await fetch(
                'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/',
            );
            const data = await response.json();

            // filter null values
            for (let i in data) {
                if (data[i]['validFor'] == null) {
                    data[i]['validFor'] = 7;
                }
            }

            // filter unlocked deals from the deals coming from api to show locked deals on wheel
            const unlockedList =
                typeof unlockedDeals !== 'undefined' ? unlockedDeals : [];
            let dealsOnWheel = data.filter(
                (Item) =>
                    !unlockedList.some(
                        (unlocked) => unlocked.label === Item.label,
                    ),
            );

            spinWheel(dealsOnWheel);
        } catch (e) {
            void e;
        } finally {
            if (spinner) spinner.style.display = 'flex';
            if (loader) loader.style.display = 'none';
        }
    }
    fetchDeals();

    /**
     * Async function to copy code for deals on clipboard
     */
    async function copyCodeToClipboard(code, copyIcon) {
        try {
            await navigator.clipboard.writeText(code);
            copyIcon.classList.remove('icon-copy');
            copyIcon.classList.add('icon-check-square');
        } catch (e) {
            void e;
        }
    }

    /**
     * function to update unlocked deals count on bubble on the button
     */
    function displayCountOfUnlockedDeals(count) {
        const bubble = document.querySelector('.special-offer__bubble-counter');
        bubble.textContent = count;
    }

    /**
     * Spin wheel logic in js and dynamically render the items in wheel
     */
    function spinWheel(dealsOnWheel) {
        if (!dealsOnWheel || dealsOnWheel.length === 0) return;
        const shuffled = [...dealsOnWheel].sort(() => 0.5 - Math.random());
        let items = shuffled
            .slice(0, Math.min(4, dealsOnWheel.length))
            .map((item) => {
                return item;
            });
        const wheel = document.querySelector('.special-offer__spinner');
        const spinBtn = document.querySelector('.special-offer__spin-btn');
        winPin.style.color = '#f85e9f';

        if (!wheel || !spinBtn) return;
        let currentRotation = 0;
        const slices = document.querySelectorAll(
            '.special-offer__spinner-items',
        );
        let sliceTextPosition = [0, -90, 90, 180];
        items.forEach((item, index) => {
            const sliceText = document.createElement('span');
            sliceText.setAttribute(
                'class',
                'special-offer__spinner-items-label',
            );
            sliceText.textContent = item.label;
            sliceText.style.transform = `rotate(${sliceTextPosition[index] - 45}deg)`;
            slices[index].appendChild(sliceText);
        });

        let temp = document.getElementsByTagName('template')[0];
        let clone = temp.content.cloneNode(true);
        let unloackedDealsCard = clone.firstElementChild;

        spinBtn.addEventListener('click', () => {
            if (specialOfferContainer.contains(unloackedDealsCard)) {
                unloackedDealsCard.style.display = 'none';
            }
            const randomIndex = Math.floor(Math.random() * items.length);

            // calcualtion of the target angle of the winner slice from its initial angle
            const slicePosition = [0, -90, 90, 180];
            const targetAngle = slicePosition[randomIndex];

            // Add extra rotation to the wheel
            const extraRotation = 360 * 3;

            /* Calculate the exact degrees needed to move from the current position,
            we subtract the target angle to rotate the wheel backwards so the slice lands at the top pointer */
            const rotation =
                extraRotation + (360 - (currentRotation % 360)) - targetAngle;

            currentRotation += rotation;
            wheel.style.transform = `rotate(${currentRotation + 45}deg)`;

            setTimeout(() => {
                const sliceTextList = document.querySelectorAll(
                    '.special-offer__spinner-items-label',
                );
                sliceTextList[randomIndex].style.color = 'black';
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
                if (copyIcon.classList.contains('icon-check-square')) {
                    copyIcon.classList.remove('icon-check-sqaure');
                    copyIcon.classList.add('icon-copy');
                }
                copyIcon.addEventListener('click', () => {
                    copyCodeToClipboard(winningDeal.promoCode, copyIcon);
                });
            }, 4000);
        });
    }
}
