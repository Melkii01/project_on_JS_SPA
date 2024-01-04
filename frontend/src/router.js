// import {Form} from "./components/form.js";
// import {Auth} from "./services/auth.js";
import {ChartPie} from "./utils/chart-pie.js";
import {Common} from "./components/common.js";


export class Router {
    constructor() {
        this.authenticationElement = document.getElementById('authentication');
        this.mainElement = document.getElementById('main');
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        // this.profileElement = document.getElementById('profile');
        // this.profilefullNameElement = document.getElementById('profile-full-name');

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
                    // new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                load: () => {
                    // new Form('login');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/income-create',
                title: 'Создать доход',
                template: 'templates/income-create.html',
                styles: 'styles/income-create.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/income-edit',
                title: 'Редактировать доход',
                template: 'templates/income-edit.html',
                styles: 'styles/income-edit.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/outcome',
                title: 'Расход',
                template: 'templates/outcome.html',
                styles: 'styles/outcome.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/outcome-create',
                title: 'Создать расход',
                template: 'templates/outcome-create.html',
                styles: 'styles/outcome-create.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/outcome-edit',
                title: 'Редактировать расход',
                template: 'templates/outcome-edit.html',
                styles: 'styles/outcome-edit.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/income-outcome',
                title: 'Доходы и расходы',
                template: 'templates/income-outcome.html',
                styles: 'styles/income-outcome.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/income-outcome-create',
                title: 'Создать доход/расход',
                template: 'templates/income-outcome-create.html',
                styles: 'styles/income-outcome-create.css',
                load: () => {
                    // new Choice();
                }
            },
            {
                route: '#/income-outcome-edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/income-outcome-edit.html',
                styles: 'styles/income-outcome-edit.css',
                load: () => {
                    // new Choice();
                }
            },
        ];
    }

    async openRoute() {

        // Если выходим с акк
        const urlRoute = window.location.hash.split('?')[0];
        // if (urlRoute === '#/logout') {
        //     Auth.logout();
        //     window.location.href = '#/login';
        //     return;
        // }

        // Если в url совпадает имя страницы, сохраняет в переменной эту страницу
        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        // Если нет совпадений скидываем на главную страницу
        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        // Авторизация или регистрация (также бургер)
        let burgerOpen = document.getElementById('burger-open');
        let burgerClose = document.getElementById('burger-close');

        if (urlRoute === '#/login' || urlRoute === '#/signup') {
            burgerOpen.style.display = 'none';
            burgerClose.style.display = 'none';

            this.authenticationElement.innerHTML =
                await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            this.authenticationElement.style.display = 'flex';
            this.mainElement.style.display = 'none';
            return;
        } else {
            const screenWidth = window.screen.width;
            if (screenWidth < 1024) {
                burgerOpen.style.display = 'block';
                this.mainElement.style.display = 'flex';

            } else if (screenWidth < 1024){
            }

            this.contentElement.innerHTML =
                await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            this.authenticationElement.style.display = 'none';
        }

        // Как-то надо проверить авторизацию, если не авторизован скинуть на авторизацию
        // const userInfo = Auth.getUserInfo();
        // const accessToken = localStorage.getItem(Auth.accessTokenKey);
        // if (userInfo && accessToken) {
        //     this.profileElement.style.display = 'flex';
        //     this.profilefullNameElement.innerText = userInfo.fullName;
        // } else {
        //     this.profileElement.style.display = 'none';
        // }

        // Основные скрипты главных элементов
        new Common();

        // Загрузка скриптов страниц по url
        newRoute.load();

    }
}
