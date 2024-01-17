import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";
import {BudgetEdit} from "./budget-edit.js";
import {BudgetCreate} from "./budget-create.js";
import {Popup} from "../utils/popup.js";

export class Budget {
    DataFromServer ;
    urlRoute = window.location.hash.split('?')[0];

    constructor() {
        this.getBudgetData();
    }

    // Получаем данные по urlRoute
    async getBudgetData() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + this.urlRoute.split('/')[1]);

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Сохраняем результат в переменную
                    this.DataFromServer = result;
                    this.showBudgetData();
                    return
                }
            } else {
                throw new Error(result.message);
            }

        } catch (e) {
            return console.log(e);
        }
    }

    // Показываем на странице данные
    async showBudgetData() {
        // Строим блоки на странице urlRoute
        // Меняем оглавление
        const mainPageTitle = document.getElementById('mainPageTitle');
        mainPageTitle.innerText = 'Доходы';
        if (this.urlRoute === '#/expense') {
            mainPageTitle.innerText = 'Расходы';
        }
        // Чистим страницу
        const mainPageItemsElement = document.getElementById('mainPageItems');
        mainPageItemsElement.innerHTML = '';


        this.DataFromServer.forEach(items => {
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
                new BudgetEdit(items.id);
            };
            mainPageItemOptionsElement.appendChild(mainPageItemOptionEditElement);

            // Кнопка удалить
            const mainPageItemOptionDeleteElement = document.createElement('button');
            mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
            mainPageItemOptionDeleteElement.innerText = 'Удалить';
            mainPageItemOptionDeleteElement.onclick = async () => {
                if (this.urlRoute === '#/income') {
                    new Popup('Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.',
                        this.urlRoute, items.id);
                } else if (this.urlRoute === '#/expense') {
                    new Popup('Вы действительно хотите удалить категорию? Связанные расходы будут удалены навсегда.',
                        this.urlRoute, items.id);
                }
            }
            mainPageItemOptionsElement.appendChild(mainPageItemOptionDeleteElement);
        })

        // Добавление блока данных
        // Создаем блок добавления данных
        const mainPageItemLinkElement = document.createElement('a');
        mainPageItemLinkElement.className = 'main-page-item main-page-item-link col-3';
        mainPageItemLinkElement.addEventListener('click', () => {
            new BudgetCreate();
        });
        mainPageItemsElement.appendChild(mainPageItemLinkElement);

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
        mainPageItemOptionDeleteElement.className = 'main-page-item-options-delete btn btn-danger';
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
