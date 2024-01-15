import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {ChartPie} from "./utils/chart-pie.js";
import {Burger} from "./components/burger.js";
import {Balance} from "./components/balance.js";
import {Budget} from "./components/budget.js";
import {IncomeExpense} from "./components/income-expense.js";


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
                route: '#/income-expense',
                title: 'Доходы и расходы',
                template: 'templates/income-expense.html',
                styles: 'styles/income-expense.css',
                load:  () => {
                    new IncomeExpense();
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
