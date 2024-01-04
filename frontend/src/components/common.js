export class Common {
    constructor() {
        this.Burger();
    }

    Burger() {
        let burgerOpen = document.getElementById('burger-open');
        let burgerClose = document.getElementById('burger-close');
        let sidebar = document.getElementById('sidebar');

        burgerOpen.onclick = () => {
            burgerOpen.style.display = 'none';
            burgerClose.style.display = 'block';
            sidebar.style.display = 'flex';
            sidebar.style.position = 'absolute';
            sidebar.style.zIndex = '1111';

        }

        burgerClose.onclick = () => {
            burgerClose.style.display = 'none';
            burgerOpen.style.display = 'block';
            sidebar.style.display = 'none';
            sidebar.style.position = 'sticky';

        }
    }
}
