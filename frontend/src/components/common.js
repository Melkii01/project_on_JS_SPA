export class Common {
    constructor() {
        this.Burger();
    }

    // Бургер меню настройки
    Burger() {
        let burgerOpen = document.getElementById('burger-open');
        let burgerClose = document.getElementById('burger-close');
        let sidebar = document.getElementById('sidebar');
        let main = document.getElementById('content');

        // При клике на бургер открывается меню
        burgerOpen.onclick = () => {
            burgerOpen.style.display = 'none';
            burgerClose.style.display = 'block';
            sidebar.style.display = 'flex';
            sidebar.style.position = 'absolute';
            sidebar.style.zIndex = '1111';
        }

        // При клике на бургер закрывается меню
        burgerClose.onclick = () => {
            burgerOpen.style.display = 'block';
            burgerClose.style.display = 'none';
            sidebar.style.display = 'none';
            sidebar.style.position = 'sticky';
        }

        // При клике вне меню закрывается меню
        const screenWidth = window.screen.width;
        main.onclick = () => {
            if (screenWidth < 1024 && sidebar.style.display === 'flex') {
                burgerOpen.style.display = 'block';
                burgerClose.style.display = 'none';
                sidebar.style.display = 'none';
                sidebar.style.position = 'sticky';
            }
        }

        // При клике на ссылки в меню закрывается меню
        let links = document.querySelectorAll('.my-link-js');
        for (let link of links) {
            link.onclick = () => {
                if (screenWidth < 1024 && sidebar.style.display === 'flex') {
                    burgerOpen.style.display = 'block';
                    burgerClose.style.display = 'none';
                    sidebar.style.display = 'none';
                    sidebar.style.position = 'sticky';
                }
            }
        }
    }
}
