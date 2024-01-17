import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {ChartPie} from "./utils/chart-pie.js";
import {Burger} from "./components/burger.js";
import {Balance} from "./components/balance.js";
import {Budget} from "./components/budget.js";
import {Operations} from "./components/operations.js";


export class Router {
    constructor() {
        // Переменные
        this.authenticationElement = document.getElementById('authentication');
        this.mainElement = document.getElementById('main');
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
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
                    new Budget();
                }
            },
            {
                route: '#/expense',
                title: 'Расход',
                template: 'templates/expense.html',
                styles: 'styles/expense.css',
                load: () => {
                    new Budget();
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/operations.html',
                styles: 'styles/operations.css',
                load:  () => {
                    new Operations();
                }
            },
        ];
    }

    async openRoute() {
        // URL адрес
        const urlRoute = window.location.hash.split('?')[0];

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
            window.location.href = '#/login';
            return;
        }

        if (urlRoute === '#/login' || urlRoute === '#/signup') {
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

            // Если не авторизован перекидываем на login
            const userInfo = Auth.getUserInfo();
            const accessToken = localStorage.getItem(Auth.accessTokenKey);

            if (userInfo && accessToken) {
                this.profilefullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
                // Загрузка баланса
                new Balance();
            } else {
                window.location.href = '#/login';
            }
        }

        // Загрузка основных скриптов
        new Burger();

        // Загрузка скриптов страниц по url
        newRoute.load();
    }
}
