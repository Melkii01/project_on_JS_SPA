import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Popup} from "../utils/popup.js";
import {OperationsEdit} from "./operations-edit.js";
import {OperationsCreate} from "./operations-create.js";
import AirDatepicker from 'air-datepicker';

export class Operations {
    urlRoute = window.location.hash.split('?')[0];
    todayDate = new Date().toLocaleDateString().split('.');
    todayDateRevers = this.todayDate[2] + '-' + this.todayDate[1] + '-' + this.todayDate[0];
    operationsData;

    constructor() {
        const btnBlock = document.querySelectorAll('.btn-outline-secondary');
        const showAll = document.getElementById('showAll');

        // Показывает изначально все операции
        btnBlock.forEach((item) => {
            item.classList.remove('active');
        })
        this.getOperationsData('all');
        showAll.classList.add('active');

        // Кнопки выбора времени показа операций
        // На каждую кнопку навешиваем клик для показа периода
        let arrPeriod = ['intervalToday', 'week', 'month', 'year', 'all'];
        btnBlock.forEach((item,i) => {
            item.onclick = () => {
                btnBlock.forEach((i) => i.classList.remove('active')
                )
                this.getOperationsData(arrPeriod[i]);
                item.classList.add('active');
            }
        })

        // Прослушка на инпуты кнопки интервал
        const showInterval = document.getElementById('showInterval');
        const startDateLabel = document.getElementById('startDateLabel');
        const endDateLabel = document.getElementById('endDateLabel');

        // Показ по интервалу
        let startDateValue;
        let endDateValue;
        new AirDatepicker('#startDate', {
            onSelect: function ({formattedDate}) {
                startDateLabel.innerText = 'Дата';
                showInterval.setAttribute('disabled', 'disabled');
                if (formattedDate) {
                    startDateLabel.innerText = formattedDate;
                    if (endDateValue) {
                        showInterval.removeAttribute('disabled');
                    }
                }
                startDateValue = formattedDate;
            },
            autoClose: true
        });

        new AirDatepicker('#endDate', {
            onSelect: function ({formattedDate}) {
                endDateLabel.innerText = 'Дата';
                showInterval.setAttribute('disabled', 'disabled');
                if (formattedDate) {
                    endDateLabel.innerText = formattedDate;
                    if (startDateValue) {
                        showInterval.removeAttribute('disabled');
                    }
                }
                endDateValue = formattedDate;
            },
            autoClose: true
        });

        showInterval.onclick = () => {
            if (startDateValue && endDateValue) {
                let startDateValueData = startDateValue.split('.');
                let startDateValueRevert = startDateValueData[2] + '-' + startDateValueData[1] + '-' + startDateValueData[0];

                let endDateValueData = endDateValue.split('.');
                let endDateValueRevert = endDateValueData[2] + '-' + endDateValueData[1] + '-' + endDateValueData[0];

                btnBlock.forEach((item)=>{
                    item.classList.remove('active');
                })
                this.getOperationsData('interval', startDateValueRevert, endDateValueRevert);
                showInterval.classList.add('active');

            }
        }

        // Кнопки создать расход или доход
        const createIncomeBtn = document.getElementById('createIncomeBtn');
        createIncomeBtn.onclick = () => {
            new OperationsCreate('income');
        }
        const createExpenseBtn = document.getElementById('createExpenseBtn');
        createExpenseBtn.onclick = () => {
            new OperationsCreate('expense');
        }
    }


    // Достаем операции по выбранному периоду
    async getOperationsData(period, startDate, endDate) {
        try {
            let result;
            if (period === 'intervalToday') {
                result = await CustomHttp.request(config.host +
                    '/operations?period=interval&dateFrom=' + this.todayDateRevers
                    + '&dateTo=' + this.todayDateRevers);
            } else if (period === 'interval') {
                result = await CustomHttp.request(config.host +
                    '/operations?period=interval&dateFrom=' + startDate
                    + '&dateTo=' + endDate);
            } else {
                result = await CustomHttp.request(config.host +
                    '/operations?period=' + period);
            }
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Сохраняем результат в переменную
                    this.operationsData = result;
                    this.showOperations();
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

// Создаем таблицу по данным операциям
    showOperations() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        // Проверка на пустотность данных
        if (this.operationsData.length === 0) {
            const tr = document.createElement('tr');
            tr.innerText = 'Данных нет';
            tr.style.fontSize = '20px'
            tableBody.appendChild(tr);
        } else {
            this.operationsData.forEach((operation) => {
                    const tr = document.createElement('tr');
                    tableBody.appendChild(tr);

                    // Порядковый номер
                    const number = document.createElement('th');
                    number.setAttribute('scope', 'row');
                    number.innerText = operation.id;
                    tr.appendChild(number);

                    // Доход/расход
                    const type = document.createElement('td');
                    if (operation.type === 'income') {
                        type.className = 'text-success';
                        type.innerText = 'доход';
                    } else if (operation.type === 'expense') {
                        type.className = 'text-danger';
                        type.innerText = 'расход';
                    }
                    tr.appendChild(type);

                    // Категория
                    const category = document.createElement('td');

                    if (operation.type === 'income') {
                        const getCategory = this.getBudgetData(operation.type)
                            .then((categorys) => {
                                return categorys.find((category) => {
                                    if (category.title === operation.category) {
                                        return category.title
                                    }
                                })
                            })
                        getCategory.then((a) => {
                            if (a) {
                                category.innerText = a.title;
                            }
                        });
                    } else if (operation.type === 'expense') {
                        const getCategory = this.getBudgetData(operation.type)
                            .then((categorys) => {
                                return categorys.find((category) => {
                                    if (category.title === operation.category) {
                                        return category.title
                                    }
                                })
                            })
                        getCategory.then((a) => {
                            if (a) {
                                category.innerText = a.title;
                            }
                        });
                    }
                    tr.appendChild(category);

                    // Стоимость
                    const price = document.createElement('td');
                    price.innerText = operation.amount + '$';
                    tr.appendChild(price);

                    // Дата
                    const date = document.createElement('td');
                    const day = operation.date.split('-');
                    date.innerText = day[2] + '.' + day[1] + '.' + day[0];
                    tr.appendChild(date);

                    // Комментарий
                    const comment = document.createElement('td');
                    comment.innerText = operation.comment;
                    tr.appendChild(comment);


                    // Опция удаления и редактирования
                    const options = document.createElement('td');
                    tr.appendChild(options);

                    // Опция редактирования
                    const linkEdit = document.createElement('a');
                    linkEdit.className = 'table-link text-decoration-none me-2';
                    linkEdit.setAttribute('href', 'javascript:void(0)');
                    linkEdit.insertAdjacentHTML('beforeend', `<svg class="table-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 16" fill="none">
                                    <path class="table-svg" d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="black"/>
                                </svg>`);
                    linkEdit.onclick = async () => {
                        new OperationsEdit(operation.id);
                    }
                    options.appendChild(linkEdit);

                    // Опция удаления
                    const linkDelete = document.createElement('a');
                    linkDelete.className = 'table-link text-decoration-none me-2';
                    linkDelete.setAttribute('href', 'javascript:void(0)');
                    linkDelete.insertAdjacentHTML('beforeend', `<svg class="table-svg" width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path class="table-svg" d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black"/>
                                    <path class="table-svg" d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black"/>
                                    <path class="table-svg" d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black"/>
                                    <path class="table-svg" fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black"/>
                                </svg>`);
                    linkDelete.onclick = async () => {
                        new Popup('Удалить эту операцию?', this.urlRoute, operation.id);
                    }
                    options.appendChild(linkDelete);
                }
            )
        }
    }
}
