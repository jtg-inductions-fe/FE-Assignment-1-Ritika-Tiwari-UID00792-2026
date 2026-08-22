// import colors from '../styles/abstracts/colors';
export function Drawer() {
    const overlay = document.body.querySelector('.special-offer');
    const specialDeals = document.getElementById('deals');
    const specialOfferConatiner = document.querySelector(
        '.special-offer__container',
    );
    const header = document.querySelector('.header__container');
    const closeBtn = document.querySelector('.special-offer__close-btn');

    //Drawer open/ close state handler function
    function closeDrawer() {
        overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
    function openDrawer() {
        header.classList.remove('navigation-open');
        overlay.style.display = 'flex';
        document.body.classList.add('no-scroll');
    }

    specialDeals.addEventListener('click', openDrawer);

    overlay.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
            closeDrawer();
        }
    });

    closeBtn.addEventListener('click', closeDrawer);

    //fetch api and initialize the deals

    async function fetchDeals() {
        const unloackedDeals = [
            { label: '20% Off Flights', promoCode: 'FLY20-X8J2', validFor: 13 },
            { label: 'VIP Lounge', promoCode: 'VIP-LMN9', validFor: 29 },
        ];
        try {
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
            let dealsOnWheel = data.filter(
                (Item) =>
                    !unloackedDeals.some(
                        (unlocked) => unlocked.label === Item.label,
                    ),
            );
            spinWheel(dealsOnWheel);
        } catch (e) {
            void e;
        } finally {
            // console.log("loading...");
        }
    }
    fetchDeals();

    /*
     * Calculates a CSS poygon clippath for any angle theta
     */
    function getSliceClipPath(angle) {
        const rad = (angle * Math.PI) / 180;
        const x = (50 + 50 * Math.sin(rad)).toFixed(2);
        const y = (50 - 50 * Math.cos(rad)).toFixed(2);
        const points = ['50% 50%', '50% 0%'];
        if (angle > 90) points.join('100% 0%');
        if (angle > 180) points.join('100% 100%');
        if (angle > 270) points.join('0% 100%');
        points.push(`${x}% ${y}%`);

        return `polygon(${points.join(', ')})`;
    }

    async function copyCodeToClipboard(code, copyIcon) {
        try {
            await navigator.clipboard.writeText(code);
            copyIcon.classList.remove('icon-copy');
            copyIcon.classList.add('icon-check-square');
        } catch (e) {
            void e;
        }
    }

    //Spin wheel login in js and dynamically render the items in the wheel
    function spinWheel(dealsOnWheel) {
        if (!dealsOnWheel || dealsOnWheel.length === 0) return;
        const shuffled = [...dealsOnWheel].sort(() => 0.5 - Math.random());
        let items = shuffled
            .slice(0, Math.min(4, dealsOnWheel.length))
            .map((item) => {
                return item;
            });
        const wheel = document.querySelector('.special-offer__spinner');
        const winPin = document.querySelector('.icon-triangle-down');

        const spinBtn = document.querySelector('.special-offer__spin-btn');
        winPin.style.color = '#f85e9f';

        if (!wheel || !spinBtn) return;

        let colorList = ['#5d50c6', '#facd49', '#06b6d4', '#f85e9f'];
        const sliceAngle = 360 / items.length;
        let currentRotation = 0;
        // wheel.innerHTML = '';
        const clipPath = getSliceClipPath(sliceAngle);
        items.forEach((item, index) => {
            const slice = document.createElement('div');
            slice.className = 'special-offer__deals-slice';
            slice.style.backgroundColor = colorList[index % colorList.length];
            slice.style.setProperty('clip-path', clipPath);
            slice.style.transform = `rotate(${index * sliceAngle}deg)`;
            const text = document.createElement('span');
            text.className = 'special-offer__items';
            text.textContent = item.label;

            // rotate the text to half of slice angle to place it in the center of slice
            text.style.transform = `rotate(${sliceAngle}deg) translateX(-100%)`;
            slice.appendChild(text);
            wheel.appendChild(slice);
        });

        let temp = document.getElementsByTagName('template')[0];
        let unloackedDealsCard = temp.content.cloneNode(true);

        spinBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * items.length);
            // calcualtion of the target angle of the winner slice from its initial angle
            const targetAngle = randomIndex * sliceAngle + sliceAngle / 2;
            // Add extra rotation to the wheel
            const extraRotation = 360 * 3;

            // calculate the exact degrees needed to move from the current position
            // we subtract the target angle to rotate the wheel backwards so the slice lands at the top pointer

            const rotation =
                extraRotation + (360 - (currentRotation % 360)) - targetAngle;

            currentRotation += rotation;
            wheel.style.transform = `rotate(${currentRotation}deg)`;

            setTimeout(() => {
                const winningDeal = items[randomIndex];
                specialOfferConatiner.insertBefore(
                    unloackedDealsCard,
                    document.querySelector(
                        '.special-offer__view-unlock-deals-btn',
                    ),
                );
                specialOfferConatiner.children[4].children[0].children[0].children[0].textContent =
                    winningDeal.label;
                specialOfferConatiner.children[4].children[0].children[0].children[1].textContent = `Expires in ${winningDeal.validFor}d`;
                specialOfferConatiner.children[4].children[0].children[1].children[0].textContent =
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
