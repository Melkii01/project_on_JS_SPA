import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Common {
    constructor() {
        this.Burger();
        this.getBalance();
        this.changeBalance(122233)
    }

    // Бургер меню настройки
    Burger() {
        let burgerOpen = document.getElementById('burger-open');
        let burgerClose = document.getElementById('burger-close');
        let sidebar = document.getElementById('sidebar');
        let main = document.getElementById('content');

        // Слушаем ширину, показываем бургер и сайдбар, или убираем
        let screenWidth = window.screen.width;
        window.addEventListener("resize", () => {
            screenWidth = window.screen.width;
            if (screenWidth < 1024) {
                burgerOpen.style.display = 'block';
                sidebar.style.display = 'none';
            } else {
                burgerOpen.style.display = 'none';
                sidebar.style.display = 'flex';
            }
        });

        // При клике на бургер открывается меню
        burgerOpen.onclick = () => {
            burgerOpen.style.display = 'none';
            burgerClose.style.display = 'block';
            sidebar.style.display = 'flex';
            sidebar.style.position = 'fixed';
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

    async getBalance() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            console.log(result.balance, 'balance')

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Заменяем баланс
                    // let cash = document.getElementById('cash');
                    // cash.innerText = result.balance;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    async changeBalance(money) {
        try {
            const result = await CustomHttp.request(config.host + '/balance', 'PUT', {
                "newBalance": money
            });
            console.log(result, 'new balance')

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Заменяем баланс
                    let cash = document.getElementById('cash');
                    cash.innerText = result.balance;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }
}
