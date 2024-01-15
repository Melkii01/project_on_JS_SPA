import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class BudgetEdit {
    urlRoute = window.location.hash.split('?')[0];
    itemId = null;
    inputValue = null;

    constructor(itemId) {
        this.itemId = itemId;
        this.getEditData();
    }

    // Достаем название выбранного данного
    async getEditData() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' +
                this.urlRoute.split('/')[1] + '/' + this.itemId);
            console.log(result)
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    this.inputValue = result.title;
                    this.showEdit();
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    // Показываем создание данной
    showEdit() {
        // Строим блоки на странице urlRoute

        // Чистим страницу
        const mainPageItemsElement = document.getElementById('mainPageItems');
        mainPageItemsElement.innerHTML = '';

        // Меняем заглавление
        const mainPageTitle = document.getElementById('mainPageTitle');
        mainPageTitle.innerText = 'Редактирование категории доходов';
        if (this.urlRoute === '#/expense') {
            mainPageTitle.innerText = 'Редактирование категории расходов';
        }

        // Создаем инпут
        const mainPageItemsInput = document.createElement('input');
        mainPageItemsInput.className = 'main-page-items-input';
        mainPageItemsInput.setAttribute('type', 'text');
        mainPageItemsInput.setAttribute('placeholder', this.inputValue);
        mainPageItemsInput.setAttribute('id', 'editInput');
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
        mainPageItemOptionCreateElement.setAttribute('id', 'editAgreeButton');
        mainPageItemOptions.appendChild(mainPageItemOptionCreateElement);


        // Кнопка отмена
        const mainPageItemOptionDeleteElement = document.createElement('button');
        mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
        mainPageItemOptionDeleteElement.innerText = 'Отмена';
        mainPageItemOptionDeleteElement.setAttribute('id', 'editCancelButton');
        mainPageItemOptions.appendChild(mainPageItemOptionDeleteElement);

        // Запуск функции для готовности
        this.sendEdit();
    }

    // Отправка данных по клику
    sendEdit() {
        const editInput = document.getElementById('editInput');
        editInput.value = this.inputValue;
        const editAgreeButton = document.getElementById('editAgreeButton');
        const editCancelButton = document.getElementById('editCancelButton');
        const errorMessage = document.getElementById('errorMessage');

        editAgreeButton.onclick = async (e) => {
            if (editInput.value) {
                try {
                    console.log(config.host + '/categories/' + this.urlRoute.split('/')[1] + '/' + this.itemId)

                    const result = await CustomHttp.request(config.host + '/categories/' +
                        this.urlRoute.split('/')[1] + '/' + this.itemId, 'PUT', {
                        title: editInput.value
                    });
                    if (result && (result.title !== this.inputValue)) {
                        if (result.error || result.message) {
                            errorMessage.style.display = 'flex';
                            throw new Error(result.message);
                        } else {
                            // Успешно, возвращаемся в доходы
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
            }
        }
        editCancelButton.onclick = () => {
            location.href = this.urlRoute
        }
    }
}
