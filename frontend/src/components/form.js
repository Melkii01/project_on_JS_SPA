import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.formBtnElement = null;
        this.page = page;
        this.formBtnElement = null;
        this.passwordCheck = null;

        // Если токен есть, открываем главную страницу
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
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
                regex: /.*/,
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
                    regex: /^[A-ЯЁ][а-яё]+\s[A-ЯЁ][а-яё]+(\s[A-ЯЁ][а-яё]+)?$/,
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
                    regex: /.*/,
                    valid: false,
                }
            ];
        }

        // При изменении инпутов запускаем validateField
        const that = this;

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);

            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        //  При клике запускаем progressForm
        this.formBtnElement = document.getElementById('form-btn');

        this.formBtnElement.onclick = function () {
            that.progressForm();
        };
    }

    // Проверяем на правильность ввода, красим бордер на красный или убираем, запускаем validateForm
    validateField(field, element) {

        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.border = '2px solid red';
            element.parentNode.style.borderRadius = '6px';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }

        // Записываем пароль в переменную passwordCheck
        if (field.name === 'password') {
            this.passwordCheck = element.value;
        }
        // Проверяем если passwordCheck не совпадает с повтором пароля, красим в красный
        if (field.name === 'passwordRepeat') {
            if (element.value !== this.passwordCheck) {
                element.parentNode.style.border = '2px solid red';
                element.parentNode.style.borderRadius = '6px';
                field.valid = false;
            } else {
                element.parentNode.removeAttribute('style');
                field.valid = true;
            }
        }

        this.validateForm();
    }

    // Возвращаем true или false
    validateForm() {
        const validForm = this.fields.every(item => item.valid);

        // Разблокируем кнопку если валидация верна
        if (validForm) {
            this.formBtnElement.removeAttribute('disabled');
        } else {
            this.formBtnElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    // Отправка формы, регистрация, запись токена сессии
    async progressForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            let rememberMe = true;
            let errorMessage = document.getElementById('error-message');
            if (this.page === 'signup') {

                const passwordRepeat = this.fields.find(item => item.name === 'passwordRepeat').element.value;
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                            name: this.fields.find(item => item.name === 'name').element.value.split(' ')[0],
                            lastName: this.fields.find(item => item.name === 'name').element.value.split(' ')[1],
                            email: email,
                            password: password,
                            passwordRepeat: passwordRepeat
                        }
                    );

                    if (result) {
                        if (result.error || !result.user) {
                            errorMessage.style.display = 'block';
                            throw new Error(result.message);
                        }
                    } else {
                        errorMessage.style.display = 'block';
                        throw new Error(result.message);
                    }
                } catch (e) {
                    errorMessage.style.display = 'block';
                    return console.log(e);
                }
            }

            if (this.page === 'login') {
                rememberMe = document.getElementById('formCheck').checked;
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                        email: email,
                        password: password,
                        rememberMe: rememberMe
                    }
                );
                if (result) {
                    if (result.error || result.message) {
                        errorMessage.style.display = 'block';
                        throw new Error(result.message);
                    } else {
                        Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        Auth.setUserInfo({
                            name: result.user.name,
                            lastName: result.user.lastName,
                            userId: result.user.id
                        })
                        location.href = '#/';
                    }
                } else {
                    errorMessage.style.display = 'block';
                    throw new Error(result.message);
                }
            } catch (e) {
                errorMessage.style.display = 'block';
                return console.log(e);
            }
        }
    }
}
