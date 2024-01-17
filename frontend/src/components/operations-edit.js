import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Operations} from "./operations.js";

export class OperationsEdit {
    operationData;
    urlRoute = window.location.hash.split('?')[0];


    constructor(operationId) {
        this.operationId = operationId;
        this.getOperationData()
    }

    // Достаем операцию
    async getOperationData() {
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + this.operationId);

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Данные определенной операции
                    console.log(result);
                    this.operationData = result;
                    const operationDate = result.date.split('-');
                    this.operationDateRevers = operationDate[2] + '.' + operationDate[1] + '.' + operationDate[0];
                    this.showOperation();
                    return result
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    // Достаем категорию для операции
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
        mainPageTitle.innerText = 'Редактирование дохода/расхода';
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
        if (this.operationData.type === 'income') {
            inputType.setAttribute('value', 'Доход');
        } else if (this.operationData.type === 'expense') {
            inputType.setAttribute('value', 'Расход');
        }
        inputType.setAttribute('id', 'inputType');
        mainPageItems.appendChild(inputType);

        // Создаем инпут категория
        const inputCategory = document.createElement('input');
        inputCategory.className = 'main-page-items-input';
        inputCategory.setAttribute('type', 'text');
        inputCategory.setAttribute('placeholder', 'Категории...');
        if (this.operationData.category) {
            inputCategory.setAttribute('value', this.operationData.category);
        }
        if (this.operationData.category === 'Доход') {
            const getCategory =  this.getBudgetData('income')
                .then((categorys) => {
                    return categorys.find((category) => {
                        if (category.title === inputCategory.value) {
                            return category.id
                        }
                    })
                })
            getCategory.then((a) => {
                if (a) {
                    this.inputCategoryId= a.id;
                }
            });
        } else if (this.operationData.category === 'Расход') {
            const getCategory =  this.getBudgetData('expense')
                .then((categorys) => {
                    return categorys.find((category) => {
                        if (category.title === inputCategory.value) {
                            return category.id
                        }
                    })
                })
            getCategory.then((a) => {
                if (a) {
                    this.inputCategoryId= a.id;

                }
            });
        }
        inputCategory.setAttribute('id', 'inputCategory');
        mainPageItems.appendChild(inputCategory);

        // Создаем инпут сумма
        const inputAmount = document.createElement('input');
        inputAmount.className = 'main-page-items-input';
        inputAmount.setAttribute('type', 'text');
        inputAmount.setAttribute('placeholder', 'Сумма в $...');
        inputAmount.setAttribute('value', this.operationData.amount);
        inputAmount.setAttribute('id', 'inputAmount');
        mainPageItems.appendChild(inputAmount);

        // Создаем инпут дата
        const inputDate = document.createElement('input');
        inputDate.className = 'main-page-items-input';
        inputDate.setAttribute('type', 'text');
        inputDate.setAttribute('placeholder', 'Дата...');
        inputDate.setAttribute('value', this.operationDateRevers);
        inputDate.setAttribute('id', 'inputDate');
        mainPageItems.appendChild(inputDate);

        // Создаем инпут комментарий
        const inputComment = document.createElement('input');
        inputComment.className = 'main-page-items-input';
        inputComment.setAttribute('type', 'text');
        inputComment.setAttribute('placeholder', 'Комментарий...');
        inputComment.setAttribute('value', this.operationData.comment);
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
        mainPageItemOptionCreateElement.setAttribute('id', 'editAgreeButton');
        mainPageItemOptionCreateElement.onclick = () => {
            this.sendEdit();
        }
        mainPageItemOptions.appendChild(mainPageItemOptionCreateElement);


        // Кнопка отмена
        const mainPageItemOptionDeleteElement = document.createElement('button');
        mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
        mainPageItemOptionDeleteElement.innerText = 'Отмена';
        mainPageItemOptionDeleteElement.setAttribute('id', 'editCancelButton');
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
        let inputTypeValue;
        let inputCategoryId;
        if (inputType.value === 'Доход') {
            inputTypeValue = 'income';
            // const getCategory =  this.getBudgetData(inputTypeValue)
            //     .then((categorys) => {
            //         return categorys.find((category) => {
            //             if (category.title === inputCategory.value) {
            //                 return category.id
            //             }
            //         })
            //     })
            // getCategory.then((a) => {
            //     if (a) {
            //         inputCategoryId= a.id;
            //         console.log(inputCategoryId);
            //     }
            // });
        } else if (inputType.value === 'Расход') {
            inputTypeValue = 'expense';
            // const getCategory =  this.getBudgetData(inputTypeValue)
            //     .then((categorys) => {
            //         return categorys.find((category) => {
            //             if (category.title === inputCategory.value) {
            //                 return category.id
            //             }
            //         })
            //     })
            // getCategory.then((a) => {
            //     if (a) {
            //         inputCategoryId= a.id;
            //         console.log(inputCategoryId);
            //
            //     }
            // });
        }


        console.log(this.inputCategoryId);

        if (inputType.value && inputCategory.value && inputAmount.value
            && inputDateElement.value) {
            try {

                const result = await CustomHttp.request(config.host + '/'
                    + this.urlRoute.split('/')[1] + '/' + this.operationId, 'PUT', {
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


    }
}
