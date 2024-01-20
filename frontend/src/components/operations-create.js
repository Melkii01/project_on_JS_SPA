import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class OperationsCreate {
    category;
    urlRoute = window.location.hash.split('?')[0];


    constructor(type) {
        this.type = type;
        this.showOperation(this.type);
    }

    // Достаем категорию для отправки операции
    async getBudgetData(category) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + category);

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Сохраняем результат в переменную
                    return result
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    // Показать страницу редактирования
    showOperation() {

        // Чистим страницу
        const container = document.getElementById('container');
        container.innerHTML = '';

        // Создаем оглавление
        const mainPageTitle = document.createElement('h1');
        mainPageTitle.className = 'main-page-title';
        mainPageTitle.innerText = 'Создание дохода/расхода';
        container.appendChild(mainPageTitle);


        // Создаем форму отправки
        const mainPageItems = document.createElement('form');
        mainPageItems.className = 'main-page-items flex-column d-flex';
        container.appendChild(mainPageItems);

        // Создаем инпут тип
        const inputType = document.createElement('input');
        inputType.className = 'main-page-items-input';
        inputType.setAttribute('type', 'text');
        inputType.setAttribute('placeholder', 'Тип...');
        if (this.type === 'income') {
            inputType.setAttribute('value', 'Доход');
        } else if (this.type === 'expense') {
            inputType.setAttribute('value', 'Расход');
        }
        inputType.setAttribute('id', 'inputType');
        mainPageItems.appendChild(inputType);

        // Создаем инпут категория
        const inputCategory = document.createElement('input');
        inputCategory.className = 'main-page-items-input';
        inputCategory.setAttribute('type', 'text');
        inputCategory.setAttribute('placeholder', 'Категории...');
        inputCategory.setAttribute('href', 'javascript:void(0)');
        inputCategory.setAttribute('id', 'inputCategory');
        mainPageItems.appendChild(inputCategory);

        // Создаем инпут сумма
        const inputAmount = document.createElement('input');
        inputAmount.className = 'main-page-items-input';
        inputAmount.setAttribute('type', 'text');
        inputAmount.setAttribute('placeholder', 'Сумма в $...');
        inputAmount.setAttribute('href', 'javascript:void(0)');
        inputAmount.setAttribute('id', 'inputAmount');
        mainPageItems.appendChild(inputAmount);

        // Создаем инпут дата
        const inputDate = document.createElement('input');
        inputDate.className = 'main-page-items-input';
        inputDate.setAttribute('type', 'text');
        inputDate.setAttribute('placeholder', 'Дата...');
        inputDate.setAttribute('id', 'inputDate');
        mainPageItems.appendChild(inputDate);

        // Создаем инпут комментарий
        const inputComment = document.createElement('input');
        inputComment.className = 'main-page-items-input';
        inputComment.setAttribute('type', 'text');
        inputComment.setAttribute('placeholder', 'Комментарий...');
        inputComment.setAttribute('id', 'inputComment');
        mainPageItems.appendChild(inputComment);

        // Создаем скрытый блок
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.setAttribute('id', 'errorMessage');
        mainPageItems.appendChild(errorMessage);

        // Создаем скрытый текст
        const errorMessageText = document.createElement('p');
        errorMessageText.className = 'error-message-text';
        errorMessageText.innerText = '- Что-то пошло не так';
        errorMessage.appendChild(errorMessageText);

        // Создаем див кнопок
        const mainPageItemOptions = document.createElement('div');
        mainPageItemOptions.className = 'main-page-item-options';
        mainPageItems.appendChild(mainPageItemOptions);

        // Кнопка сохранить
        const mainPageItemOptionCreateElement = document.createElement('button');
        mainPageItemOptionCreateElement.className = 'main-page-item-options-edit btn btn-success me-2';
        mainPageItemOptionCreateElement.innerText = 'Сохранить';
        mainPageItemOptionCreateElement.setAttribute('id', 'agreeButton');
        mainPageItemOptionCreateElement.onclick = (e) => {
            e.preventDefault();
            this.sendEdit();
        }
        mainPageItemOptions.appendChild(mainPageItemOptionCreateElement);


        // Кнопка отмена
        const mainPageItemOptionDeleteElement = document.createElement('button');
        mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
        mainPageItemOptionDeleteElement.innerText = 'Отмена';
        mainPageItemOptionDeleteElement.setAttribute('id', 'cancelButton');
        mainPageItemOptionDeleteElement.onclick = () => {
            location.href = this.urlRoute;
        }
        mainPageItemOptions.appendChild(mainPageItemOptionDeleteElement);
    }

// Отправка данных по клику
    async sendEdit() {
        const inputType = document.getElementById('inputType');
        const inputCategory = document.getElementById('inputCategory');
        const inputAmount = document.getElementById('inputAmount');
        const inputDateElement = document.getElementById('inputDate');
        const inputComment = document.getElementById('inputComment');
        const errorMessage = document.getElementById('errorMessage');

        // Переворачиваем дату
        const inputDate = inputDateElement.value.split('.');
        const inputDateRevert = inputDate[2] + '-' + inputDate[1] + '-' + inputDate[0];

        // Перезаписываем в тип
        let inputTypeValue ;
        let inputCategoryId;
        if (inputType.value === 'Доход') {
            inputTypeValue = 'income';
            const getCategory =  this.getBudgetData(inputTypeValue)
                .then((categorys) => {
                    return categorys.find((category) => {
                        if (category.title === inputCategory.value) {
                            return category.id
                        }
                    })
                })
            getCategory.then((a) => {
                if (a) {
                    inputCategoryId= a.id;
                    console.log(a);
                }
            });
        } else if (inputType.value === 'Расход') {
            inputTypeValue = 'expense';
            const getCategory =  this.getBudgetData(inputTypeValue)
                .then((categorys) => {
                    return categorys.find((category) => {
                        if (category.title === inputCategory.value) {
                            return category.id
                        }
                    })
                })
            getCategory.then((a) => {
                if (a) {
                    inputCategoryId= a.id;
                    console.log(a);
                }
            });
        }


        console.log(inputCategoryId);

        setTimeout(async () => {
            console.log("Delayed for 3 second.");

            if (inputType.value && inputCategory.value && inputAmount.value
                && inputDateElement.value) {
                try {

                    const result = await CustomHttp.request(config.host + '/'
                        + this.urlRoute.split('/')[1], 'POST', {
                        type: inputTypeValue,
                        amount: inputAmount.value,
                        date: inputDateRevert,
                        comment: inputComment.value,
                        category_id: inputCategoryId
                    });
                    if (result) {
                        if (result.error || result.message) {
                            errorMessage.style.display = 'flex';
                            throw new Error(result.message);
                        } else {
                            // Успешно, возвращаемся в доходы
                            console.log('успешно')
                            errorMessage.style.display = 'none';
                            location.href = this.urlRoute;
                            console.log(inputCategoryId);
                        }
                    } else {
                        errorMessage.style.display = 'flex';
                        throw new Error(result.message);
                    }

                } catch (e) {
                    return console.log(e);
                }
            } else {
                console.log('вы  ввели пустые значения '); // надо вывести сообщение пользователю
            }
        }, 3000);
    }
}
