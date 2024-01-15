import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class IncomeEdit {
    incomeId = null;

    constructor(itemId) {
        this.incomeId = itemId;
        this.getIncomeEditData();
    }

    // Достаем название выбранного дохода
    async getIncomeEditData() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income/' + this.incomeId);

            if (result) {
                if (result.error || result.message) {

                } else {
                    this.inputValue = result.title;
                    this.showIncomeEdit();
                }
            } else {
                throw new Error(result.message);
            }

        } catch (e) {
            return console.log(e);
        }
    }

    // Показываем создание дохода
    showIncomeEdit() {
        // Строим блоки на странице income

        // Чистим страницу
        const mainPageItemsElement = document.getElementById('mainPageItems');
        mainPageItemsElement.innerHTML = '';

        // Меняем заглавление
        const mainPageTitle = document.getElementById('mainPageTitle');
        mainPageTitle.innerText = 'Редактирование категории доходов';

        // Создаем инпут
        const mainPageItemsInput = document.createElement('input');
        mainPageItemsInput.className = 'main-page-items-input';
        mainPageItemsInput.setAttribute('type', 'text');
        mainPageItemsInput.setAttribute('placeholder', this.inputValue);
        mainPageItemsInput.setAttribute('id', 'incomeEditInput');
        mainPageItemsElement.appendChild(mainPageItemsInput);

        // Создаем скрытый блок
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.setAttribute('id', 'errorMessage');
        mainPageItemsElement.appendChild(errorMessage);

        // Создаем скрытый текст
        const errorMessageText = document.createElement('p');
        errorMessageText.className = 'error-message-text';
        errorMessageText.innerText = '- Такое название уже есть';
        errorMessage.appendChild(errorMessageText);

        // Создаем див кнопок
        const mainPageItemOptions = document.createElement('div');
        mainPageItemOptions.className = 'main-page-item-options';
        mainPageItemsElement.appendChild(mainPageItemOptions);

        // Кнопка создать
        const mainPageItemOptionCreateElement = document.createElement('button');
        mainPageItemOptionCreateElement.className = 'main-page-item-options-edit btn btn-success me-2';
        mainPageItemOptionCreateElement.innerText = 'Сохранить';
        mainPageItemOptionCreateElement.setAttribute('id', 'incomeEditAgreeButton');
        mainPageItemOptions.appendChild(mainPageItemOptionCreateElement);
        // по клику запускать функцию edit

        // Кнопка отмена
        const mainPageItemOptionDeleteElement = document.createElement('button');
        mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
        mainPageItemOptionDeleteElement.innerText = 'Отмена';
        mainPageItemOptionDeleteElement.setAttribute('id', 'incomeEditCancelButton');
        mainPageItemOptions.appendChild(mainPageItemOptionDeleteElement);

        // Запуск функции для готовности
        this.sendIncomeEdit();
    }

    // Отправка данных по клику
    sendIncomeEdit() {
        const incomeEditInput = document.getElementById('incomeEditInput');
        incomeEditInput.value = this.inputValue;
        const incomeEditAgreeButton = document.getElementById('incomeEditAgreeButton');
        const incomeEditCancelButton = document.getElementById('incomeEditCancelButton');
        const errorMessage = document.getElementById('errorMessage');

        incomeEditAgreeButton.onclick = async (e) => {
            if (incomeEditInput.value) {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/income/' + this.incomeId, 'PUT', {
                        title: incomeEditInput.value
                    });
                    if (result && (result.title !== this.inputValue)) {
                        if (result.error || result.message) {
                            errorMessage.style.display = 'flex';
                            throw new Error(result.message);
                        } else {
                            // Успешно, возвращаемся в доходы
                            errorMessage.style.display = 'none';
                            location.href = '#/income';
                        }
                    } else {
                        errorMessage.style.display = 'flex';
                        throw new Error(result.message);
                    }

                } catch (e) {
                    return console.log(e);
                }
            }
        }
        incomeEditCancelButton.onclick = () => {
            location.href = '#/income';
        }
    }
}
