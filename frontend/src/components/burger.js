import {Auth} from "../services/auth";

export class Burger {
    urlRoute = window.location.hash.split('?')[0];
    sidebar = document.getElementById('sidebar');
    mainElement = document.getElementById('main');
    contentElement = document.getElementById('content');
    burgerOpen = document.getElementById('burger-open');
    burgerClose = document.getElementById('burger-close');
    screenWidth = window.screen.width;
    links = document.querySelectorAll('.my-link-js');


    constructor() {

        if (this.urlRoute === '#/login' || this.urlRoute === '#/signup') {
            // Скрываем бургер и крестик
            this.burgerOpen.style.display = 'none';
            this.burgerClose.style.display = 'none';
        } else {
            // Показываем бургер и главную страницу, если экран шириной меньше 1024
            const screenWidth = window.screen.width;
            if (screenWidth < 1024) {
                this.burgerOpen.style.display = 'block';
                this.contentElement.style.display = 'flex';
            }
            this.Burger();
        }
    }

    // Бургер меню настройки
    Burger() {
        // Слушаем ширину, показываем бургер и сайдбар, или убираем
        window.addEventListener("resize", () => {
            this.screenWidth = window.screen.width;
            if (this.screenWidth < 1024) {
                this.burgerOpen.style.display = 'block';
                this.sidebar.style.display = 'none';
                this.burgerClose.style.display = 'none';

            } else {
                this.burgerOpen.style.display = 'none';
                this.sidebar.style.display = 'flex';
                this.sidebar.style.position = 'sticky';

            }
        });

        // При клике на бургер открывается меню
        this.burgerOpen.onclick = () => {
            this.burgerOpen.style.display = 'none';
            this.burgerClose.style.display = 'block';
            this.sidebar.style.display = 'flex';
            this.sidebar.style.position = 'fixed';
            this.sidebar.style.zIndex = '1111';
        }

        // При клике на бургер закрывается меню
        this.burgerClose.onclick = () => {
            this.burgerOpen.style.display = 'block';
            this.burgerClose.style.display = 'none';
            this.sidebar.style.display = 'none';
            this.sidebar.style.position = 'sticky';
        }


        // При клике вне меню закрывается меню
        this.contentElement.onclick = () => {
            if (this.screenWidth < 1024 && this.sidebar.style.display === 'flex') {
                this.burgerOpen.style.display = 'block';
                this.burgerClose.style.display = 'none';
                this.sidebar.style.display = 'none';
                this.sidebar.style.position = 'sticky';
            }
        }

        // При клике на ссылки в меню закрывается меню
        if (this.links) {
            for (let link of this.links) {
                link.onclick = () => {
                    if (this.screenWidth < 1024 && this.sidebar.style.display === 'flex') {
                        this.burgerOpen.style.display = 'block';
                        this.burgerClose.style.display = 'none';
                        this.sidebar.style.display = 'none';
                        this.sidebar.style.position = 'sticky';
                    }
                }
            }
        }
    }
}
