import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import AirDatepicker from "air-datepicker";

export class OperationsEdit {
    operationData;
    categoryData;
    urlRoute = window.location.hash.split('?')[0];


    constructor(operationId) {
        this.operationId = operationId;
        this.getOperationData();
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
                    this.operationData = result;
                    const operationDate = result.date.split('-');
                    this.operationDateRevers = operationDate[2] + '.' + operationDate[1] + '.' + operationDate[0];
                    this.getBudgetData(result.type);
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
        if (this.operationData.type === 'income') {
            mainPageTitle.innerText = 'Редактирование дохода';
        } else if (this.operationData.type === 'expense') {
            mainPageTitle.innerText = 'Редактирование расхода';
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
        if (this.operationData.type === 'income') {
            selectTypeOption.innerText = 'Доход';
        } else if (this.operationData.type === 'expense') {
            selectTypeOption.innerText = 'Расход';
        }
        selectType.appendChild(selectTypeOption);

        // Создаем выбор категорий
        const selectCategory = document.createElement('select');
        selectCategory.className = 'main-page-items-input form-select';
        selectCategory.setAttribute('aria-label', 'Default select example');
        selectCategory.setAttribute('id', 'selectCategory');
        mainPageItems.appendChild(selectCategory);
        // Создаем список по типу категории
        this.categoryData.forEach(category => {
            const selectCategoryOption = document.createElement('option');
            selectCategoryOption.innerText = category.title;
            selectCategoryOption.setAttribute('value', category.id);
            selectCategory.appendChild(selectCategoryOption);
        });
        // Выбираем выбранную категорию из списка
        this.categoryData.find(category => {
            const selectCategory = document.getElementById('selectCategory');
            if (category.title === this.operationData.category) {
                const options = Array.from(selectCategory.options);
                const option = options.find(o => Number(o.value) === category.id);
                if (option) {
                    option.selected = true;
                }
            }
        });
        mainPageItems.appendChild(selectCategory);

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
        new AirDatepicker('#inputDate', {
            autoClose: true
        });

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
        mainPageItemOptionCreateElement.onclick = (e) => {
            e.preventDefault();
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
    sendEdit() {
        const selectType = document.getElementById('selectType');
        const selectCategory = document.getElementById('selectCategory');
        const inputAmount = document.getElementById('inputAmount');
        const inputDateElement = document.getElementById('inputDate');
        const inputComment = document.getElementById('inputComment');

        // Переворачиваем дату
        const inputDate = inputDateElement.value.split('.');
        const inputDateRevert = inputDate[2] + '-' + inputDate[1] + '-' + inputDate[0];

        // Перезаписываем в тип
        let selectTypeValue;
        let getCategory;
        if (selectType.value === 'Доход') {
            selectTypeValue = 'income';
            getCategory = this.categoryData.find((category) => {
                if (category.id === Number(selectCategory.value)) {
                    return category.id;
                }
            })
        } else if (selectType.value === 'Расход') {
            selectTypeValue = 'expense';
            getCategory = this.categoryData.find((category) => {
                if (category.id === Number(selectCategory.value)) {
                    return category.id;
                }
            })
        }

        setTimeout(async () => {
            const errorMessage = document.getElementById('errorMessage');

            if (selectType.value && selectCategory.value && inputAmount.value
                && inputDateElement.value && inputComment.value) {
                try {
                    const result = await CustomHttp.request(config.host + '/'
                        + this.urlRoute.split('/')[1] + '/' + this.operationId, 'PUT', {
                        type: selectTypeValue,
                        category_id: getCategory.id,
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
                errorMessage.firstChild.innerText = '- У вас остались пустые поля';
            }
        }, 1000);
    }
}
