import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import AirDatepicker from "air-datepicker";

export class OperationsCreate {
    categoryData;
    type;
    urlRoute = window.location.hash.split('?')[0];


    constructor(type) {
        this.type = type;
        this.getBudgetData(type);
    }

    // Достаем категорию для отправки операции
    async getBudgetData(type) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + type);

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Сохраняем результат в переменную
                    this.categoryData = result;
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

    // Показать страницу редактирования
    showOperation() {

        // Чистим страницу
        const container = document.getElementById('container');
        container.innerHTML = '';

        // Создаем оглавление
        const mainPageTitle = document.createElement('h1');
        mainPageTitle.className = 'main-page-title';
        mainPageTitle.innerText = 'Создание дохода/расхода';
        if (this.type === 'income') {
            mainPageTitle.innerText = 'Создание дохода';
        } else if (this.type === 'expense') {
            mainPageTitle.innerText = 'Создание расхода';
        }
        container.appendChild(mainPageTitle);


        // Создаем форму отправки
        const mainPageItems = document.createElement('form');
        mainPageItems.className = 'main-page-items flex-column d-flex';
        container.appendChild(mainPageItems);

        // Создаем выбор типа
        const selectType = document.createElement('select');
        selectType.className = 'main-page-items-input form-select';
        selectType.setAttribute('aria-label', 'Default select example');
        selectType.setAttribute('id', 'selectType');
        selectType.setAttribute('disabled', 'disabled');
        mainPageItems.appendChild(selectType);

        const selectTypeOption = document.createElement('option');
        if (this.type === 'income') {
            selectTypeOption.innerText = 'Доход';
        } else if (this.type === 'expense') {
            selectTypeOption.innerText = 'Расход';
        }
        selectType.appendChild(selectTypeOption);


        // Создаем выбор категорий
        const selectCategory = document.createElement('select');
        selectCategory.className = 'main-page-items-input form-select';
        selectCategory.setAttribute('aria-label', 'Default select example');
        selectCategory.setAttribute('id', 'selectCategory');
        mainPageItems.appendChild(selectCategory);

        this.categoryData.forEach(category => {
            const inputCategoryOption = document.createElement('option');
            inputCategoryOption.innerText = category.title;
            selectCategory.appendChild(inputCategoryOption);
        });

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
        new AirDatepicker('#inputDate', {
            autoClose: true
        });

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
        const selectType = document.getElementById('selectType');
        const selectCategory = document.getElementById('selectCategory');
        const inputAmount = document.getElementById('inputAmount');
        const inputDateElement = document.getElementById('inputDate');
        const inputComment = document.getElementById('inputComment');

        // Переворачиваем дату
        const inputDate = inputDateElement.value.split('.');
        const inputDateRevert = inputDate[2] + '-' + inputDate[1] + '-' + inputDate[0];

        // Перезаписываем в тип и достаем id категории
        let selectTypeValue;
        let selectCategoryId;
        if (selectType.value === 'Доход') {
            selectTypeValue = 'income';
            const getCategory = this.getBudgetData(selectTypeValue)
                .then((categorys) => {
                    return categorys.find((category) => {
                        if (category.title === selectCategory.value) {
                            return category.id
                        }
                    })
                })
            getCategory.then((a) => {
                if (a) {
                    selectCategoryId = a.id;
                }
            });
        } else if (selectType.value === 'Расход') {
            selectTypeValue = 'expense';
            const getCategory = this.getBudgetData(selectTypeValue)
                .then((categorys) => {
                    return categorys.find((category) => {
                        if (category.title === selectCategory.value) {
                            return category.id
                        }
                    })
                })
            getCategory.then((a) => {
                if (a) {
                    selectCategoryId = a.id;
                }
            });
        }

        setTimeout(async () => {
            const errorMessage = document.getElementById('errorMessage');

            if (selectType.value && selectCategory.value && inputAmount.value
                && inputDateElement.value && inputComment.value) {

                try {
                    const result = await CustomHttp.request(config.host + '/'
                        + this.urlRoute.split('/')[1], 'POST', {
                        type: selectTypeValue,
                        category_id: selectCategoryId,
                        amount: inputAmount.value,
                        date: inputDateRevert,
                        comment: inputComment.value
                    });
                    if (result) {
                        if (result.error || result.message) {
                            errorMessage.style.display = 'flex';
                            errorMessage.firstChild.innerText = '- Ошибка данных';
                            throw new Error(result.message);
                        } else {
                            // Успешно
                            errorMessage.style.display = 'none';
                            location.href = this.urlRoute;
                        }
                    } else {
                        errorMessage.style.display = 'flex';
                        throw new Error(result.message);
                    }

                } catch (e) {
                    errorMessage.style.display = 'flex';
                    errorMessage.firstChild.innerText = '- Сервер не работает';
                    return console.log(e);
                }
            } else {
                errorMessage.style.display = 'flex';
                errorMessage.firstChild.innerText = '- Вы ввели пустые значения';
            }
        }, 1000);
    }
}
