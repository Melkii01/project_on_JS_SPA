import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {IncomeEdit} from "./income-edit.js";

export class Income {
    incomeDataFromServer = null;

    constructor() {
        this.getIncomeData();
    }

    // Получаем данные по доходам
    async getIncomeData() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income');

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Заменяем баланс
                    this.incomeDataFromServer = result;
                    this.showIncomeData();
                    return
                }
            } else {
                throw new Error(result.message);
            }

        } catch (e) {
            return console.log(e);
        }
    }

    // Показываем на странице доходы
    async showIncomeData() {
        // Строим блоки в этом элементе html
        const mainPageItemsElement = document.getElementById('incomeData');

        this.incomeDataFromServer.forEach(items => {
            // Создаем блок с данными
            const mainPageItemElement = document.createElement('div');
            mainPageItemElement.className = 'main-page-item col-3';
            mainPageItemElement.setAttribute('id', items.id)
            mainPageItemsElement.appendChild(mainPageItemElement);

            // Создаем название данного блока
            const mainPageItemTitleElement = document.createElement('div');
            mainPageItemTitleElement.className = 'main-page-item-title';
            mainPageItemTitleElement.innerText = items.title;
            mainPageItemElement.appendChild(mainPageItemTitleElement);

            // Создаем див кнопок
            const mainPageItemOptionsElement = document.createElement('div');
            mainPageItemOptionsElement.className = 'main-page-item-options';
            mainPageItemElement.appendChild(mainPageItemOptionsElement);

            // Кнопка редактировать
            const mainPageItemOptionEditElement = document.createElement('button');
            mainPageItemOptionEditElement.className = 'main-page-item-options-edit btn btn-primary me-2';
            mainPageItemOptionEditElement.innerText = 'Редактировать';
            mainPageItemOptionEditElement.onclick = () => {
                new IncomeEdit(items.id);
                location.href = '#/income-edit';
            };
            mainPageItemOptionsElement.appendChild(mainPageItemOptionEditElement);
            // по клику запускать функцию edit

            // Кнопка удалить
            const mainPageItemOptionDeleteElement = document.createElement('button');
            mainPageItemOptionDeleteElement.className = 'main-page-item-option-delete btn btn-danger';
            mainPageItemOptionDeleteElement.innerText = 'Удалить';
            mainPageItemOptionsElement.appendChild(mainPageItemOptionDeleteElement);
            // по клику запускать функцию delete
        })

        // Добавление блока данных
        // Создаем блок добавления данных
        const mainPageItemLinkElement = document.createElement('a');
        mainPageItemLinkElement.className = 'main-page-item main-page-item-link col-3';
        mainPageItemLinkElement.addEventListener('click', () => {
            location.href = '#/income-create';
        });
        mainPageItemsElement.appendChild(mainPageItemLinkElement);
        // По клику на блок добавлять данные

        // Название и кнопки блока нужны, иначе блок будет отличаться от других
        // Создаем название данного блока
        const mainPageItemTitleElement = document.createElement('div');
        mainPageItemTitleElement.className = 'main-page-item-title invisible';
        mainPageItemTitleElement.innerText = 'Название данных';
        mainPageItemLinkElement.appendChild(mainPageItemTitleElement);

        // Создаем блок кнопок
        const mainPageItemOptionsElement = document.createElement('div');
        mainPageItemOptionsElement.className = 'main-page-item-options invisible';
        mainPageItemLinkElement.appendChild(mainPageItemOptionsElement);

        // Кнопка редактировать
        const mainPageItemOptionEditElement = document.createElement('button');
        mainPageItemOptionEditElement.className = 'main-page-item-options-edit btn btn-primary me-2';
        mainPageItemOptionEditElement.innerText = 'Редактировать';
        mainPageItemOptionsElement.appendChild(mainPageItemOptionEditElement);

        // Кнопка удалить
        const mainPageItemOptionDeleteElement = document.createElement('button');
        mainPageItemOptionDeleteElement.className = 'main-page-item-option-delete btn btn-danger';
        mainPageItemOptionDeleteElement.innerText = 'Удалить';
        mainPageItemOptionsElement.appendChild(mainPageItemOptionDeleteElement);

        // Создаем див изображения
        const mainPageItemAddElement = document.createElement('div');
        mainPageItemAddElement.className = 'main-page-item-add';
        mainPageItemLinkElement.appendChild(mainPageItemAddElement);

        // Изображение
        const mainPageItemAddImgElement = document.createElement('img');
        mainPageItemAddImgElement.setAttribute('src', './images/add-plus.png')
        mainPageItemAddImgElement.setAttribute('alt', 'ImgPlus')
        mainPageItemAddElement.appendChild(mainPageItemAddImgElement);

    }
}
