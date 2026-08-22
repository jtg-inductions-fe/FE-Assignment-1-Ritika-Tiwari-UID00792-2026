// import colors from '../styles/abstracts/colors';
export function Drawer() {
    const overlay = document.body.querySelector('.special-offer');
    const specialDeals = document.getElementById('deals');
    const specialOfferConatiner = document.querySelector(
        '.special-offer__container',
    );
    const header = document.querySelector('.header__container');
    const closeBtn = document.querySelector('.special-offer__close-btn');
    const unloackedDeals = [];
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

    async function copyCodeToClipboard(code, copyIcon) {
        try {
            await navigator.clipboard.writeText(code);
            copyIcon.classList.remove('icon-copy');
            copyIcon.classList.add('icon-check-square');
        } catch (e) {
            void e;
        }
    }
    function displayCountOfUnlockedDeals(count) {
        const bubble = document.querySelector('.special-offer__bubble-counter');
        bubble.textContent = count;
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
        let currentRotation = 0;
        const slices = document.querySelectorAll(
            '.special-offer__spinner-items',
        );
        items.forEach((item, index) => {
            const sliceText = document.createElement('span');
            sliceText.setAttribute(
                'class',
                'special-offer__spinner-items-label',
            );
            sliceText.textContent = item.label;
            let angle = -45;
            sliceText.style.transform = `rotate(${angle}deg)`;
            angle += 90;
            slices[index].appendChild(sliceText);
        });

        let temp = document.getElementsByTagName('template')[0];
        let unloackedDealsCard = temp.content.cloneNode(true);

        spinBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * items.length);
            // calcualtion of the target angle of the winner slice from its initial angle
            const slicePosition = [0, -90, 90, 180];
            const targetAngle = slicePosition[randomIndex];
            // Add extra rotation to the wheel
            const extraRotation = 360 * 3;

            // calculate the exact degrees needed to move from the current position
            // we subtract the target angle to rotate the wheel backwards so the slice lands at the top pointer

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
                specialOfferConatiner.insertBefore(
                    unloackedDealsCard,
                    document.querySelector(
                        '.special-offer__view-unlock-deals-btn',
                    ),
                );
                unloackedDeals.push(winningDeal);
                //calling unlock deals function to show the number of deals into bubble
                displayCountOfUnlockedDeals(unloackedDeals.length);
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
