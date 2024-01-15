import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class IncomeCreate {
    constructor() {
        this.showIncomeCreate();
    }

    // Показываем создание дохода
    showIncomeCreate() {
        // Строим блоки на странице income

        // Чистим страницу
        const mainPageItemsElement = document.getElementById('mainPageItems');
        mainPageItemsElement.innerHTML = '';

        // Меняем заглавление
        const mainPageTitle = document.getElementById('mainPageTitle');
        mainPageTitle.innerText = 'Создание категории доходов';

        // Создаем инпут
        const mainPageItemsInput = document.createElement('input');
        mainPageItemsInput.className = 'main-page-items-input';
        mainPageItemsInput.setAttribute('type', 'text');
        mainPageItemsInput.setAttribute('placeholder', 'Название...');
        mainPageItemsInput.setAttribute('id', 'incomeCreateInput');
        mainPageItemsInput.setAttribute('required', 'required');
        mainPageItemsElement.appendChild(mainPageItemsInput);

        // Создаем скрытый блок
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.setAttribute('id', 'errorMessage');
        mainPageItemsElement.appendChild(errorMessage);

        // Создаем скрытый текст
        const errorMessageText = document.createElement('p');
        errorMessageText.className = 'error-message-text';
        errorMessageText.innerText = '- Такой доход уже есть!';
        errorMessage.appendChild(errorMessageText);

        // Создаем див кнопок
        const mainPageItemOptions = document.createElement('div');
        mainPageItemOptions.className = 'main-page-item-options';
        mainPageItemsElement.appendChild(mainPageItemOptions);

        // Кнопка создать
        const mainPageItemOptionCreateElement = document.createElement('button');
        mainPageItemOptionCreateElement.className = 'main-page-item-options-edit btn btn-success me-2';
        mainPageItemOptionCreateElement.innerText = 'Создать';
        mainPageItemOptionCreateElement.setAttribute('id', 'incomeCreateAgreeButton');
        mainPageItemOptions.appendChild(mainPageItemOptionCreateElement);
        // по клику запускать функцию edit

        // Кнопка отмена
        const mainPageItemOptionDeleteElement = document.createElement('button');
        mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
        mainPageItemOptionDeleteElement.innerText = 'Отмена';
        mainPageItemOptionDeleteElement.setAttribute('id', 'incomeCreateCancelButton');
        mainPageItemOptionDeleteElement.onclick = () => {
            location.href = '#/income';
        };
        mainPageItemOptions.appendChild(mainPageItemOptionDeleteElement);
        this.sendIncomeCreate();
    }

    // Создаем новый доход
    sendIncomeCreate() {
        const incomeCreateInput = document.getElementById('incomeCreateInput');
        const incomeCreateAgreeButton = document.getElementById('incomeCreateAgreeButton');
        const incomeCreateCancelButton = document.getElementById('incomeCreateCancelButton');
        let errorMessage = document.getElementById('errorMessage');

        incomeCreateAgreeButton.onclick = async (e) => {
            if (incomeCreateInput.value) {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                        title: incomeCreateInput.value
                    });

                    if (result) {
                        if (result.error || result.message) {
                            errorMessage.style.display = 'flex';
                            throw new Error(result.message);
                        } else {
                            // Успешно, возвращаемся в доходы
                            errorMessage.style.display = 'none';
                            location.href = '#/income';
                        }
                    } else {
                        throw new Error(result.message);
                    }

                } catch (e) {
                    return console.log(e);
                }
            }
        }
        incomeCreateCancelButton.onclick = () => {
            location.href = '#/income';
        }
    }
}
