import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class BudgetCreate {
    urlRoute = window.location.hash.split('?')[0];

    constructor() {
        this.showBudgetCreate();
    }

    // Показываем создание данных
    showBudgetCreate() {
        // Строим блоки на странице urlRoute

        // Чистим страницу
        const mainPageItemsElement = document.getElementById('mainPageItems');
        mainPageItemsElement.innerHTML = '';

        // Меняем заглавление
        const mainPageTitle = document.getElementById('mainPageTitle');
        mainPageTitle.innerText = 'Создание категории доходов';
        if (this.urlRoute === '#/expense') {
            mainPageTitle.innerText = 'Создание категории расходов';
        }

        // Создаем инпут
        const mainPageItemsInput = document.createElement('input');
        mainPageItemsInput.className = 'main-page-items-input';
        mainPageItemsInput.setAttribute('type', 'text');
        mainPageItemsInput.setAttribute('placeholder', 'Название...');
        mainPageItemsInput.setAttribute('id', 'createInput');
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
        if (this.urlRoute === '#/expense') {
            errorMessageText.innerText = '- Такой расход уже есть!';
        }
        errorMessage.appendChild(errorMessageText);

        // Создаем див кнопок
        const mainPageItemOptions = document.createElement('div');
        mainPageItemOptions.className = 'main-page-item-options';
        mainPageItemsElement.appendChild(mainPageItemOptions);

        // Кнопка создать
        const mainPageItemOptionCreateElement = document.createElement('button');
        mainPageItemOptionCreateElement.className = 'main-page-item-options-edit btn btn-success me-2';
        mainPageItemOptionCreateElement.innerText = 'Создать';
        mainPageItemOptionCreateElement.setAttribute('id', 'createAgreeButton');
        mainPageItemOptions.appendChild(mainPageItemOptionCreateElement);

        // Кнопка отмена
        const mainPageItemOptionDeleteElement = document.createElement('button');
        mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
        mainPageItemOptionDeleteElement.innerText = 'Отмена';
        mainPageItemOptionDeleteElement.setAttribute('id', 'createCancelButton');
        mainPageItemOptionDeleteElement.onclick = () => {
            location.href = this.urlRoute;
        };
        mainPageItemOptions.appendChild(mainPageItemOptionDeleteElement);
        this.sendCreate();
    }

    // Создаем новое данное
    sendCreate() {
        const createInput = document.getElementById('createInput');
        const createAgreeButton = document.getElementById('createAgreeButton');
        const createCancelButton = document.getElementById('createCancelButton');
        let errorMessage = document.getElementById('errorMessage');

        createAgreeButton.onclick = async (e) => {
            if (createInput.value) {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/' + this.urlRoute.split('/')[1],
                        'POST',
                        {
                            title:createInput.value
                        });

                    if (result) {
                        if (result.error || result.message) {
                            errorMessage.style.display = 'flex';
                            throw new Error(result.message);
                        } else {
                            // Успешно, возвращаемся в данные
                            errorMessage.style.display = 'none';
                            location.href = this.urlRoute;
                        }
                    } else {
                        throw new Error(result.message);
                    }

                } catch (e) {
                    return console.log(e);
                }
            }
        }
        createCancelButton.onclick = () => {
            location.href = this.urlRoute;
        }
    }
}
