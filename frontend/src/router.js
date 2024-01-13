import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {ChartPie} from "./utils/chart-pie.js";
import {Burger} from "./components/burger.js";
import {Balance} from "./components/balance.js";
import {Income} from "./components/income.js";
import {IncomeCreate} from "./components/income-create.js";
import {IncomeEdit} from "./components/income-edit";


export class Router {
    constructor() {
        // Переменные
        this.authenticationElement = document.getElementById('authentication');
        this.mainElement = document.getElementById('main');
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        // this.profileElement = document.getElementById('profile');
        this.profilefullNameElement = document.getElementById('userName');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'styles/index.css',
                load: () => {
                    new ChartPie();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income.css',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/income-create',
                title: 'Создать доход',
                template: 'templates/income-create.html',
                styles: 'styles/income-create.css',
                load: () => {
                    new IncomeCreate();
                }
            },
            {
                route: '#/income-edit',
                title: 'Редактировать доход',
                template: 'templates/income-edit.html',
                styles: 'styles/income-edit.css',
                load: () => {
                }
            },
            {
                route: '#/outcome',
                title: 'Расход',
                template: 'templates/outcome.html',
                styles: 'styles/outcome.css',
                load: () => {
                    // new ();
                }
            },
            {
                route: '#/outcome-create',
                title: 'Создать расход',
                template: 'templates/outcome-create.html',
                styles: 'styles/outcome-create.css',
                load: () => {
                    // new ();
                }
            },
            {
                route: '#/outcome-edit',
                title: 'Редактировать расход',
                template: 'templates/outcome-edit.html',
                styles: 'styles/outcome-edit.css',
                load: () => {
                    // new ();
                }
            },
            {
                route: '#/income-outcome',
                title: 'Доходы и расходы',
                template: 'templates/income-outcome.html',
                styles: 'styles/income-outcome.css',
                load: () => {
                    // new ();
                }
            },
            {
                route: '#/income-outcome-create',
                title: 'Создать доход/расход',
                template: 'templates/income-outcome-create.html',
                styles: 'styles/income-outcome-create.css',
                load: () => {
                    // new ();
                }
            },
            {
                route: '#/income-outcome-edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/income-outcome-edit.html',
                styles: 'styles/income-outcome-edit.css',
                load: () => {
                    // new ();
                }
            },
        ];
    }

    async openRoute() {
        // URL адрес
        const urlRoute = window.location.hash.split('?')[0];
        console.log(urlRoute, 'текущая страница');
        // Если выходим с акк
        if (urlRoute === '#/logout') {
            Auth.logout();
            window.location.href = '#/login';
            return;
        }

        // Если в uRL совпадает имя страницы, сохраняет в переменной эту страницу
        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        // Если нет совпадений скидываем на главную страницу
        if (!newRoute) {
            console.log('return to login, если пытаемся попасть на несуществующие странички')
            window.location.href = '#/login';
            return;
        }

        // Авторизация или регистрация (также бургер)
        let burgerOpen = document.getElementById('burger-open');
        let burgerClose = document.getElementById('burger-close');

        if (urlRoute === '#/login' || urlRoute === '#/signup') {
            // Скрываем бургер и крестик
            burgerOpen.style.display = 'none';
            burgerClose.style.display = 'none';

            // Построение страницы при логине или регистрации
            this.authenticationElement.innerHTML =
                await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            this.authenticationElement.style.display = 'flex';
            this.mainElement.style.display = 'none';
        } else {
            // Построение страницы после авторизации
            this.contentElement.innerHTML =
                await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            this.authenticationElement.style.display = 'none';
            this.mainElement.style.display = 'flex';

            // Показываем бургер и главную страницу, если экран шириной меньше 1024
            const screenWidth = window.screen.width;
            if (screenWidth < 1024) {
                burgerOpen.style.display = 'block';
                this.mainElement.style.display = 'flex';
            }

            // Если не авторизован перекидываем на login
            const userInfo = Auth.getUserInfo();
            const accessToken = localStorage.getItem(Auth.accessTokenKey);

            if (userInfo && accessToken) {
                this.profilefullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
                // Загрузка баланса
                new Balance();
            } else {
                console.log('relocate to login, если не авторизованы');
                if (userInfo) {
                    localStorage.removeItem(Auth.userInfoKey)
                }
                window.location.href = '#/login';
            }
        }

        // Загрузка основных скриптов
        new Burger();

        // Загрузка скриптов страниц по url
        newRoute.load();
    }
}
