// import colors from '../styles/abstracts/colors';
export function Drawer() {
    const overlay = document.body.querySelector('.special-offer');
    const specialDeals = document.getElementById('deals');
    // const specialOfferConatiner = document.querySelector(
    //     '.special-offer__container',
    // );
    const header = document.querySelector('.header__container');
    const closeBtn = document.querySelector('.special-offer__close-btn');

    function closeDrawer() {
        overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    specialDeals.addEventListener('click', () => {
        header.classList.remove('navigation-open');
        overlay.style.display = 'flex';
        document.body.classList.add('no-scroll');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target == e.currentTarget) {
            closeDrawer();
        }
    });

    closeBtn.addEventListener('click', () => {
        closeDrawer();
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

    //Spin wheel login in js and dynamically render the items in the wheel
    function spinWheel(dealsOnWheel) {
        let items = [];
        let i = 0;
        while (i < 4) {
            let item =
                dealsOnWheel[Math.floor(Math.random() * dealsOnWheel.length)];
            if (!items.includes(item)) {
                items.push(item.label);
                i++;
            }
        }
        const wheel = document.querySelector('.special-offer__spinner');
        const spinBtn = document.querySelector('.special-offer__spin-btn');
        const sliceAngle = 360 / items.length;
        const winPin = document.querySelector('.icon-triangle-down');
        winPin.style.color = '#f85e9f';
        let colorList = ['#5d50c6', '#facd49', '#06b6d4', '#f85e9f'];
        const colors = items.map((_, index) => {
            const start = index * sliceAngle;
            const end = (index + 1) * sliceAngle;
            let itemColor = colorList[index % colorList.length];
            if (index == items.length - 1) {
                itemColor = colorList[index % colorList.length];
            }
            return `${itemColor} ${start}deg ${end - 2}deg,
        ${'#ffffff'} ${end - 2}deg ${end}deg`;
        });
        wheel.style.background = `conic-gradient(${colors.join(', ')})`;
        //add text in the slices of wheel
        items.forEach((item, index) => {
            const text = document.createElement('span');
            text.className = 'special-offer__items';
            text.textContent = item;
            const angle = index * sliceAngle;
            // rotate the text to half of slice angle to place it in the center of slice
            text.style.transform = `rotate(${angle}deg) translateY(-80px)`;
            wheel.appendChild(text);
        });

        // let temp = document.getElementsByTagName('template')[0];
        // let unloackedDealsCard = temp.content.cloneNode(true);
        let currentRotation = 0;
        // let result;

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
            // result = items[randomIndex];
        });
    }
    // spinWheel();
}
