import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.formBtnElement = null;
        this.page = page;

        // Если токен есть, открываем главную страницу
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            console.log('токен принят, открываем главную страницу')
            location.href = '#/';
            return;
        }

        // Для страницы авторизации
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,

            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        // Для страницы регистрации
        if (page === 'signup') {
            this.fields = [
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[A-ЯЁ][а-яё]+\s[A-ЯЁ][а-яё]+$/,
                    valid: false,
                },
                {
                    name: 'email',
                    id: 'email',
                    element: null,
                    regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    valid: false,

                },
                {
                    name: 'password',
                    id: 'password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                },
                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                }
            ];
        }

        // При изменении инпутов запускаем validateField
        const that = this;

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            // ...изменении
            item.element.onchange = function () {
                console.log('input change, при изменении инпута запуск проверки');
                that.validateField.call(that, item, this);
            }

        });

        //  При клике запускаем progressForm
        this.formBtnElement = document.getElementById('form-btn');

        this.formBtnElement.onclick = function () {
            console.log('from btn, клик по кнопке');
            that.progressForm();
        };
    }

    // Проверяем на правильность ввода, красим бордер на красный или убираем, запускаем validateForm
    validateField(field, element) {
        console.log('validateField, если не правильно то красим и наоборот');
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.border = '2px solid red';
            element.parentNode.style.borderRadius = '6px';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    // Возвращаем true или false
    validateForm() {
        console.log('validateForm, отмечаем на валидность');
        return this.fields.every(item => item.valid);
    }

    // Отправка формы, регистрация, запись токена сессии
    async progressForm() {
        console.log('progressForm, запуск функции');
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            let rememberMe = true;


            if (this.page === 'signup') {
                console.log('progress signup');

                const passwordRepeat = this.fields.find(item => item.name === 'passwordRepeat').element.value;
                console.log(passwordRepeat);
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                            name: this.fields.find(item => item.name === 'name').element.value.split(' ')[0],
                            lastName: this.fields.find(item => item.name === 'name').element.value.split(' ')[1],
                            email: email,
                            password: password,
                            passwordRepeat: passwordRepeat
                        }
                    );
                    console.log(result)

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (e) {
                    return console.log(e);
                }
            }

            if (this.page === 'login') {
                rememberMe = document.getElementById('formCheck').checked;
            }

            console.log('progress login');
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                        email: email,
                        password: password,
                        rememberMe: rememberMe
                    }
                );
                console.log(result)
                if (result) {
                    if (result.error || result.message || !result.user || !result.tokens.accessToken
                        || !result.tokens.refreshToken) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id
                    })
                    location.href = '#/';
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}
